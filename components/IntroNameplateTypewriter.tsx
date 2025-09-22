"use client"

import { useState, useEffect } from "react"

interface IntroNameplateTypewriterProps {
  onComplete: () => void
}

export default function IntroNameplateTypewriter({ onComplete }: IntroNameplateTypewriterProps) {
  const fullText = "David Hamilton\nNewport Beach CA"
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    let charIndex = 0
    const typingSpeed = 80 // milliseconds per character

    const typeNextChar = () => {
      if (charIndex < fullText.length) {
        setDisplayText(fullText.substring(0, charIndex + 1))
        charIndex++
        setTimeout(typeNextChar, typingSpeed)
      } else {
        setIsTypingComplete(true)
        setTimeout(onComplete, 1500) // Wait a bit after typing before calling onComplete
      }
    }

    const startTyping = setTimeout(typeNextChar, 500) // Delay start slightly
    return () => clearTimeout(startTyping)
  }, [fullText, onComplete])

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-start z-40">
      <div className="w-full max-w-4xl mx-auto px-16">
        <div className="font-geist-light text-left whitespace-pre-wrap">
          <h1
            className="text-8xl md:text-9xl lg:text-[12rem] tracking-tight leading-[0.8] text-white"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            {displayText.split("\n")[0]}
          </h1>
          <p className="text-3xl md:text-4xl lg:text-5xl text-gray-300 tracking-wide leading-tight mt-4">
            {displayText.split("\n")[1]}
          </p>
          {showCursor && !isTypingComplete && <span className="animate-pulse text-white text-lg">|</span>}
        </div>
      </div>
    </div>
  )
}
