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

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = response;
  if (response.includes("```")) {
    const match = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      jsonStr = match[1];
    }
  }

  const parsed = JSON.parse(jsonStr.trim());
  return parsed.pages;
}

export async function generatePageImage(
  pageOutline: PageOutline,
  style: string,
  tone: string,
  feedback?: string
): Promise<string> {
  // Use Nano Banana Pro for highest quality image generation
  // Model: gemini-2.0-flash-exp-image-generation (supports native image output)
  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
      // @ts-expect-error - responseModalities is valid but not in types yet
      responseModalities: ["IMAGE"],
    },
  });

  const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS["mycelial"];
  const toneDesc = TONE_PROMPTS[tone] || TONE_PROMPTS["regenerative"];

  let imagePrompt = `Create a single page for a mini-zine (approximately 825x1275 pixels aspect ratio, portrait orientation).

Page ${pageOutline.pageNumber}: ${pageOutline.title}
Type: ${pageOutline.type}
Key elements: ${pageOutline.keyPoints.join(", ")}

Visual style: ${styleDesc}
Mood/tone: ${toneDesc}

Specific requirements:
${pageOutline.imagePrompt}

The image should be a complete, self-contained page that could be printed. Include any text as part of the design in a ${style} typography style.`;

  if (feedback) {
    imagePrompt += `\n\nUser feedback for refinement: ${feedback}`;
  }

  try {
    const result = await model.generateContent(imagePrompt);
    const response = result.response;

    // Extract image from response parts
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        // @ts-expect-error - inlineData exists on image responses
        if (part.inlineData) {
          // @ts-expect-error - inlineData has data and mimeType
          const { data, mimeType } = part.inlineData;
          return `data:${mimeType || "image/png"};base64,${data}`;
        }
      }
    }

    // If no image in response, throw error
    throw new Error("No image data in response");
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
