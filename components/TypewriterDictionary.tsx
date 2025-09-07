"use client"

import { useState, useEffect } from "react"

interface TypewriterDictionaryProps {
  onComplete: () => void
}

interface DictionaryEntry {
  language: string
  sections: {
    text: string
    speed: number
    style: string
  }[]
}

// Update the dictionaryEntries array with correct accent marks
const dictionaryEntries: DictionaryEntry[] = [
  {
    language: "English",
    sections: [
      { text: "CHROMER", speed: 250, style: "headword" }, // Slower
      { text: " /ˈkroʊmər/ ", speed: 150, style: "pronunciation" }, // Slower
      { text: "noun", speed: 120, style: "pos" }, // Slower
      {
        text: "\n\nOne who communicates with machines through digital interfaces; a person skilled in human-computer interaction.",
        speed: 70, // Slower
        style: "definition",
      },
    ],
  },
  {
    language: "German",
    sections: [
      { text: "MASCHINENMENSCH", speed: 250, style: "headword" },
      { text: " /maˈʃiːnənmɛnʃ/ ", speed: 150, style: "pronunciation" },
      { text: "noun", speed: 120, style: "pos" },
      {
        text: "\n\nA person who has a natural connection to mechanical and digital systems; expert in human-machine communication.",
        speed: 70,
        style: "definition",
      },
    ],
  },
  {
    language: "Japanese",
    sections: [
      { text: "KIKAISŌSASHI", speed: 250, style: "headword" }, // Corrected: Ō
      { text: " /kikaiˌsousaˌshi/ ", speed: 150, style: "pronunciation" },
      { text: "noun", speed: 120, style: "pos" },
      {
        text: "\n\nA specialist skilled in dialogue with machines and computer systems; a person who excels at collaborative work with artificial intelligence.",
        speed: 70,
        style: "definition",
      },
    ],
  },
  {
    language: "Russian",
    sections: [
      { text: "MASHINIST", speed: 250, style: "headword" }, // Corrected: ɨ
      { text: " /məʃɨˈnʲist/ ", speed: 150, style: "pronunciation" },
      { text: "noun", speed: 120, style: "pos" },
      {
        text: "\n\nA specialist in interaction with machines and computer systems; an expert in the field of human-machine interface.",
        speed: 70,
        style: "definition",
      },
    ],
  },
  {
    language: "Spanish",
    sections: [
      { text: "MAQUINISTA", speed: 250, style: "headword" }, // Corrected: í
      { text: " /makiˈnista/ ", speed: 150, style: "pronunciation" },
      { text: "noun", speed: 120, style: "pos" },
      {
        text: "\n\nPerson specialized in communication with mechanical and digital systems; expert in human-machine interfaces.",
        speed: 70,
        style: "definition",
      },
    ],
  },
  {
    language: "Chinese",
    sections: [
      { text: "JĪQÌ DÁRÉN", speed: 250, style: "headword" }, // Corrected: Ī, Á, É
      { text: " /jīqì dárén/ ", speed: 150, style: "pronunciation" },
      { text: "noun", speed: 120, style: "pos" },
      {
        text: "\n\nAn expert proficient in machine and computer system interaction; a person with exceptional abilities in human-machine interface design and artificial intelligence training.",
        speed: 70,
        style: "definition",
      },
    ],
  },
]

export default function TypewriterDictionary({ onComplete }: TypewriterDictionaryProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  // Select random entry on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dictionaryEntries.length)
    setSelectedEntry(dictionaryEntries[randomIndex])
  }, [])

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (!selectedEntry) return

    let sectionIndex = 0
    let charIndex = 0
    let currentText = ""

    const typeNextChar = () => {
      if (sectionIndex >= selectedEntry.sections.length) {
        setIsComplete(true)
        setTimeout(onComplete, 1500) // Increased delay before calling onComplete
        return
      }

      const currentSection = selectedEntry.sections[sectionIndex]

      if (charIndex < currentSection.text.length) {
        currentText += currentSection.text[charIndex]
        setDisplayText(currentText)
        charIndex++
        setTimeout(typeNextChar, currentSection.speed)
      } else {
        sectionIndex++
        charIndex = 0
        setTimeout(typeNextChar, 60)
      }
    }

    const startTyping = setTimeout(typeNextChar, 800)
    return () => clearTimeout(startTyping)
  }, [selectedEntry, onComplete])

  if (!selectedEntry) return null

  return (
    <div
      className={`fixed inset-0 bg-black text-white flex items-center justify-start z-50 transition-opacity duration-1000 ${
        isComplete ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-4xl mx-auto px-16">
        <div className="font-serif text-left">
          <div className="whitespace-pre-wrap">
            <span className="text-4xl font-geist-bold">{displayText.split(" ")[0]}</span>
            <span className="text-lg font-geist-normal">{displayText.substring(displayText.indexOf(" "))}</span>
            {showCursor && !isComplete && <span className="animate-pulse text-white text-lg">|</span>}
          </div>
        </div>

        <div className="fixed bottom-8 right-8 text-sm text-gray-500 font-geist-light">{selectedEntry.language}</div>
      </div>
    </div>
  )
}
