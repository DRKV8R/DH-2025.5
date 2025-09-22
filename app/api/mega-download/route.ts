import { type NextRequest, NextResponse } from "next/server"
import { File } from "megajs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const megaUrl = searchParams.get("url")

    if (!megaUrl) {
      return NextResponse.json({ error: "MEGA URL is required" }, { status: 400 })
    }

    console.log("[v0] Processing MEGA download for:", megaUrl)

    // Create MEGA file object from URL
    const file = File.fromURL(megaUrl)

    // Load file attributes
    await file.loadAttributes()

    console.log("[v0] MEGA file loaded:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Download file as buffer
    const buffer = await file.downloadBuffer()

    // Determine content type based on file extension
    const contentType = file.name?.endsWith(".mp4")
      ? "video/mp4"
      : file.name?.endsWith(".webm")
        ? "video/webm"
        : file.name?.endsWith(".mov")
          ? "video/quicktime"
          : "video/mp4"

    // Return the video file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=3600",
        "Accept-Ranges": "bytes",
      },
    })
  } catch (error) {
    console.error("[v0] MEGA download error:", error)
    return NextResponse.json(
      {
        error: "Failed to download from MEGA",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
