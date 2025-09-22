"use client"

import { useState, useRef, useEffect } from "react"
import BrandStatusIndicator from "@/components/BrandStatusIndicator"
import MarqueeFooter from "@/components/MarqueeFooter"
import CVModal from "@/components/CVModal"
import Nameplate from "@/components/Nameplate"
import TypewriterDictionary from "@/components/TypewriterDictionary"
import VideoIntro from "@/components/VideoIntro"
import V8DR from "@/components/V8DR"

export default function HomePage() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)
  const [isV8DROpen, setIsV8DROpen] = useState(false)
  const [showVideoIntro, setShowVideoIntro] = useState(false)
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
      setShowVideoIntro(true)
    }, 200)
  }

  const handleVideoIntroComplete = () => {
    setShowVideoIntro(false)
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
      {showVideoIntro && <VideoIntro onComplete={handleVideoIntroComplete} />}

      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} printTrigger={triggerPrintRef} />
      {isV8DROpen && <V8DR onClose={() => setIsV8DROpen(false)} />}

      <div
        className="absolute inset-0 bg-cover bg-no-repeat opacity-20"
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

      <div
        className={`absolute inset-0 bg-black transition-all duration-1000 ${
          showMainContent ? "opacity-100 blur-none" : "opacity-0 blur-lg"
        }`}
        style={{
          WebkitBackdropFilter: showMainContent ? "blur(0px)" : "blur(16px)",
        }}
      >
        <div className="flex items-center justify-start min-h-screen pl-7 pr-16 pb-[105px] text-transparent">
          <Nameplate isIntroTyping={isNameplateTypingActive} onTypingComplete={handleNameplateTypingComplete} />
        </div>

        <div className="fixed top-0 right-0 z-50 space-x-4">
          <button
            onClick={() => setIsCVModalOpen(true)}
            className="bg-white/10 backdrop-blur-md text-white px-8 py-4 text-sm font-sans font-medium hover:bg-white/20 transition-all duration-1000 z-40 tracking-wider uppercase shadow-lg border-transparent border-none border-0"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            DOSSIER | <span className="text-red-400 font-geist-bold">CV</span>
          </button>
          <button
            onClick={() => setIsV8DROpen(true)}
            className="bg-white/10 backdrop-blur-md text-white px-8 py-4 text-sm font-sans font-medium hover:bg-white/20 transition-all duration-1000 z-40 tracking-wider uppercase shadow-lg border-transparent border-none border-0"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            V8DR
          </button>
        </div>

        <BrandStatusIndicator />
        <MarqueeFooter
          handlePrintRequest={() => {
            setIsCVModalOpen(true)
            setTimeout(() => triggerPrintRef.current(), 100)
          }}
        />
      </div>
    </main>
  )
}
