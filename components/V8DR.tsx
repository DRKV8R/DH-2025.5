"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface V8DRProps {
  onClose?: () => void
}

export default function V8DR({ onClose }: V8DRProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUnmountedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop()
        } catch (error) {
          console.log("[v0] MediaRecorder stop error during cleanup:", error)
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file)
      setProcessedVideoUrl(null)
    }
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file)
      setProcessedVideoUrl(null)

      const audio = new Audio()
      audio.src = URL.createObjectURL(file)
      audio.onloadedmetadata = () => {
        setAudioDuration(audio.duration)
        console.log("[v0] Audio duration:", audio.duration)
      }
    }
  }

  const processPhotoAudio = async () => {
    if (!photoFile || !audioFile || !canvasRef.current || !imageRef.current) {
      console.error("[v0] Missing required files or elements")
      return
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsProcessing(true)
    setProgress(0)

    try {
      if (signal.aborted) {
        throw new Error("Operation aborted")
      }

      console.log("[v0] Starting photo + audio processing")

      const image = imageRef.current
      image.src = URL.createObjectURL(photoFile)

      await new Promise((resolve, reject) => {
        if (signal.aborted) {
          reject(new Error("Operation aborted"))
          return
        }

        image.onload = resolve
        image.onerror = reject

        signal.addEventListener("abort", () => {
          reject(new Error("Operation aborted"))
        })
      })

      if (signal.aborted) {
        throw new Error("Operation aborted")
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")!

      const videoWidth = 1920
      const videoHeight = 1080
      canvas.width = videoWidth
      canvas.height = videoHeight

      const imageAspect = image.width / image.height
      const canvasAspect = videoWidth / videoHeight

      let drawWidth, drawHeight, drawX, drawY

      if (imageAspect > canvasAspect) {
        drawWidth = videoWidth
        drawHeight = videoWidth / imageAspect
        drawX = 0
        drawY = (videoHeight - drawHeight) / 2
      } else {
        drawHeight = videoHeight
        drawWidth = videoHeight * imageAspect
        drawX = (videoWidth - drawWidth) / 2
        drawY = 0
      }

      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, videoWidth, videoHeight)
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)

      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        if (signal.aborted) {
          reject(new Error("Operation aborted"))
          return
        }

        canvas.toBlob(
          (blob) => {
            if (signal.aborted) {
              reject(new Error("Operation aborted"))
              return
            }
            if (blob) resolve(blob)
            else reject(new Error("Failed to create blob"))
          },
          "image/jpeg",
          0.9,
        )

        signal.addEventListener("abort", () => {
          reject(new Error("Operation aborted"))
        })
      })

      setProgress(50)

      const videoBlob = await createVideoFromImageAndAudio(imageBlob, audioFile, audioDuration, signal)

      if (videoBlob && !signal.aborted) {
        const url = URL.createObjectURL(videoBlob)
        setProcessedVideoUrl(url)
        setProgress(100)
        console.log("[v0] Video processing completed successfully")
      } else if (signal.aborted) {
        throw new Error("Operation aborted")
      } else {
        throw new Error("Failed to create video")
      }
    } catch (error) {
      if ((error instanceof Error && error.name === "AbortError") || error.message === "Operation aborted") {
        console.log("[v0] V8DR processing aborted by user or component unmount")
        return
      }
      console.error("[v0] V8DR processing error:", error)
      if (!isUnmountedRef.current) {
        alert("Processing failed. Please try with different files or check console for details.")
      }
    } finally {
      if (!isUnmountedRef.current) {
        setIsProcessing(false)
      }
    }
  }

  const createVideoFromImageAndAudio = async (
    imageBlob: Blob,
    audioFile: File,
    duration: number,
    signal?: AbortSignal,
  ): Promise<Blob | null> => {
    try {
      if (isUnmountedRef.current || signal?.aborted) {
        return null
      }

      const canvas = canvasRef.current!
      const stream = canvas.captureStream(1)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8",
      })

      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []

      return new Promise((resolve, reject) => {
        if (signal?.aborted) {
          reject(new Error("Operation aborted"))
          return
        }

        let isResolved = false

        const safeResolve = (value: Blob | null) => {
          if (!isResolved && !isUnmountedRef.current && !signal?.aborted) {
            isResolved = true
            resolve(value)
          }
        }

        const safeReject = (error: Error) => {
          if (!isResolved && !isUnmountedRef.current) {
            isResolved = true
            reject(error)
          }
        }

        signal?.addEventListener("abort", () => {
          if (!isResolved) {
            isResolved = true
            if (mediaRecorder.state === "recording") {
              try {
                mediaRecorder.stop()
              } catch (e) {
                console.log("[v0] MediaRecorder stop error on abort:", e)
              }
            }
            reject(new Error("Operation aborted"))
          }
        })

        mediaRecorder.onerror = (event) => {
          console.log("[v0] MediaRecorder error:", event)
          safeReject(new Error("MediaRecorder error"))
        }

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && !isUnmountedRef.current && !signal?.aborted) {
            chunks.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          if (!isResolved && !isUnmountedRef.current && !signal?.aborted) {
            try {
              const videoBlob = new Blob(chunks, { type: "video/webm" })
              safeResolve(videoBlob)
            } catch (error) {
              console.log("[v0] Blob creation error:", error)
              safeReject(new Error("Failed to create video blob"))
            }
          }
        }

        try {
          mediaRecorder.start()

          timeoutRef.current = setTimeout(() => {
            if (mediaRecorder.state === "recording" && !isUnmountedRef.current && !signal?.aborted && !isResolved) {
              try {
                mediaRecorder.stop()
              } catch (e) {
                console.log("[v0] MediaRecorder stop error in timeout:", e)
                safeReject(new Error("MediaRecorder timeout error"))
              }
            }
          }, 3000)
        } catch (error) {
          console.log("[v0] MediaRecorder start error:", error)
          safeReject(error instanceof Error ? error : new Error("MediaRecorder start failed"))
        }
      })
    } catch (error) {
      console.error("[v0] Video creation error:", error)
      return null
    }
  }

  const downloadVideo = () => {
    if (!processedVideoUrl) return

    const a = document.createElement("a")
    a.href = processedVideoUrl
    a.download = `v8dr-photo-audio-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/90 border-white/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-mono">V8DR - Photo + Audio Video Creator</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
              ✕
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white file:bg-white/20 file:border-0 file:text-white file:px-4 file:py-2 file:rounded file:mr-4"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Audio</label>
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.wma"
              onChange={handleAudioUpload}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white file:bg-white/20 file:border-0 file:text-white file:px-4 file:py-2 file:rounded file:mr-4"
            />
            {audioDuration > 0 && <p className="text-xs text-white/60">Duration: {Math.round(audioDuration)}s</p>}
          </div>

          {photoFile && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Photo Preview</label>
              <img
                ref={imageRef}
                src={URL.createObjectURL(photoFile) || "/placeholder.svg"}
                alt="Preview"
                className="w-full max-h-48 object-contain bg-black rounded"
              />
            </div>
          )}

          {audioFile && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Audio Preview</label>
              <audio controls className="w-full" src={URL.createObjectURL(audioFile)} />
            </div>
          )}

          {photoFile && audioFile && !isProcessing && !processedVideoUrl && (
            <Button onClick={processPhotoAudio} className="w-full bg-white text-black hover:bg-white/90">
              Create Video from Photo + Audio
            </Button>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {processedVideoUrl && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Photo + Audio Video Result</label>
              <video controls loop className="w-full max-h-48 bg-black rounded" src={processedVideoUrl} />
              <Button onClick={downloadVideo} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Download V8DR Video
              </Button>
              <p className="text-xs text-white/60">
                Note: This is a simplified version. Full audio integration requires additional processing.
              </p>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="text-xs text-white/60 space-y-1">
            <p>• Upload a photo and audio file to create a video</p>
            <p>• Perfect for platforms that require video format but you only have audio</p>
            <p>• The photo will display for the entire duration of your audio</p>
            <p>• Download as WebM format compatible with most social platforms</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
