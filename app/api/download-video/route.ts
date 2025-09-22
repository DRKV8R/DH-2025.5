export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const megaUrl = searchParams.get("url")

    if (!megaUrl) {
      return new Response("Missing URL parameter", { status: 400 })
    }

    console.log("[v0] Attempting to fetch MEGA URL:", megaUrl)

    // Try to fetch the MEGA URL directly (this likely won't work due to CORS)
    const response = await fetch(megaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      console.log("[v0] MEGA fetch failed:", response.status, response.statusText)
      return new Response(`Failed to fetch video: ${response.statusText}`, {
        status: response.status,
      })
    }

    // Stream the video content
    const contentType = response.headers.get("content-type") || "video/mp4"
    const contentLength = response.headers.get("content-length")

    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    })

    if (contentLength) {
      headers.set("Content-Length", contentLength)
    }

    return new Response(response.body, { headers })
  } catch (error) {
    console.error("[v0] Video download error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
