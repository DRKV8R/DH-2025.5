"use client"

import type React from "react"
import { useState, useEffect, useRef, type FormEvent } from "react"
import DotMatrixMarquee from "./DotMatrixMarquee"
import { geminiClient } from "@/lib/gemini-client"

interface UIMessage {
  id: number
  role: "user" | "bot"
  text: string
}

interface MarqueeFooterProps {
  handlePrintRequest: () => void
}

export default function MarqueeFooter({ handlePrintRequest }: MarqueeFooterProps) {
  const [chatHistory, setChatHistory] = useState<UIMessage[]>([])
  const [marqueeText, setMarqueeText] = useState(
    "minimal chat interface by David Hamilton 2025 enter questions below .........",
  )
  const [chatInput, setChatInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const initialGreetingRef = useRef<string>("")
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    geminiClient.storeResumeContent().catch(console.error)

    const hasVisited = localStorage.getItem("hasVisitedDavidHamiltonPortfolio")
    const greeting = hasVisited
      ? "Welcome back. minimal chat interface by David Hamilton 2025 enter questions below"
      : "minimal chat interface by David Hamilton 2025 enter questions below ........."
    initialGreetingRef.current = greeting

    if (!hasVisited) localStorage.setItem("hasVisitedDavidHamiltonPortfolio", "true")
  }, [])

  useEffect(() => {
    const displayHistory =
      chatHistory.length > 0
        ? chatHistory
        : [
            {
              id: 0,
              role: "bot" as const,
              text: "minimal chat interface by David Hamilton 2025 enter questions below .........",
            },
          ]
    setMarqueeText(displayHistory.map((msg) => `> ${msg.text}`).join(" ••• "))
  }, [chatHistory])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const speak = async (text: string) => {
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Speech synthesis failed:", error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isProcessing) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsProcessing(true)
    const userMessageText = chatInput
    setChatInput("")
    setChatHistory((prev) => [...prev, { id: Date.now(), role: "user", text: userMessageText }])

    try {
      if (signal.aborted) {
        return
      }

      const conversationHistory = chatHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        content: msg.text,
      }))

      const responseText = await geminiClient.chatWithContext(userMessageText, conversationHistory)

      if (!signal.aborted) {
        setChatHistory((prev) => [...prev, { id: Date.now(), role: "bot", text: responseText }])

        if (userMessageText.toLowerCase().includes("cv") || userMessageText.toLowerCase().includes("resume")) {
          handlePrintRequest()
        }

        speak(responseText)
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("[v0] Chat request aborted")
        return
      }

      console.error("Chat failed:", error)
      const errorMessage = "My apologies. My conversational matrix is experiencing a brief anomaly. Please try again."

      if (!signal.aborted) {
        setChatHistory((prev) => [...prev, { id: Date.now(), role: "bot", text: errorMessage }])
        speak(errorMessage)
      }
    } finally {
      if (!signal.aborted) {
        setIsProcessing(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
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
  )
}
