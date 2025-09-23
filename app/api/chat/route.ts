import { type NextRequest, NextResponse } from "next/server"
import { createGeminiClient } from "@/lib/gemini-client"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    const geminiClient = createGeminiClient()
    const response = await geminiClient.chatWithContext(message, conversationHistory)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response: "My apologies. My conversational matrix is experiencing a brief anomaly. Please try again.",
      },
      { status: 500 },
    )
  }
}
