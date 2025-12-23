import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getZine, saveZine, getPageImagePath, readFileAsBase64, savePageImage } from "@/lib/storage";
import type { PageOutline } from "@/lib/gemini";

// Regeneration modes with denoising strengths
const MODE_STRENGTHS: Record<string, number> = {
  refine: 0.25,   // Keep most of image, minor tweaks
  revise: 0.5,    // Keep composition, change elements
  regenerate: 1.0 // Completely new image
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zineId, pageNumber, currentOutline, feedback, style, tone, mode = "regenerate" } = body;

    if (!zineId || !pageNumber || !currentOutline || !feedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Verify zine exists
    const zine = await getZine(zineId);
    if (!zine) {
      return NextResponse.json(
        { error: "Zine not found" },
        { status: 404 }
      );
    }

    // Update outline based on feedback using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are refining a zine page based on user feedback.

Current page outline:
- Page Number: ${currentOutline.pageNumber}
- Type: ${currentOutline.type}
- Title: ${currentOutline.title}
- Key Points: ${currentOutline.keyPoints.join(", ")}
- Image Prompt: ${currentOutline.imagePrompt}

User feedback: "${feedback}"

Style: ${style}
Tone: ${tone}

Update the page outline to incorporate this feedback. Keep the same page number and type.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "pageNumber": ${currentOutline.pageNumber},
  "type": "${currentOutline.type}",
  "title": "Updated title if needed",
  "keyPoints": ["Updated point 1", "Updated point 2"],
  "imagePrompt": "Updated detailed image prompt incorporating the feedback"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the updated outline
    let jsonStr = response;
    if (response.includes("```")) {
      const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        jsonStr = match[1];
      }
    }

    const updatedOutline = JSON.parse(jsonStr.trim()) as PageOutline;

    let imageUrl: string;

    // Use img2img for refine/revise modes, full generation for regenerate
    if (mode === "refine" || mode === "revise") {
      // Get existing image for img2img
      const existingImagePath = await getPageImagePath(zineId, pageNumber);
      if (!existingImagePath) {
        throw new Error("Existing page image not found");
      }

      const existingImageBase64 = await readFileAsBase64(existingImagePath);
      const strength = MODE_STRENGTHS[mode];

      console.log(`Using FLUX img2img with strength ${strength} for ${mode} mode`);

      // Generate with FLUX img2img via Fal.ai
      const newImageBase64 = await generateWithFluxImg2Img(
        existingImageBase64,
        updatedOutline.imagePrompt,
        strength
      );

      // Save the new image
      await savePageImage(zineId, pageNumber, newImageBase64);
      imageUrl = `/api/zine/${zineId}?image=p${pageNumber}&t=${Date.now()}`;
    } else {
      // Full regeneration - use existing generate-page endpoint
      const generateResponse = await fetch(
        new URL("/api/zine/generate-page", request.url),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zineId,
            pageNumber,
            outline: updatedOutline,
            style,
            tone,
          }),
        }
      );

      if (!generateResponse.ok) {
        throw new Error("Failed to regenerate image");
      }

      const generateResult = await generateResponse.json();
      imageUrl = generateResult.imageUrl;
    }

    // Update the zine outline
    zine.outline[pageNumber - 1] = updatedOutline;
    zine.updatedAt = new Date().toISOString();
    await saveZine(zine);

    return NextResponse.json({
      pageNumber,
      updatedOutline,
      imageUrl,
      mode,
      success: true,
    });
  } catch (error) {
    console.error("Page regeneration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to regenerate page" },
      { status: 500 }
    );
  }
}

// FLUX img2img via Fal.ai
async function generateWithFluxImg2Img(
  imageBase64: string,
  prompt: string,
  strength: number
): Promise<string> {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    throw new Error("FAL_KEY not configured");
  }

  console.log("Calling Fal.ai FLUX img2img API...");

  // Submit the request
  const submitResponse = await fetch("https://queue.fal.run/fal-ai/flux/dev/image-to-image", {
    method: "POST",
    headers: {
      "Authorization": `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: `data:image/png;base64,${imageBase64}`,
      prompt: prompt,
      strength: strength,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      image_size: {
        width: 768,
        height: 1024  // Portrait for zine pages
      },
      output_format: "png"
    }),
  });

  if (!submitResponse.ok) {
    const errorText = await submitResponse.text();
    console.error("Fal.ai submit error:", submitResponse.status, errorText);
    throw new Error(`Fal.ai API error: ${submitResponse.status}`);
  }

  const result = await submitResponse.json();

  // Check if we got a direct result or need to poll
  if (result.images && result.images.length > 0) {
    // Direct result
    const imageUrl = result.images[0].url;
    return await fetchImageAsBase64(imageUrl);
  } else if (result.request_id) {
    // Need to poll for result
    return await pollForResult(result.request_id, falKey);
  }

  throw new Error("No image in Fal.ai response");
}

async function pollForResult(requestId: string, falKey: string): Promise<string> {
  const maxAttempts = 60;
  const pollInterval = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const statusResponse = await fetch(`https://queue.fal.run/fal-ai/flux/dev/image-to-image/requests/${requestId}/status`, {
      headers: {
        "Authorization": `Key ${falKey}`,
      },
    });

    if (!statusResponse.ok) continue;

    const status = await statusResponse.json();

    if (status.status === "COMPLETED") {
      // Get the result
      const resultResponse = await fetch(`https://queue.fal.run/fal-ai/flux/dev/image-to-image/requests/${requestId}`, {
        headers: {
          "Authorization": `Key ${falKey}`,
        },
      });

      if (resultResponse.ok) {
        const result = await resultResponse.json();
        if (result.images && result.images.length > 0) {
          const imageUrl = result.images[0].url;
          return await fetchImageAsBase64(imageUrl);
        }
      }
    } else if (status.status === "FAILED") {
      throw new Error("Fal.ai generation failed");
    }
  }

  throw new Error("Fal.ai generation timed out");
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch generated image");
  }
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
