"use client"

import { useState } from "react"
import { cvContent } from "@/data/cv-data"

interface NameplateProps {
  onTypingComplete?: () => void
  isIntroTyping?: boolean
}

export default function Nameplate({ onTypingComplete, isIntroTyping = false }: NameplateProps) {
  const { personal } = cvContent
  const [showContact, setShowContact] = useState(true)

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start">
        <h1
          className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.8] text-white"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          David
        </h1>
        <h1
          className="text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.8] text-white -mt-4"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          Hamilton
        </h1>
      </div>

      <p
        className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-normal tracking-wide leading-tight mt-2"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        Newport Beach, CA
      </p>

      <div
        className={`flex justify-between mt-4 transition-opacity duration-1000 ${showContact ? "opacity-100" : "opacity-0"}`}
        style={{
          width: "280px", // Matches approximate width of "Newport Beach, CA" at base size
          maxWidth: "100%",
        }}
      >
        {/* Email Icon */}
        <a href={`mailto:${personal.email}`} className="hover:scale-110 transition-transform duration-300">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="currentColor"
            />
            <polyline points="22,6 12,13 2,6" stroke="#000000" strokeWidth="2" fill="none" />
          </svg>
        </a>

        {/* GitHub Icon */}
        <a
          href={personal.github}
          className="hover:scale-110 transition-transform duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              strokeWidth="0.5"
            />
          </svg>
        </a>

        {/* Phone Icon */}
        <a
          href={`tel:${personal.phone.replace(/\s/g, "")}`}
          className="hover:scale-110 transition-transform duration-300"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}
