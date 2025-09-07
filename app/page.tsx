"use client"

import { useState, useRef, useEffect } from "react"
import BrandStatusIndicator from "@/components/BrandStatusIndicator"
import MarqueeFooter from "@/components/MarqueeFooter"
import CVModal from "@/components/CVModal"
import Nameplate from "@/components/Nameplate"
import TypewriterDictionary from "@/components/TypewriterDictionary"

export default function HomePage() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const [showTypewriterDictionary, setShowTypewriterDictionary] = useState(true)
  const [isNameplateTypingActive, setIsNameplateTypingActive] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const triggerPrintRef = useRef<() => void>(() => {})

  useEffect(() => {
    document.body.style.backgroundColor = "black"
    return () => {
      document.body.style.backgroundColor = ""
    }
  }, [])

  const handleTypewriterDictionaryComplete = () => {
    setShowTypewriterDictionary(false)
    setTimeout(() => {
      setShowMainContent(true)
      setTimeout(() => {
        setIsNameplateTypingActive(true)
      }, 200)
    }, 500)
  }

  const handleNameplateTypingComplete = () => {
    setIsNameplateTypingActive(false)
  }

  return (
    <main className="w-full min-h-screen bg-black text-white relative overflow-hidden">
      {showTypewriterDictionary && <TypewriterDictionary onComplete={handleTypewriterDictionaryComplete} />}

      <div
        className={`absolute inset-0 bg-black transition-all duration-1000 ${
          showMainContent ? "opacity-100 blur-none" : "opacity-0 blur-lg"
        }`}
        style={{
          WebkitBackdropFilter: showMainContent ? "blur(0px)" : "blur(16px)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat opacity-20 z-10"
          style={{
            backgroundImage: "url(/images/geometric-lines-bg.png)",
            backgroundPosition: "left top",
            backgroundSize: "cover",
            marginLeft: "2rem",
            marginTop: "2rem",
            marginBottom: "2rem",
            right: "4rem",
          }}
        />

        <div className="flex items-center justify-start min-h-screen pl-9 pr-16 pb-[105px] relative z-20">
          <Nameplate isIntroTyping={isNameplateTypingActive} onTypingComplete={handleNameplateTypingComplete} />
        </div>

        <div className="fixed top-0 right-0 z-50 space-x-4">
          <button
            onClick={() => setIsCVModalOpen(true)}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 text-sm font-sans font-medium hover:bg-white/20 transition-all duration-1000 z-40 tracking-wider uppercase shadow-lg"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            DOSSIER | <span className="text-red-400 font-geist-bold">CV</span>
          </button>
        </div>

        <BrandStatusIndicator />
        <MarqueeFooter
          handlePrintRequest={() => {
            setIsCVModalOpen(true)
            setTimeout(() => triggerPrintRef.current(), 100)
          }}
        />
        <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} printTrigger={triggerPrintRef} />
      </div>
    </main>
  )
}
