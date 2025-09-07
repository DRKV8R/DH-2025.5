"use client"

import { useEffect, useRef, useState } from "react"

export default function DotInspector() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dotInfo, setDotInfo] = useState<string>("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 200
    canvas.height = 100

    // Clear canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const dotRadius = 1.1 // Radius of the circle dot (~2.2px diameter)
    const spacing = 4.4 // Space between dot origins (center-to-center)

    // Draw a few test dots for inspection
    const testDots = [
      { x: 50, y: 30, type: "background" },
      { x: 50 + spacing, y: 30, type: "background" }, // Spaced out
      { x: 100, y: 30, type: "text" },
      { x: 100 + spacing, y: 30, type: "text" }, // Spaced out
    ]

    testDots.forEach((dot, index) => {
      if (dot.type === "background") {
        // Background dot (unlit)
        ctx.fillStyle = "#1a1a1a"
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#0d0d0d"
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotRadius * 0.5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Text dot (lit) - PIXEL PERFECT
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Add labels
    ctx.fillStyle = "#ffffff"
    ctx.font = "10px monospace"
    ctx.fillText("Background", 40, 50)
    ctx.fillText("Text", 100, 50)

    // Get pixel data for analysis (checking a text dot)
    const imageData = ctx.getImageData(Math.floor(100 + spacing / 2), Math.floor(30 + spacing / 2), 1, 1)
    const pixel = imageData.data
    setDotInfo(`RGB: ${pixel[0]}, ${pixel[1]}, ${pixel[2]}, Alpha: ${pixel[3]}`)
  }, [])

  return (
    <div className="border border-gray-700 p-4">
      <h3 className="font-mono mb-2">Dot Quality Inspector</h3>
      <canvas ref={canvasRef} className="border border-gray-600 mb-2" style={{ imageRendering: "pixelated" }} />
      <p className="text-xs font-mono text-gray-400">Text dot pixel data: {dotInfo}</p>
      <p className="text-xs font-mono text-gray-400">Expected: RGB: 255, 255, 255, Alpha: 255</p>
    </div>
  )
}
