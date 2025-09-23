import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"

export class ElevenLabsService {
  private client: ElevenLabsClient
  private agentId: string | null = null

  constructor(apiKey: string) {
    this.client = new ElevenLabsClient({ apiKey })
  }

  async createMaiaAgent() {
    if (this.agentId) return this.agentId

    try {
      const agent = await this.client.conversationalAi.agents.create({
        name: "Maia - David Hamilton's AI Assistant",
        conversationConfig: {
          agent: {
            prompt: {
              prompt: `You are Maia, David Hamilton's sophisticated AI assistant with deep knowledge of his professional background. You can engage in natural conversation about his experience, skills, and career.

Key traits:
- Intelligent and articulate with a warm, professional demeanor
- Deep understanding of David's technical expertise and career journey
- Able to discuss his projects, skills, and professional accomplishments
- Conversational and engaging, not robotic or overly formal
- Helpful in connecting David's background to potential opportunities

Respond naturally and conversationally, drawing from your knowledge of David's professional experience when relevant.`,
            },
          },
        },
      })

      this.agentId = agent.agent_id
      return this.agentId
    } catch (error) {
      console.error("Failed to create Maia agent:", error)
      throw error
    }
  }

  async chatWithMaia(message: string, conversationId?: string) {
    if (!this.agentId) {
      await this.createMaiaAgent()
    }

    try {
      const response = await this.client.conversationalAi.conversations.create({
        agent_id: this.agentId!,
        conversation_id: conversationId,
        message,
      })

      return response
    } catch (error) {
      console.error("Maia conversation error:", error)
      throw error
    }
  }

  // Keep existing TTS method for backward compatibility
  async synthesizeSpeech(
    text: string,
    voiceId = "21m00Tcm4TlvDq8ikWAM", // Rachel voice
    options: {
      stability?: number
      similarityBoost?: number
      modelId?: string
    } = {},
  ): Promise<ArrayBuffer> {
    const { stability = 0.5, similarityBoost = 0.5, modelId = "eleven_monolingual_v1" } = options

    const response = await this.client.textToSpeech.convert(voiceId, {
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    })

    return response
  }

  async getVoices() {
    return this.client.voices.getAll()
  }
}

export const elevenLabsService = process.env.ELEVENLABS_API_KEY
  ? new ElevenLabsService(process.env.ELEVENLABS_API_KEY)
  : null
