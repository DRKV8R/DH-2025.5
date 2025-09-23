"use client"

import type React from "react"
import { useState, useEffect, useRef, type FormEvent } from "react"
import DotMatrixMarquee from "./DotMatrixMarquee"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import type { SpeechRecognition } from "web-speech-api"

interface UIMessage {
  id: number
  role: "user" | "assistant"
  text: string
  timestamp: Date
}

interface MarqueeFooterProps {
  handlePrintRequest: () => void
}

export default function MarqueeFooter({ handlePrintRequest }: MarqueeFooterProps) {
  const [chatHistory, setChatHistory] = useState<UIMessage[]>([])
  const [marqueeText, setMarqueeText] = useState(
    "MAIA • David Hamilton's AI Assistant • Voice & Text Interface Active • Ask about experience, skills, projects .........",
  )
  const [chatInput, setChatInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setChatInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    const initializeSession = async () => {
      try {
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "initialize",
            conversationHistory: [],
          }),
        })
      } catch (error) {
        console.error("Session initialization failed:", error)
      }
    }

    initializeSession()

    const hasVisited = localStorage.getItem("hasVisitedDavidHamiltonPortfolio")
    const greeting = hasVisited
      ? "Welcome back. MAIA interface active • Ask about David Hamilton's background"
      : "MAIA • David Hamilton's AI Assistant • Voice & Text Interface Active • Ask about experience, skills, projects ........"

    if (!hasVisited) localStorage.setItem("hasVisitedDavidHamiltonPortfolio", "true")

    setMarqueeText(greeting)
  }, [])

  useEffect(() => {
    const displayHistory =
      chatHistory.length > 0
        ? chatHistory.slice(-3) // Show last 3 messages
        : [
            {
              id: 0,
              role: "assistant" as const,
              text: "MAIA online • Ready to discuss David Hamilton's professional background • Voice & text enabled",
              timestamp: new Date(),
            },
          ]

    const marqueeContent = displayHistory.map((msg) => `${msg.role.toUpperCase()}: ${msg.text}`).join(" ••• ")

    setMarqueeText(marqueeContent)
  }, [chatHistory])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const playAudio = (audioBase64: string) => {
    if (!voiceEnabled) return

    try {
      const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))], { type: "audio/mpeg" })

      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current = new Audio(audioUrl)

      audioRef.current.onplay = () => setIsPlaying(true)
      audioRef.current.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      audioRef.current.play()
    } catch (error) {
      console.error("Audio playback failed:", error)
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

    const userMessage: UIMessage = {
      id: Date.now(),
      role: "user",
      text: userMessageText,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])

    try {
      const response = await fetch("/api/maia-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessageText,
          sessionId,
          voiceEnabled,
        }),
        signal,
      })

      if (!response.ok) throw new Error("Network response was not ok")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let assistantResponse = ""
      const assistantMessage: UIMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "",
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === "text") {
                assistantResponse += data.content
                setChatHistory((prev) =>
                  prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, text: assistantResponse } : msg)),
                )
              } else if (data.type === "audio" && voiceEnabled) {
                playAudio(data.content)
              } else if (data.type === "done") {
                if (!sessionId && data.sessionId) {
                  setSessionId(data.sessionId)
                }
              }
            } catch (parseError) {
              console.error("Parse error:", parseError)
            }
          }
        }
      }

      if (
        userMessageText.toLowerCase().includes("cv") ||
        userMessageText.toLowerCase().includes("resume") ||
        userMessageText.toLowerCase().includes("experience")
      ) {
        handlePrintRequest()
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("[v0] Maia request aborted")
        return
      }

      console.error("Maia chat failed:", error)
      const errorMessage = "Maia's neural pathways are temporarily disrupted. Please try again."

      if (!signal.aborted) {
        setChatHistory((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            text: errorMessage,
            timestamp: new Date(),
          },
        ])
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
          className="w-full h-full bg-transparent border-none outline-none text-white px-4 py-[6px] font-sans placeholder-gray-500 disabled:opacity-50 pr-24"
          placeholder={
            isProcessing ? "Maia is processing..." : isListening ? "Listening..." : "Ask Maia about David Hamilton..."
          }
          autoComplete="off"
        />

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Voice toggle */}
          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`text-xs transition-colors duration-300 ${
              voiceEnabled ? "text-green-400 hover:text-green-300" : "text-gray-500 hover:text-gray-400"
            }`}
            title={voiceEnabled ? "Voice enabled" : "Voice disabled"}
          >
            {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          </button>

          {/* Microphone toggle */}
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleListening}
              className={`text-xs transition-colors duration-300 ${
                isListening ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-white"
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff size={12} /> : <Mic size={12} />}
            </button>
          )}

          {/* Send button */}
          {chatInput && !isProcessing && (
            <button
              type="submit"
              className="text-xs text-gray-400 hover:text-white transition-colors duration-300 font-mono"
            >
              SEND
            </button>
          )}

          {/* Status indicator */}
          <div
            className={`w-2 h-6 rounded-sm animate-pulse ${
              isProcessing ? "bg-blue-500" : isPlaying ? "bg-green-500" : isListening ? "bg-red-500" : "bg-gray-600"
            }`}
          />
        </div>
      </form>
    </div>
  )
}
