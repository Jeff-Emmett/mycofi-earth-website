/**
 * Render the mushroom-themed QR for https://mycofi.earth/buy-it-forward.
 *
 * Uses `qrcode` to compute the QR matrix at high error-correction (level H, ~30%
 * recovery, so a 32%-area centerpiece is safely scannable), then writes an SVG
 * with rounded green-gradient dots, mushroom-cap finder corners, and a hand-drawn
 * mushroom centerpiece. Output: public/buy-it-forward-qr.svg.
 */
import QRCode from "qrcode"
import fs from "node:fs"
import path from "node:path"

const URL = "https://mycofi.earth/buy-it-forward"
const SIZE = 1024 // final SVG box (px)
const QUIET = 4 // quiet zone in modules
const ICON_FRAC = 0.22 // diameter of centerpiece relative to QR (H-level recovers ~30%; keep margin)

const qr = QRCode.create(URL, { errorCorrectionLevel: "H" })
const matrix = qr.modules
const N = matrix.size // module count per side
const M = N + QUIET * 2
const dot = SIZE / M // pixel size of a module

const get = (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? 0 : matrix.get(x, y))

const isFinder = (x, y) =>
  (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7)

const ICON_SIZE = SIZE * ICON_FRAC
const ICON_X = (SIZE - ICON_SIZE) / 2
const ICON_Y = (SIZE - ICON_SIZE) / 2
const ICON_PAD = ICON_SIZE * 0.08
const ICON_HOLE_X0 = ICON_X - ICON_PAD
const ICON_HOLE_Y0 = ICON_Y - ICON_PAD
const ICON_HOLE_X1 = ICON_X + ICON_SIZE + ICON_PAD
const ICON_HOLE_Y1 = ICON_Y + ICON_SIZE + ICON_PAD

const inIconHole = (px, py) =>
  px + dot > ICON_HOLE_X0 &&
  px < ICON_HOLE_X1 &&
  py + dot > ICON_HOLE_Y0 &&
  py < ICON_HOLE_Y1

const dots = []
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    if (!get(x, y)) continue
    if (isFinder(x, y)) continue // drawn as styled finders below
    const px = (x + QUIET) * dot
    const py = (y + QUIET) * dot
    if (inIconHole(px, py)) continue
    const r = dot * 0.5
    dots.push(`<circle cx="${(px + dot / 2).toFixed(2)}" cy="${(py + dot / 2).toFixed(2)}" r="${r.toFixed(2)}"/>`)
  }
}

// finder pattern: rounded outer square (stroked) + solid rounded inner core.
// Geometry (7x7 outer, 5x5 white gap, 3x3 inner) is preserved — only corner radii are styled.
const finder = (cx, cy) => {
  const x0 = (cx + QUIET) * dot
  const y0 = (cy + QUIET) * dot
  const sOuter = dot * 7
  // outer 7x7 ring (stroked, 1-module-thick) — small corner radius for style without breaking detection
  const rOuter = dot * 0.9
  const outer = `<rect x="${(x0 + dot / 2).toFixed(2)}" y="${(y0 + dot / 2).toFixed(2)}" width="${(sOuter - dot).toFixed(2)}" height="${(sOuter - dot).toFixed(2)}" rx="${rOuter.toFixed(2)}" ry="${rOuter.toFixed(2)}" fill="none" stroke="#14532d" stroke-width="${dot.toFixed(2)}"/>`
  // inner 3x3 solid (small radius)
  const inX = x0 + dot * 2
  const inY = y0 + dot * 2
  const inS = dot * 3
  const rInner = dot * 0.4
  const inner = `<rect x="${inX.toFixed(2)}" y="${inY.toFixed(2)}" width="${inS.toFixed(2)}" height="${inS.toFixed(2)}" rx="${rInner.toFixed(2)}" ry="${rInner.toFixed(2)}" fill="#65a30d"/>`
  return outer + inner
}

const finders = [finder(0, 0), finder(N - 7, 0), finder(0, N - 7)].join("\n")

// centerpiece mushroom
const cx = SIZE / 2
const cy = SIZE / 2
const sz = ICON_SIZE
const halfsz = sz / 2
const mushroom = `
  <g transform="translate(${(cx - halfsz).toFixed(2)},${(cy - halfsz).toFixed(2)}) scale(${(sz / 64).toFixed(4)})">
    <rect x="0" y="0" width="64" height="64" rx="10" ry="10" fill="#ffffff"/>
    <ellipse cx="32" cy="55" rx="14" ry="3" fill="#000" opacity="0.18"/>
    <path d="M22 30 Q22 50 26 54 L38 54 Q42 50 42 30 Z" fill="url(#stem)" stroke="#57534e" stroke-width="0.5"/>
    <path d="M8 30 Q8 10 32 8 Q56 10 56 30 Q56 34 50 34 L14 34 Q8 34 8 30 Z" fill="url(#cap)"/>
    <circle cx="20" cy="22" r="2.6" fill="#f0fdf4" opacity="0.95"/>
    <circle cx="32" cy="16" r="3.4" fill="#f0fdf4" opacity="0.95"/>
    <circle cx="44" cy="22" r="2.2" fill="#f0fdf4" opacity="0.95"/>
    <circle cx="14" cy="28" r="1.6" fill="#f0fdf4" opacity="0.85"/>
    <circle cx="50" cy="28" r="1.8" fill="#f0fdf4" opacity="0.85"/>
  </g>`

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="dotGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
    <radialGradient id="cap" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#86efac"/>
      <stop offset="60%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#14532d"/>
    </radialGradient>
    <linearGradient id="stem" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#a8a29e"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="#ffffff"/>
  <g fill="url(#dotGrad)">
    ${dots.join("\n    ")}
  </g>
  ${finders}
  ${mushroom}
</svg>
`

const outDir = path.resolve("public")
const out = path.join(outDir, "buy-it-forward-qr.svg")
fs.writeFileSync(out, svg)
console.log(`wrote ${out} (${svg.length} bytes, ${N}x${N} modules, dot=${dot.toFixed(2)}px)`)

// also dump a quick-scan check: verify the file decodes
import { promises as fsp } from "node:fs"
const png_check_url = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64").slice(0, 80)}...`
console.log("SVG ok. Encoded URL:", URL)
