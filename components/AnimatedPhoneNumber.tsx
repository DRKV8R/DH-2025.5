"use client"

import { useState, useEffect } from "react"

interface AnimatedPhoneNumberProps {
  fullText: string
  numericalText: string
  intervalMs?: number
}

export default function AnimatedPhoneNumber({
  fullText,
  numericalText,
  intervalMs = 3000, // Default to 3 seconds
}: AnimatedPhoneNumberProps) {
  const [showFullText, setShowFullText] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFullText((prev) => !prev)
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])

  return <span className="transition-opacity duration-1000">{showFullText ? fullText : numericalText}</span>
}
