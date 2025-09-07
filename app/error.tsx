"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-geist-light">Error</h1>
        <p className="text-xl text-gray-300 font-geist-normal">Something went wrong</p>
        <button
          onClick={reset}
          className="inline-block bg-white text-black px-6 py-3 font-geist-medium hover:bg-gray-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
