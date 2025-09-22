"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const ensureBucketExists = async () => {
    try {
      const response = await fetch("/api/create-bucket", {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create bucket")
      }
    } catch (error) {
      console.error("Error ensuring bucket exists:", error)
      throw error
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 1073741824) {
      setMessage("File too large. Please select a video under 1GB.")
      return
    }

    setUploading(true)
    setMessage("")

    try {
      await ensureBucketExists()

      const fileName = `intro-${Date.now()}.${file.name.split(".").pop()}`

      const { error } = await supabase.storage.from("intro-videos").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) throw error

      setMessage("Video uploaded successfully! Refresh the page to see the intro.")
    } catch (error) {
      console.error("Upload error:", error)
      setMessage(`Upload failed: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-40 bg-black/80 p-4 rounded border border-white/20">
      <div className="text-white text-sm mb-2">Upload Intro Video</div>
      <input type="file" accept="video/*" onChange={handleUpload} disabled={uploading} className="text-white text-xs" />
      {message && <div className="text-xs mt-2 text-white/80">{message}</div>}
    </div>
  )
}
