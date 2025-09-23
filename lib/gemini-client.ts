import { GoogleGenerativeAI } from "@google/generative-ai"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { resumeContent } from "@/data/resume-content"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export class GeminiRAGClient {
  private model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  private supabase

  constructor() {
    const cookieStore = cookies()
    this.supabase = createServerClient(
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
  }

  async storeResumeContent() {
    await this.supabase.from("messages").insert({
      role: "system",
      content: resumeContent,
      persona: "mai",
      metadata: { type: "resume_rag", source: "david_hamilton_resume" },
    })
  }

  async chatWithContext(userMessage: string, conversationHistory: any[] = []) {
    const { data: contextData } = await this.supabase
      .from("messages")
      .select("content")
      .eq("persona", "mai")
      .eq("metadata->type", "resume_rag")
      .limit(1)

    const context = contextData?.[0]?.content || resumeContent

    const prompt = `
    You are Mai, David Hamilton's AI assistant. You have access to his complete professional background and can answer questions about his experience, skills, and career.
    
    Context about David Hamilton:
    ${context}
    
    Conversation History:
    ${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}
    
    User: ${userMessage}
    
    Respond as Mai, David's helpful assistant. Be professional, knowledgeable about his background, and ready to provide detailed information about his experience and capabilities.
    `

    const result = await this.model.generateContent(prompt)
    return result.response.text()
  }
}

export function createGeminiClient() {
  return new GeminiRAGClient()
}
