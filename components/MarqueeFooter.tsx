"use client"

import type React from "react"
import { useState, useEffect, useRef, type FormEvent } from "react"
import { useStatusStore } from "@/store/statusStore"
import DotMatrixMarquee from "./DotMatrixMarquee"
import VideoDisplay from "./VideoDisplay"
// Import the new Server Action
import { handleChatAndMediaAction } from "@/app/actions"

// CONFIG - No longer need API keys here
// const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!
// const RUNPOD_API_KEY = process.env.NEXT_PUBLIC_RUNPOD_API_KEY!
// const BARK_ENDPOINT_ID = process.env.NEXT_PUBLIC_BARK_ENDPOINT_ID!
// const WALT_LORA_ENDPOINT_ID = process.env.NEXT_PUBLIC_WALT_LORA_ENDPOINT_ID!
// const MAI_LORA_URL = process.env.NEXT_PUBLIC_MAI_LORA_URL!

// AI INIT - No longer needed here
// const genAI = new GoogleGenerativeAI(API_KEY)
// const chatModel = genAI.getGenerativeModel({
// model: "gemini-pro",
// safetySettings: [
//   { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
//   { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
//   { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
//   { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
// ],
// })
// const triageModel = genAI.getGenerativeModel({ model: "gemini-pro" })

// TYPES
// type Intent = "EXPERIENCE_QUERY" | "SKILLS_QUERY" | "CONTACT_REQUEST" | "CV_REQUEST" | "GREETING" | "GENERAL"

interface UIMessage {
  id: number
  role: "user" | "bot"
  text: string
}

interface MarqueeFooterProps {
  handlePrintRequest: () => void
}

export default function MarqueeFooter({ handlePrintRequest }: MarqueeFooterProps) {
  const { setStatuses, resetStatus } = useStatusStore()
  const [chatHistory, setChatHistory] = useState<UIMessage[]>([])
  const [marqueeText, setMarqueeText] = useState("Mai is online • ask me about Mr. Hamilton...")
  const [chatInput, setChatInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [journeyStep, setJourneyStep] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  // chatSessionRef is no longer needed for direct model interaction
  // const chatSessionRef = useRef<ChatSession | null>(null)
  const initialGreetingRef = useRef<string>("") // Store initial greeting for Server Action

  useEffect(() => {
    // Initialize initialGreetingRef once
    const hasVisited = localStorage.getItem("hasVisitedDavidHamiltonPortfolio")
    const greeting = hasVisited
      ? "Welcome back. It's good to see you again."
      : "System online. Welcome. I am Mai. How may I guide you?"
    initialGreetingRef.current = greeting

    if (!hasVisited) localStorage.setItem("hasVisitedDavidHamiltonPortfolio", "true")

    // No need to start chat session here, it's handled by the Server Action
  }, [])

  useEffect(() => {
    const displayHistory =
      chatHistory.length > 0
        ? chatHistory
        : [{ id: 0, role: "bot" as const, text: "Mai is online • ask me about Mr. Hamilton..." }]
    setMarqueeText(displayHistory.map((msg) => `> ${msg.text}`).join(" ••• "))
  }, [chatHistory])

  const speak = async (text: string, audioUrl: string | null) => {
    try {
      setStatuses((prev) => ({ voice: "processing" }))

      if (audioUrl) {
        const audio = new Audio(audioUrl)
        audio.onended = () => {
          setStatuses((prev) => ({ voice: "success" }))
          resetStatus("voice")
        }
        audio.onerror = () => {
          console.error("Audio playback failed from URL.")
          // Fallback to browser speech if URL playback fails
          fallbackToBrowserSpeech(text)
        }
        audio.play()
      } else {
        // Fallback to browser speech synthesis if no audioUrl is provided
        fallbackToBrowserSpeech(text)
      }
    } catch (error) {
      console.error("Speech synthesis failed:", error)
      setStatuses((prev) => ({ voice: "error" }))
      resetStatus("voice")
    }
  }

  const fallbackToBrowserSpeech = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8

    utterance.onend = () => {
      setStatuses((prev) => ({ voice: "success" }))
      resetStatus("voice")
    }

    utterance.onerror = () => {
      setStatuses((prev) => ({ voice: "error" }))
      resetStatus("voice")
    }

    window.speechSynthesis.speak(utterance)
  }

  // Removed generateVisualPrompt and triggerVideoGeneration from client

  // Removed getConversationIntent from client

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isProcessing) return

    setIsProcessing(true)
    const userMessageText = chatInput
    setChatInput("")
    setChatHistory((prev) => [...prev, { id: Date.now(), role: "user", text: userMessageText }])

    try {
      setStatuses((prev) => ({ chat: "processing" }))
      setStatuses((prev) => ({ video: "processing" })) // Assume video might be generated

      // Prepare chat history for the server action
      const historyForAction = chatHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }))

      const { responseText, audioUrl, videoUrl, nextJourneyStep, triggerPrint } = await handleChatAndMediaAction(
        userMessageText,
        historyForAction,
        journeyStep,
        initialGreetingRef.current, // Pass the initial greeting
      )

      setChatHistory((prev) => [...prev, { id: Date.now(), role: "bot", text: responseText }])
      setJourneyStep(nextJourneyStep)

      if (triggerPrint) {
        handlePrintRequest()
      }

      if (videoUrl) {
        setVideoUrl(videoUrl)
        setStatuses((prev) => ({ video: "success" }))
      } else {
        setStatuses((prev) => ({ video: "idle" })) // Reset if no video
      }
      resetStatus("video") // Reset video status after use

      speak(responseText, audioUrl) // Pass the audioUrl received from the server
      setStatuses((prev) => ({ chat: "success" }))
      resetStatus("chat")
    } catch (error) {
      console.error("Submission failed:", error)
      setStatuses((prev) => ({ chat: "error" }))
      resetStatus("chat")
      setStatuses((prev) => ({ video: "error" }))
      resetStatus("video")
      const errorMessage = "My apologies. My conversational matrix is experiencing a brief anomaly. Please try again."
      setChatHistory((prev) => [...prev, { id: Date.now(), role: "bot", text: errorMessage }])
      speak(errorMessage, null) // No audio URL for error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <>
      <VideoDisplay isGenerating={isGeneratingVideo} videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />
      <div className="chat-footer fixed bottom-0 w-full h-[59px] bg-black z-50 border-t border-gray-800">
        <div className="h-[31px] overflow-hidden relative bg-black">
          <DotMatrixMarquee text={marqueeText} speed={4} />
        </div>

        <form onSubmit={handleSubmit} className="h-[28px] bg-gray-900 relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="w-full h-full bg-transparent border-none outline-none text-white px-4 py-[6px] font-sans placeholder-gray-500 disabled:opacity-50"
            placeholder={isProcessing ? "Mai is thinking..." : "Ask me about Mr. Hamilton..."}
            autoComplete="off"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {chatInput && !isProcessing && (
              <button
                type="submit"
                className="text-xs text-gray-400 hover:text-white transition-colors duration-1000 font-mono"
              >
                SEND
              </button>
            )}
            <div className={`w-2 h-6 rounded-sm ${isProcessing ? "bg-yellow-500" : "bg-red-500"} animate-pulse`} />
          </div>
        </form>
      </div>
    </>
  )
}
