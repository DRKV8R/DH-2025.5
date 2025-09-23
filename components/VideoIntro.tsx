"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface VideoIntroProps {
  onComplete: () => void
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMegaMessage, setShowMegaMessage] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const loadVideo = async () => {
      try {
        console.log("[v0] Loading video intro...")

        const directVideoUrl = process.env.NEXT_PUBLIC_INTRO_VIDEO_URL
        if (directVideoUrl && directVideoUrl.startsWith("http")) {
          if (directVideoUrl.includes("mega.nz")) {
            console.log("[v0] MEGA link detected - using download proxy")
            const megaProxyUrl = `/api/mega-download?url=${encodeURIComponent(directVideoUrl)}`
            setVideoUrl(megaProxyUrl)
            setIsLoading(false)
            return
          }

          try {
            const response = await fetch(directVideoUrl, {
              method: "HEAD",
              signal: signal,
            })
            if (response.ok && !signal.aborted) {
              console.log("[v0] Using direct video URL:", directVideoUrl)
              setVideoUrl(directVideoUrl)
              setIsLoading(false)
              return
            }
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === "AbortError") {
              console.log("[v0] Video loading aborted")
              return
            }
            console.log("[v0] Direct URL not accessible:", fetchError)
          }
        }

        if (signal.aborted) {
          return
        }

        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL || "intro-videos"
        console.log("[v0] Checking Supabase bucket:", bucketName)

        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        if (bucketError) {
          console.log("[v0] Error listing buckets:", bucketError)
          onComplete()
          return
        }

        const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)
        if (!bucketExists) {
          console.log("[v0] Bucket does not exist:", bucketName)
          console.log(
            "[v0] To add intro video: Create bucket '",
            bucketName,
            "' in Supabase Storage and upload video file",
          )
          onComplete()
          return
        }

        const { data, error } = await supabase.storage.from(bucketName).list("", {
          limit: 10,
          sortBy: { column: "created_at", order: "desc" },
        })

        if (error) {
          console.log("[v0] Storage list error:", error)
          onComplete()
          return
        }

        const videoFiles = data?.filter((file) => file.name.match(/\.(mp4|webm|ogg|mov|avi)$/i))

        if (videoFiles && videoFiles.length > 0 && !signal.aborted) {
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucketName).getPublicUrl(videoFiles[0].name)

          console.log("[v0] Found video file:", videoFiles[0].name)
          console.log("[v0] Generated public URL:", publicUrl)
          setVideoUrl(publicUrl)
        } else if (!signal.aborted) {
          console.log("[v0] No video files found in bucket - upload a video file to enable intro")
          onComplete()
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("[v0] Video loading aborted")
          return
        }
        console.error("[v0] Error loading video:", err)
        if (!signal.aborted) {
          onComplete()
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadVideo()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [onComplete])

  const handleVideoEnd = () => {
    console.log("[v0] Video ended, fading out...")
    if (videoRef.current) {
      videoRef.current.style.opacity = "0"
      setTimeout(onComplete, 500) // 500ms fade out
    }
  }

  const handleVideoError = (e: any) => {
    const error = e.target?.error || e
    console.error("[v0] Video playback error:", {
      code: error?.code,
      message: error?.message,
      url: videoUrl,
    })

    if (videoUrl?.includes("/api/mega-download")) {
      setShowMegaMessage(true)
      setTimeout(() => {
        setShowMegaMessage(false)
        onComplete()
      }, 3000)
      return
    }

    console.log("[v0] Video failed to play, continuing to main page")
    onComplete()
  }

  const handleVideoLoad = () => {
    console.log("[v0] Video loaded successfully")
    if (videoRef.current && userInteracted) {
      videoRef.current.play().catch((error) => {
        console.log("[v0] Autoplay with sound failed:", error)
      })
    }
  }

  const handleVideoClick = () => {
    if (videoRef.current && !userInteracted) {
      setUserInteracted(true)
      videoRef.current.muted = false
      videoRef.current.play().catch((error) => {
        console.log("[v0] Play with sound failed:", error)
      })
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-xl font-mono">Loading...</div>
      </div>
    )
  }

  if (showMegaMessage) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center font-mono max-w-2xl px-8">
          <div className="text-2xl mb-4">MEGA Download Failed</div>
          <div className="text-lg mb-2">Unable to process MEGA link at this time.</div>
          <div className="text-base opacity-80">Try uploading your video directly to Supabase Storage instead.</div>
          <div className="text-sm opacity-60 mt-4">Continuing to main page...</div>
        </div>
      </div>
    )
  }

  if (error || !videoUrl) {
    console.log("[v0] No video to display, skipping intro")
    return null
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {!userInteracted && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
          onClick={handleVideoClick}
        >
          <div className="bg-black/50 text-white px-6 py-3 rounded-lg font-mono text-sm">Click to enable sound</div>
        </div>
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted={!userInteracted}
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        className="w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: 1 }}
      />
    </div>
  )
}
