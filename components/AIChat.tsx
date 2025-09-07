"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface AIChatProps {
  initialMessage: string
  onClose: () => void
  onResponse?: (response: string) => void
}

export default function AIChat({ initialMessage, onClose, onResponse }: AIChatProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      // Update marquee with response immediately
      if (onResponse) {
        onResponse(data.response)
      }

      // Auto-close after showing response
      setTimeout(() => {
        onClose()
      }, 8000) // Give time to read the response in marquee
    } catch (error) {
      console.error("Chat error:", error)
      if (onResponse) {
        onResponse("assistant error • please try again")
      }
      setTimeout(() => {
        onClose()
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      handleSendMessage(input)
      setInput("")
    }
  }

  // Invisible overlay for immediate interaction
  return (
    <div className="fixed inset-0 bg-transparent z-60 flex items-end justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-[100px] p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black border border-gray-700 px-4 py-3 text-white font-mono"
            placeholder={isLoading ? "assistant processing..." : "continue conversation..."}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-white text-black px-6 py-3 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
          >
            {isLoading ? "..." : "SEND"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-3 hover:bg-red-600 font-mono"
          >
            ESC
          </button>
        </div>
      </form>
    </div>
  )
}
