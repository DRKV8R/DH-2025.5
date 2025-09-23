"use client"

import { useState, useEffect } from "react"

interface DotMatrixDisplayProps {
  text: string
  width?: number
  height?: number
  dotSize?: number
  spacing?: number
  animationSpeed?: number
}

export default function DotMatrixDisplay({
  text,
  width = 400,
  height = 100,
  dotSize = 2,
  spacing = 3,
  animationSpeed = 100,
}: DotMatrixDisplayProps) {
  const [displayMatrix, setDisplayMatrix] = useState<boolean[][]>([])
  const [animationFrame, setAnimationFrame] = useState(0)

  const cols = Math.floor(width / (dotSize + spacing))
  const rows = Math.floor(height / (dotSize + spacing))

  // Simple 5x7 font matrix for ASCII characters
  const fontMatrix: Record<string, number[]> = {
    A: [0x70, 0x88, 0x88, 0xf8, 0x88, 0x88, 0x88],
    B: [0xf0, 0x88, 0x88, 0xf0, 0x88, 0x88, 0xf0],
    C: [0x70, 0x88, 0x80, 0x80, 0x80, 0x88, 0x70],
    D: [0xf0, 0x88, 0x88, 0x88, 0x88, 0x88, 0xf0],
    E: [0xf8, 0x80, 0x80, 0xf0, 0x80, 0x80, 0xf8],
    M: [0x88, 0xd8, 0xa8, 0x88, 0x88, 0x88, 0x88],
    I: [0xf8, 0x20, 0x20, 0x20, 0x20, 0x20, 0xf8],
    " ": [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    "•": [0x00, 0x00, 0x60, 0x60, 0x00, 0x00, 0x00],
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => prev + 1)
    }, animationSpeed)

    return () => clearInterval(interval)
  }, [animationSpeed])

  useEffect(() => {
    const matrix: boolean[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false))

    // Convert text to dot matrix
    const upperText = text.toUpperCase()
    let currentCol = 0

    for (let i = 0; i < upperText.length && currentCol < cols - 6; i++) {
      const char = upperText[i]
      const charMatrix = fontMatrix[char] || fontMatrix[" "]

      for (let row = 0; row < Math.min(7, rows); row++) {
        const rowData = charMatrix[row]
        for (let bit = 0; bit < 5; bit++) {
          if (currentCol + bit < cols && rowData & (1 << (4 - bit))) {
            matrix[row][currentCol + bit] = true
          }
        }
      }
      currentCol += 6
    }

    // Add animation effects
    const animatedMatrix = matrix.map((row, rowIndex) =>
      row.map((dot, colIndex) => {
        const wave = Math.sin((colIndex + animationFrame) * 0.1) > 0.3
        return dot && (animationFrame % 20 < 15 || wave)
      }),
    )

    setDisplayMatrix(animatedMatrix)
  }, [text, rows, cols, animationFrame])

  return (
    <div className="dot-matrix-display bg-black p-2 rounded border border-gray-700" style={{ width, height }}>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${dotSize}px)`,
          gap: `${spacing}px`,
        }}
      >
        {displayMatrix.flat().map((isActive, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-100 ${
              isActive ? "bg-green-400 shadow-sm shadow-green-400/50" : "bg-gray-800"
            }`}
            style={{
              width: dotSize,
              height: dotSize,
              opacity: isActive ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}
