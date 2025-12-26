"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectionData {
  bounds: SelectionBounds;
  maskBase64: string;
}

interface TextSelectionCanvasProps {
  imageUrl: string;
  onSelectionComplete: (data: SelectionData) => void;
  onCancel: () => void;
}

// Target dimensions for the mask (matching zine page size)
const MASK_WIDTH = 768;
const MASK_HEIGHT = 1024;

export default function TextSelectionCanvas({
  imageUrl,
  onSelectionComplete,
  onCancel,
}: TextSelectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<SelectionBounds | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Load and draw the background image
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Calculate canvas size to fit container while maintaining aspect ratio
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imgAspect = img.width / img.height;
      const containerAspect = containerWidth / containerHeight;

      let canvasWidth: number;
      let canvasHeight: number;

      if (imgAspect > containerAspect) {
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imgAspect;
      } else {
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * imgAspect;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      setCanvasSize({ width: canvasWidth, height: canvasHeight });

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        setImageLoaded(true);
      }
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // Redraw canvas with selection rectangle
  const redrawCanvas = useCallback((rect: SelectionBounds | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reload and draw the image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw semi-transparent overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (rect && rect.width > 0 && rect.height > 0) {
        // Clear the selected area (show original image)
        ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
        ctx.drawImage(
          img,
          (rect.x / canvas.width) * img.width,
          (rect.y / canvas.height) * img.height,
          (rect.width / canvas.width) * img.width,
          (rect.height / canvas.height) * img.height,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );

        // Draw selection border
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Draw corner handles
        ctx.setLineDash([]);
        ctx.fillStyle = "#22c55e";
        const handleSize = 8;
        const corners = [
          { x: rect.x, y: rect.y },
          { x: rect.x + rect.width, y: rect.y },
          { x: rect.x, y: rect.y + rect.height },
          { x: rect.x + rect.width, y: rect.y + rect.height },
        ];
        corners.forEach(({ x, y }) => {
          ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
        });
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Get canvas coordinates from mouse/touch event
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPoint(coords);
    setCurrentRect(null);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startPoint) return;
    e.preventDefault();

    const coords = getCanvasCoords(e);
    const rect: SelectionBounds = {
      x: Math.min(startPoint.x, coords.x),
      y: Math.min(startPoint.y, coords.y),
      width: Math.abs(coords.x - startPoint.x),
      height: Math.abs(coords.y - startPoint.y),
    };

    setCurrentRect(rect);
    redrawCanvas(rect);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    setStartPoint(null);
  };

  // Generate mask and complete selection
  const handleConfirm = () => {
    if (!currentRect || currentRect.width < 20 || currentRect.height < 20) {
      return;
    }

    // Create mask canvas at target dimensions
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = MASK_WIDTH;
    maskCanvas.height = MASK_HEIGHT;
    const maskCtx = maskCanvas.getContext("2d");

    if (!maskCtx) return;

    // Fill with black (preserve area)
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, MASK_WIDTH, MASK_HEIGHT);

    // Scale selection coordinates to mask dimensions
    const scaleX = MASK_WIDTH / canvasSize.width;
    const scaleY = MASK_HEIGHT / canvasSize.height;

    const scaledRect = {
      x: currentRect.x * scaleX,
      y: currentRect.y * scaleY,
      width: currentRect.width * scaleX,
      height: currentRect.height * scaleY,
    };

    // Draw white rectangle (inpaint area)
    maskCtx.fillStyle = "white";
    maskCtx.fillRect(scaledRect.x, scaledRect.y, scaledRect.width, scaledRect.height);

    // Convert to base64 (without data: prefix)
    const maskDataUrl = maskCanvas.toDataURL("image/png");
    const maskBase64 = maskDataUrl.replace(/^data:image\/png;base64,/, "");

    onSelectionComplete({
      bounds: scaledRect,
      maskBase64,
    });
  };

  const hasValidSelection = currentRect && currentRect.width >= 20 && currentRect.height >= 20;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white punk-text text-lg">Draw a rectangle around the text to edit</h3>
          <button
            onClick={onCancel}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas container */}
        <div
          ref={containerRef}
          className="relative w-full bg-gray-900 punk-border"
          style={{ aspectRatio: "3/4" }}
        >
          <canvas
            ref={canvasRef}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              imageLoaded ? "cursor-crosshair" : "cursor-wait"
            }`}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />

          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white punk-text">Loading image...</div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-white/10 text-white punk-text border-2 border-white/30 hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasValidSelection}
            className={`flex-1 py-3 px-4 punk-text border-2 ${
              hasValidSelection
                ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                : "bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed"
            }`}
          >
            {hasValidSelection ? "Confirm Selection" : "Draw a selection"}
          </button>
        </div>

        {/* Help text */}
        <p className="text-white/60 text-sm text-center mt-3 punk-text">
          Click and drag to select the text region you want to change
        </p>
      </div>
    </div>
  );
}
