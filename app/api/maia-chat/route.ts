import type { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { elevenLabsService } from "@/lib/elevenlabs-client"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, voiceEnabled = false, useElevenLabsAgent = false } = await request.json()

    // Initialize Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    if (useElevenLabsAgent && elevenLabsService) {
      try {
        const response = await elevenLabsService.chatWithMaia(message, sessionId)

        // Store conversation in Supabase
        if (sessionId) {
          await supabase.from("agent_conversations").insert([
            {
              session_id: sessionId,
              message_type: "user",
              content: message,
              context_data: { voice_enabled: voiceEnabled, agent_type: "elevenlabs" },
            },
            {
              session_id: sessionId,
              message_type: "assistant",
              content: response.message,
              context_data: { voice_enabled: voiceEnabled, agent_type: "elevenlabs" },
            },
          ])
        }

        return new Response(
          JSON.stringify({
            type: "elevenlabs_response",
            content: response.message,
            conversationId: response.conversation_id,
            audioUrl: response.audio_url,
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        )
      } catch (error) {
        console.error("ElevenLabs agent error:", error)
        // Fall back to Gemini if ElevenLabs fails
      }
    }

    // Get or create session
    let session = null
    if (sessionId) {
      const { data } = await supabase.from("sessions").select("*").eq("id", sessionId).single()
      session = data
    }

    if (!session) {
      const { data: newSession } = await supabase
        .from("sessions")
        .insert({
          persona_preference: "maia",
          settings: { voice_enabled: voiceEnabled },
        })
        .select()
        .single()
      session = newSession
    }

    // Get conversation history
    const { data: conversationHistory } = await supabase
      .from("agent_conversations")
      .select("*")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true })
      .limit(10)

    // Get CV context from resume_sections with embeddings
    const { data: cvContext } = await supabase
      .from("resume_sections")
      .select("content, title, section_type, company, technologies")
      .limit(5)

    // Build context prompt
    const contextPrompt = `You are Maia, David Hamilton's sophisticated AI assistant. You have deep knowledge of his professional background and can engage in natural conversation about his experience, skills, and career.

Professional Context:
${cvContext?.map((section) => `${section.section_type}: ${section.title} at ${section.company || "N/A"}\n${section.content}\nTechnologies: ${section.technologies?.join(", ") || "N/A"}`).join("\n\n")}

Conversation History:
${conversationHistory?.map((msg) => `${msg.message_type}: ${msg.content}`).join("\n")}

Current Message: ${message}

Respond as Maia with personality, intelligence, and deep knowledge of David's background. Keep responses conversational and engaging.`

    // Generate streaming response
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
    const result = await model.generateContentStream(contextPrompt)

    // Store user message
    await supabase.from("agent_conversations").insert({
      session_id: session.id,
      message_type: "user",
      content: message,
      context_data: { voice_enabled: voiceEnabled },
    })

    // Create readable stream
    const encoder = new TextEncoder()
    let fullResponse = ""

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            fullResponse += text

            const data = JSON.stringify({
              type: "text",
              content: text,
              sessionId: session.id,
            })

            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Store assistant response
          await supabase.from("agent_conversations").insert({
            session_id: session.id,
            message_type: "assistant",
            content: fullResponse,
            context_data: { voice_enabled: voiceEnabled },
          })

          // If voice is enabled, generate audio
          if (voiceEnabled && process.env.ELEVENLABS_API_KEY) {
            try {
              const audioResponse = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
                method: "POST",
                headers: {
                  Accept: "audio/mpeg",
                  "Content-Type": "application/json",
                  "xi-api-key": process.env.ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                  text: fullResponse,
                  model_id: "eleven_monolingual_v1",
                  voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                  },
                }),
              })

              if (audioResponse.ok) {
                const audioBuffer = await audioResponse.arrayBuffer()
                const audioBase64 = Buffer.from(audioBuffer).toString("base64")

                const audioData = JSON.stringify({
                  type: "audio",
                  content: audioBase64,
                  sessionId: session.id,
                })

                controller.enqueue(encoder.encode(`data: ${audioData}\n\n`))
              }
            } catch (audioError) {
              console.error("ElevenLabs audio generation error:", audioError)
            }
          }

          controller.enqueue(encoder.encode(`data: {"type": "done"}\n\n`))
          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Maia chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Maia's neural pathways are temporarily disrupted. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
