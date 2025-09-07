"use client"

import { useEffect, useRef } from "react"
import { useStatusStore, type Statuses } from "@/store/statusStore"

type StatusKey = keyof Statuses

const LedDot = ({ status }: { status: Statuses[StatusKey] }) => {
  const colorMap = {
    idle: "status-blue",
    processing: "status-blue-pulsing",
    success: "status-green",
    error: "status-red",
  }
  return <div className={`w-[2px] h-[2px] rounded-full transition-all duration-1000 ${colorMap[status]}`} />
}

const DotLetter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Dot matrix pattern for lowercase "d"
  const dPattern = [
    [0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas size to fit scaled-up character
    canvas.width = 30 // Adjusted width
    canvas.height = 36 // Adjusted height

    // Clear with black
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const dotRadius = 1.2 // Radius of the circle dot (scaled up)
    const spacing = 4.8 // Space between dot origins (scaled up)

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

          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2) // Draw circular dot
          ctx.fill()
        }
      }
    }

    // Add period dot
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
      className="w-[30px] h-[36px]" // Updated className to match new canvas size
      style={{
        imageRendering: "pixelated",
        // Removed brightness filter for pure white
      }}
    />
  )
}

export default function BrandStatusIndicator() {
  const statuses = useStatusStore((state) => state.statuses)

  return (
    <div className="fixed top-[10px] left-8 z-50 flex items-start space-x-2 font-sans text-white select-none">
      <DotLetter />
      <div className="grid grid-cols-2 gap-1 pt-8">
        <LedDot status={statuses.chat} />
        <LedDot status={statuses.voice} />
        <LedDot status={statuses.video} />
        <LedDot status={statuses.vercel} />
      </div>
    </div>
  )
}
