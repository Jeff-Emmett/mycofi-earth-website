import { NextRequest, NextResponse } from "next/server";
import { getZine, saveZine, getPageImagePath, readFileAsBase64, savePageImage } from "@/lib/storage";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zineId, pageNumber, maskBase64, newText, style, tone } = body;

    // Validate required fields
    if (!zineId || !pageNumber || !maskBase64 || !newText) {
      return NextResponse.json(
        { error: "Missing required fields: zineId, pageNumber, maskBase64, newText" },
        { status: 400 }
      );
    }

    // Validate Fal.ai API key
    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json(
        { error: "FAL_KEY not configured" },
        { status: 500 }
      );
    }

    // Verify zine exists
    const zine = await getZine(zineId);
    if (!zine) {
      return NextResponse.json(
        { error: "Zine not found" },
        { status: 404 }
      );
    }

    // Get existing page image
    const existingImagePath = await getPageImagePath(zineId, pageNumber);
    if (!existingImagePath) {
      return NextResponse.json(
        { error: "Page image not found" },
        { status: 404 }
      );
    }

    const existingImageBase64 = await readFileAsBase64(existingImagePath);

    // Get image dimensions and resize mask to match
    const imageBuffer = Buffer.from(existingImageBase64, "base64");
    const imageMetadata = await sharp(imageBuffer).metadata();
    const imageWidth = imageMetadata.width || 768;
    const imageHeight = imageMetadata.height || 1024;
    console.log(`Image dimensions: ${imageWidth}x${imageHeight}`);

    // Resize mask to match image dimensions
    const maskBuffer = Buffer.from(maskBase64, "base64");
    const resizedMaskBuffer = await sharp(maskBuffer)
      .resize(imageWidth, imageHeight, { fit: "fill" })
      .png()
      .toBuffer();
    const resizedMaskBase64 = resizedMaskBuffer.toString("base64");
    console.log(`Mask resized to match image: ${imageWidth}x${imageHeight}`);

    // Build the text inpainting prompt
    const textPrompt = buildTextPrompt(newText, style, tone);
    console.log(`Inpainting text on page ${pageNumber}: "${newText.slice(0, 50)}..."`);

    // Call Fal.ai FLUX Pro Fill for inpainting
    const newImageBase64 = await inpaintWithFluxFill(
      existingImageBase64,
      resizedMaskBase64,
      textPrompt,
      falKey
    );

    // Save the inpainted image
    await savePageImage(zineId, pageNumber, newImageBase64);

    // Update zine metadata
    zine.updatedAt = new Date().toISOString();
    await saveZine(zine);

    // Return success with cache-busted image URL
    const imageUrl = `/api/zine/${zineId}?image=p${pageNumber}&t=${Date.now()}`;

    return NextResponse.json({
      pageNumber,
      imageUrl,
      success: true,
    });
  } catch (error) {
    console.error("Text inpainting error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to inpaint text" },
      { status: 500 }
    );
  }
}

function buildTextPrompt(newText: string, style: string, tone: string): string {
  // Build a contextual prompt for text generation
  const styleDescriptions: Record<string, string> = {
    "punk-zine": "punk zine aesthetic, bold hand-drawn lettering, screen-printed style",
    "collage": "collage art style, cut-out letters, mixed media typography",
    "minimal": "clean minimal design, modern sans-serif typography",
    "vintage": "vintage retro style, distressed typography, aged paper texture",
    "psychedelic": "psychedelic art style, flowing organic letterforms, vibrant colors",
  };

  const toneDescriptions: Record<string, string> = {
    "rebellious": "bold, confrontational, high-contrast",
    "playful": "fun, whimsical, energetic",
    "thoughtful": "contemplative, balanced, readable",
    "informative": "clear, educational, professional",
    "poetic": "artistic, expressive, lyrical",
  };

  const styleDesc = styleDescriptions[style] || "creative zine typography";
  const toneDesc = toneDescriptions[tone] || "expressive";

  return `${styleDesc}. The text clearly reads: "${newText}". ${toneDesc} aesthetic. Bold, clear lettering that integrates seamlessly with the surrounding design. High contrast for readability.`;
}

async function inpaintWithFluxFill(
  imageBase64: string,
  maskBase64: string,
  prompt: string,
  falKey: string
): Promise<string> {
  console.log("Calling Fal.ai FLUX Pro Fill for inpainting...");

  // Use fal.run for synchronous execution
  const response = await fetch("https://fal.run/fal-ai/flux-pro/v1/fill", {
    method: "POST",
    headers: {
      "Authorization": `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: `data:image/png;base64,${imageBase64}`,
      mask_url: `data:image/png;base64,${maskBase64}`,
      prompt: prompt,
      num_inference_steps: 40,
      guidance_scale: 7.0,
      output_format: "png",
      safety_tolerance: 3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fal.ai error:", response.status, errorText);
    throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("Fal.ai inpainting response received");

  // Extract the image URL from response
  if (result.images && result.images.length > 0) {
    const imageUrl = result.images[0].url;
    console.log("Downloading inpainted image...");
    return await fetchImageAsBase64(imageUrl);
  }

  console.error("Fal.ai response:", JSON.stringify(result).slice(0, 500));
  throw new Error("No image in Fal.ai response");
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch generated image");
  }
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
