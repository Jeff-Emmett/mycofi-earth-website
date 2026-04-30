"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type Props = {
  data: string
  size?: number
}

export function MushroomQR({ data, size = 320 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const qrRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { default: QRCodeStyling } = await import("qr-code-styling")
      if (cancelled) return
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data,
        image: "/mushroom-icon.svg",
        margin: 8,
        qrOptions: { errorCorrectionLevel: "H" },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.32, margin: 4, crossOrigin: "anonymous" },
        dotsOptions: { type: "rounded", gradient: { type: "linear", rotation: Math.PI / 4, colorStops: [
          { offset: 0, color: "#14532d" },
          { offset: 1, color: "#16a34a" },
        ] } },
        backgroundOptions: { color: "transparent" },
        cornersSquareOptions: { type: "extra-rounded", color: "#14532d" },
        cornersDotOptions: { type: "dot", color: "#65a30d" },
      })
      if (ref.current) {
        ref.current.innerHTML = ""
        qrRef.current.append(ref.current)
        setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [data, size])

  const download = (ext: "png" | "svg") => {
    qrRef.current?.download({ name: "mycofi-buy-it-forward", extension: ext })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="rounded-2xl border border-border bg-card p-4 shadow-lg"
        style={{ width: size + 32, height: size + 32 }}
      />
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => download("png")} disabled={!ready}>
          <Download className="mr-1 h-4 w-4" /> PNG
        </Button>
        <Button variant="outline" size="sm" onClick={() => download("svg")} disabled={!ready}>
          <Download className="mr-1 h-4 w-4" /> SVG
        </Button>
      </div>
    </div>
  )
}
