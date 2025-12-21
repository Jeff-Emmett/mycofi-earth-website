import sharp from "sharp";
import { getAllPagePaths, readFileAsBuffer, savePrintLayout } from "./storage";

export interface PrintLayoutOptions {
  zineId: string;
  zineName?: string;
  background?: string;
}

// Create print layout directly with Sharp
export async function createZinePrintLayout(
  zineId: string,
  zineName: string = "mycozine"
): Promise<{ filepath: string; buffer: Buffer }> {
  const pagePaths = await getAllPagePaths(zineId);

  if (pagePaths.length !== 8) {
    throw new Error(`Expected 8 pages, got ${pagePaths.length}`);
  }

  // Print layout dimensions (300 DPI, 11" x 8.5")
  const PRINT_WIDTH = 3300;
  const PRINT_HEIGHT = 2550;
  const PANEL_WIDTH = 825;
  const PANEL_HEIGHT = 1275;

  // Page arrangement for proper folding:
  // Top row (rotated 180°): P1, P8, P7, P6
  // Bottom row (normal):    P2, P3, P4, P5
  const pageArrangement = [
    // Top row
    { page: 1, col: 0, row: 0, rotate: 180 },
    { page: 8, col: 1, row: 0, rotate: 180 },
    { page: 7, col: 2, row: 0, rotate: 180 },
    { page: 6, col: 3, row: 0, rotate: 180 },
    // Bottom row
    { page: 2, col: 0, row: 1, rotate: 0 },
    { page: 3, col: 1, row: 1, rotate: 0 },
    { page: 4, col: 2, row: 1, rotate: 0 },
    { page: 5, col: 3, row: 1, rotate: 0 },
  ];

  // Create base canvas
  const canvas = sharp({
    create: {
      width: PRINT_WIDTH,
      height: PRINT_HEIGHT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  // Prepare composites
  const composites: sharp.OverlayOptions[] = [];

  for (const { page, col, row, rotate } of pageArrangement) {
    const pageBuffer = await readFileAsBuffer(pagePaths[page - 1]);

    // Resize page to panel size, maintaining aspect ratio
    let processedPage = sharp(pageBuffer).resize(PANEL_WIDTH, PANEL_HEIGHT, {
      fit: "cover",
      position: "center",
    });

    // Rotate if needed
    if (rotate !== 0) {
      processedPage = processedPage.rotate(rotate);
    }

    const pageData = await processedPage.toBuffer();

    composites.push({
      input: pageData,
      left: col * PANEL_WIDTH,
      top: row * PANEL_HEIGHT,
    });
  }

  // Composite all pages
  const outputBuffer = await canvas.composite(composites).png().toBuffer();

  // Save the print layout
  const filepath = await savePrintLayout(zineId, outputBuffer);

  return { filepath, buffer: outputBuffer };
}
