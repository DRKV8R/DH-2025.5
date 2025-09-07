"use client"

import { useEffect, useRef } from "react"

// Standard 5x7 lowercase "d" pattern - SAME as marquee
const dPattern = [
  [0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 1],
]

const DotHeader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas size to be a compact square
    canvas.width = 30
    canvas.height = 36 // Adjusted height for new dot spacing

    // Clear canvas with pure black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const dotRadius = 1.1 // Radius of the circle dot (~2.2px diameter)
    const spacing = 4.4 // Space between dot origins (center-to-center)

    // Calculate character dimensions
    const charWidth = 5 * spacing // 5 columns * spacing
    const charHeight = 7 * spacing // 7 rows * spacing

    // Calculate offsets to center the 'd' pattern
    const initialOffsetX = (canvas.width - charWidth) / 2
    const initialOffsetY = (canvas.height - charHeight) / 2

    // Draw "d" pattern in white dots
    for (let row = 0; row < dPattern.length; row++) {
      for (let col = 0; col < dPattern[row].length; col++) {
        if (dPattern[row][col] === 1) {
          // Calculate center for arc
          const x = initialOffsetX + col * spacing + spacing / 2
          const y = initialOffsetY + row * spacing + spacing / 2

          // PIXEL PERFECT WHITE DOT
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2) // Draw circular dot
          ctx.fill()
        }
      }
    }

    // Draw single dot for period "." - positioned after the "d"
    // Adjust position to be pixel-perfect with the new dotRadius and spacing
    const periodX = initialOffsetX + charWidth + spacing / 2 // After 'd', one space, then dot center
    const periodY = initialOffsetY + charHeight - spacing / 2 // Align with bottom of 'd'

    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(periodX, periodY, dotRadius, 0, Math.PI * 2) // Draw circular dot
    ctx.fill()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-[30px] h-[36px]"
      style={{
        imageRendering: "pixelated",
        // Removed brightness filter for pure white
      }}
    />
  )
}

export default DotHeader
