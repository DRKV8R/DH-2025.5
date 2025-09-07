"use client"

interface VideoDisplayProps {
  isGenerating: boolean
  videoUrl: string | null
  onClose: () => void
}

export default function VideoDisplay({ isGenerating, videoUrl, onClose }: VideoDisplayProps) {
  if (!isGenerating && !videoUrl) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-black border border-gray-700 p-4 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-white text-black rounded-full w-6 h-6 z-10 font-bold"
          >
            X
          </button>
          {isGenerating && !videoUrl && (
            <div className="w-full h-80 flex flex-col items-center justify-center">
              <p className="text-white font-mono text-lg animate-pulse">GENERATING VISUAL...</p>
              <p className="text-gray-400 font-sans text-sm mt-2">This may take a moment.</p>
            </div>
          )}
          {videoUrl && <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full" />}
        </div>
      </div>
    </div>
  )
}
