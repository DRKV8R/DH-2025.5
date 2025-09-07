"use client"

import { useState } from "react"
import { cvContent } from "@/data/cv-data"

interface NameplateProps {
  onTypingComplete?: () => void
  isIntroTyping?: boolean
}

export default function Nameplate({ onTypingComplete, isIntroTyping = false }: NameplateProps) {
  const { personal } = cvContent
  const nameText = personal.name
  const locationText = personal.location

  const [typedName, setTypedName] = useState(nameText)
  const [typedLocation, setTypedLocation] = useState(locationText)
  const [showContact, setShowContact] = useState(true)
  const [showCursor, setShowCursor] = useState(false)

  return (
    <div className="text-left max-w-5xl">
      <div className="space-y-0">
        <h1 className="text-8xl md:text-9xl lg:text-[13rem] font-geist-extralight tracking-[-0.1em] leading-none text-white mb-[-67px]">
          {typedName.split(" ")[0]}
        </h1>
        <h1 className="text-8xl md:text-9xl lg:text-[13rem] font-geist-black tracking-[-0.1em] leading-none text-white">
          {typedName.split(" ")[1]}
        </h1>
      </div>

      <p className="text-3xl md:text-4xl lg:text-5xl text-gray-300 tracking-wide font-geist-normal leading-tight min-h-[1.2em] mt-[-9px]">
        {typedLocation}
        {showCursor && <span className="animate-pulse text-white text-[inherit]">|</span>}
      </p>

      <div
        className={`flex flex-wrap items-center gap-6 text-lg md:text-xl font-geist-normal text-gray-400 transition-opacity duration-1000 mt-[26px] ${showContact ? "opacity-100" : "opacity-0"}`}
      >
        <a
          href={`mailto:${personal.email}`}
          className="hover:text-white transition-colors duration-1000 hover:scale-105 transform"
        >
          email
        </a>
        <span className="text-gray-600">•</span>
        <a
          href={personal.github}
          className="hover:text-white transition-colors duration-1000 hover:scale-105 transform"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
        <span className="text-gray-600">•</span>
        <a
          href={`tel:${personal.phone.replace(/\s/g, "")}`}
          className="hover:text-white transition-colors duration-1000 hover:scale-105 transform"
        >
          {personal.phone}
        </a>
      </div>
    </div>
  )
}
