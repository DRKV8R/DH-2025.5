// API Connectors - Copy and paste these functions

// 1. GEMINI AI CONNECTOR (Server-side only)
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

export const initializeGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required")
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return {
    chatModel: genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    }),
    triageModel: genAI.getGenerativeModel({ model: "gemini-pro" }),
  }
}

// 2. RUNPOD API CONNECTOR
export const runPodAPI = {
  async generateVideo(prompt: string, endpointId: string, apiKey: string) {
    const response = await fetch(`https://api.runpod.ai/v2/${endpointId}/runsync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          width: 512,
          height: 512,
          num_frames: 24,
          fps: 8,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          seed: Math.floor(Math.random() * 1000000),
          decoding_t: 14,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`RunPod API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.output?.video_url || null
  },

  async checkStatus(jobId: string, apiKey: string) {
    const response = await fetch(`https://api.runpod.ai/v2/status/${jobId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`RunPod status check error: ${response.statusText}`)
    }

    return await response.json()
  },
}

// 3. BARK VOICE SYNTHESIS CONNECTOR
export const barkAPI = {
  async generateSpeech(text: string, endpointId: string, apiKey: string) {
    const response = await fetch(`https://api.runpod.ai/v2/${endpointId}/runsync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: {
          text: text,
          voice_preset: "v2/en_speaker_6", // Female voice
          temperature: 0.7,
          silence_duration: 0.25,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Bark API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.output?.audio_url || null
  },
}

// 4. WALT LORA (Stable Video Diffusion) CONNECTOR
export const waltLoraAPI = {
  async generateVideo(imageUrl: string, prompt: string, endpointId: string, apiKey: string) {
    const response = await fetch(`https://api.runpod.ai/v2/${endpointId}/runsync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: {
          image: imageUrl,
          prompt: prompt,
          negative_prompt: "blurry, low quality, distorted",
          num_frames: 25,
          fps: 6,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          seed: Math.floor(Math.random() * 1000000),
          decoding_t: 7,
          cfg_scale: 2.5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Walt LoRA API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.output?.video_url || null
  },
}

// 5. MAI LORA (Custom Character) CONNECTOR
export const maiLoraAPI = {
  async generateImage(prompt: string, loraUrl: string, apiKey: string) {
    const response = await fetch(loraUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: {
          prompt: `<lora:mai_character:1.0> ${prompt}`,
          negative_prompt: "blurry, low quality, distorted, nsfw",
          width: 512,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Mai LoRA API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.output?.image_url || null
  },
}

// 6. COMBINED VIDEO GENERATION PIPELINE
export const videoGenerationPipeline = {
  async generateMaiVideo(
    prompt: string,
    step: number,
    apiKeys: {
      runpod: string
      waltEndpoint: string
      maiLoraUrl: string
    },
  ) {
    try {
      // Step 1: Generate Mai character image
      const imageUrl = await maiLoraAPI.generateImage(
        `professional woman in modern office, ${prompt}`,
        apiKeys.maiLoraUrl,
        apiKeys.runpod,
      )

      if (!imageUrl) throw new Error("Failed to generate character image")

      // Step 2: Generate video from image
      const videoUrl = await waltLoraAPI.generateVideo(
        imageUrl,
        `smooth camera movement, professional lighting, ${prompt}`,
        apiKeys.waltEndpoint,
        apiKeys.runpod,
      )

      return videoUrl
    } catch (error) {
      console.error("Video generation pipeline failed:", error)
      return null
    }
  },
}

// 7. ENVIRONMENT VARIABLES SETUP
/*
Add these to your .env.local file (server-side only):

GEMINI_API_KEY=your_gemini_api_key_here
RUNPOD_API_KEY=your_runpod_api_key_here
BARK_ENDPOINT_ID=your_bark_endpoint_id_here
WALT_LORA_ENDPOINT_ID=your_walt_lora_endpoint_id_here
MAI_LORA_URL=your_mai_lora_url_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
*/

// 8. USAGE EXAMPLE (Server-side only)
/*
import { runPodAPI, barkAPI, videoGenerationPipeline } from '@/lib/api-connectors'

// Generate video (in API route or server action)
const videoUrl = await videoGenerationPipeline.generateMaiVideo(
  "Mai greeting a new visitor in the office lobby",
  0,
  {
    runpod: process.env.RUNPOD_API_KEY!,
    waltEndpoint: process.env.WALT_LORA_ENDPOINT_ID!,
    maiLoraUrl: process.env.MAI_LORA_URL!,
  }
)

// Generate speech (in API route or server action)
const audioUrl = await barkAPI.generateSpeech(
  "Hello! I'm Mai, David's AI assistant.",
  process.env.BARK_ENDPOINT_ID!,
  process.env.RUNPOD_API_KEY!
)
*/
