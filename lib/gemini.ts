import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization to ensure runtime env var is used (not build-time)
let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

// RunPod Stable Diffusion configuration
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
const RUNPOD_SD_ENDPOINT = "tzf1j3sc3zufsy"; // Automatic1111 endpoint

interface RunPodResponse {
  id: string;
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  output?: {
    images?: string[];
    image?: string;
  };
  error?: string;
}

async function generateImageWithRunPod(prompt: string): Promise<string> {
  if (!RUNPOD_API_KEY) {
    throw new Error("RUNPOD_API_KEY environment variable is not set");
  }

  const runUrl = `https://api.runpod.ai/v2/${RUNPOD_SD_ENDPOINT}/runsync`;

  // Call RunPod Automatic1111 endpoint
  const response = await fetch(runUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RUNPOD_API_KEY}`,
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        negative_prompt: "blurry, low quality, distorted text, watermark, signature",
        width: 512,
        height: 768, // Portrait orientation for zine pages
        num_inference_steps: 25,
        guidance_scale: 7.5,
        sampler_name: "DPM++ 2M Karras",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("RunPod API error:", response.status, errorText);
    throw new Error(`RunPod API error: ${response.status}`);
  }

  const result: RunPodResponse = await response.json();

  if (result.status === "FAILED") {
    throw new Error(`RunPod job failed: ${result.error || "Unknown error"}`);
  }

  // Extract base64 image from response
  const imageData = result.output?.images?.[0] || result.output?.image;
  if (!imageData) {
    throw new Error("No image data in RunPod response");
  }

  // RunPod returns base64 without prefix
  return `data:image/png;base64,${imageData}`;
}

export interface PageOutline {
  pageNumber: number;
  type: string;
  title: string;
  keyPoints: string[];
  imagePrompt: string;
}

export interface ZineOutline {
  id: string;
  topic: string;
  style: string;
  tone: string;
  pages: PageOutline[];
  createdAt: string;
}

const STYLE_PROMPTS: Record<string, string> = {
  "punk-zine": "xerox-style high contrast black and white, DIY cut-and-paste collage aesthetic, hand-drawn typography, punk rock zine style, grainy texture, photocopied look",
  "mycelial": "organic mycelial network patterns, spore prints, earth tones with green accents, fungal textures, underground root systems, natural decomposition aesthetic",
  "minimal": "clean minimalist design, lots of white space, modern sans-serif typography, simple geometric shapes, subtle gradients",
  "collage": "layered mixed media collage, vintage photographs, torn paper edges, overlapping textures, eclectic composition",
  "retro": "1970s aesthetic, earth tones, groovy psychedelic typography, halftone dot patterns, vintage illustration style",
};

const TONE_PROMPTS: Record<string, string> = {
  "rebellious": "defiant anti-establishment energy, provocative bold statements, raw and unfiltered",
  "regenerative": "hopeful and healing, nature-inspired wisdom, interconnected systems thinking, restoration and renewal",
  "playful": "whimsical fun light-hearted energy, humor and wit, bright positive vibes",
  "informative": "educational and factual, clear explanations, structured information",
  "poetic": "lyrical and metaphorical, evocative imagery, emotional depth",
};

export async function generateOutline(
  topic: string,
  style: string,
  tone: string
): Promise<PageOutline[]> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are creating an 8-page mycro-zine (mini DIY zine that folds from a single sheet of paper).

Topic: ${topic}
Visual Style: ${style} - ${STYLE_PROMPTS[style] || STYLE_PROMPTS["mycelial"]}
Tone: ${tone} - ${TONE_PROMPTS[tone] || TONE_PROMPTS["regenerative"]}

Create a detailed outline for all 8 pages. Each page should have a distinct purpose:
- Page 1: Cover (eye-catching title and central image)
- Page 2: Introduction (hook the reader, set the stage)
- Pages 3-6: Main content (key concepts, stories, visuals)
- Page 7: Resources or deeper dive
- Page 8: Call to action (what reader should do next)

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "pages": [
    {
      "pageNumber": 1,
      "type": "cover",
      "title": "Short punchy title",
      "keyPoints": ["Main visual concept", "Tagline or subtitle"],
      "imagePrompt": "Detailed prompt for generating the page image including style elements"
    }
  ]
}

Make each imagePrompt detailed and specific to the ${style} visual style. Include concrete visual elements, composition details, and mood descriptors.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Parse JSON from response with robust cleaning
  let jsonStr = response;

  // Remove markdown code blocks if present
  if (response.includes("```")) {
    const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1];
    }
  }

  // Try to extract JSON object if there's extra content
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  // Clean common JSON issues
  jsonStr = jsonStr
    .trim()
    // Remove trailing commas before } or ]
    .replace(/,\s*([\}\]])/g, '$1')
    // Fix unescaped newlines in strings (replace with space)
    .replace(/([^\\])\\n/g, '$1 ')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, ' ');

  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.pages;
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Raw response:", response.substring(0, 500));
    throw new Error("Failed to parse outline from AI response");
  }
}

export async function generatePageImage(
  pageOutline: PageOutline,
  style: string,
  tone: string,
  feedback?: string
): Promise<string> {
  // Use RunPod Stable Diffusion for image generation
  // (Gemini image gen is geo-blocked in Germany where the server is located)
  const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS["mycelial"];
  const toneDesc = TONE_PROMPTS[tone] || TONE_PROMPTS["regenerative"];

  // Build a Stable Diffusion optimized prompt
  let imagePrompt = `${pageOutline.title}, ${pageOutline.keyPoints.join(", ")}, ${styleDesc}, ${toneDesc}, ${pageOutline.imagePrompt}, zine page design, printable art, high quality illustration`;

  if (feedback) {
    imagePrompt += `, ${feedback}`;
  }

  // Truncate prompt if too long (SD has token limits)
  if (imagePrompt.length > 500) {
    imagePrompt = imagePrompt.substring(0, 500);
  }

  try {
    console.log(`Generating image for page ${pageOutline.pageNumber} with RunPod...`);
    const imageDataUrl = await generateImageWithRunPod(imagePrompt);
    console.log(`Successfully generated image for page ${pageOutline.pageNumber}`);
    return imageDataUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error(`Failed to generate page image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function regeneratePageWithFeedback(
  currentOutline: PageOutline,
  feedback: string,
  style: string,
  tone: string
): Promise<{ updatedOutline: PageOutline; imageUrl: string }> {
  const model = getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" });

  // First, update the outline based on feedback
  const prompt = `You are refining a zine page based on user feedback.

Current page outline:
${JSON.stringify(currentOutline, null, 2)}

User feedback: "${feedback}"

Style: ${style}
Tone: ${tone}

Update the page outline to incorporate this feedback. Keep the same page number and type, but update title, keyPoints, and imagePrompt as needed.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "pageNumber": ${currentOutline.pageNumber},
  "type": "${currentOutline.type}",
  "title": "Updated title",
  "keyPoints": ["Updated point 1", "Updated point 2"],
  "imagePrompt": "Updated detailed image prompt"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  let jsonStr = response;
  if (response.includes("```")) {
    const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1];
    }
  }

  const updatedOutline = JSON.parse(jsonStr.trim()) as PageOutline;

  // Generate new image with updated outline
  const imageUrl = await generatePageImage(updatedOutline, style, tone, feedback);

  return { updatedOutline, imageUrl };
}
