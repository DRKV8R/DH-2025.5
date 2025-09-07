"use server"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { videoGenerationPipeline, barkAPI } from "@/lib/api-connectors"
import { cvContentString } from "@/data/cv-data"
import { locationDescription, journeySteps } from "@/data/journey-data"

// CONFIG - Access environment variables directly on the server
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!
const RUNPOD_API_KEY = process.env.NEXT_PUBLIC_RUNPOD_API_KEY!
const BARK_ENDPOINT_ID = process.env.NEXT_PUBLIC_BARK_ENDPOINT_ID!
const WALT_LORA_ENDPOINT_ID = process.env.NEXT_PUBLIC_WALT_LORA_ENDPOINT_ID!
const MAI_LORA_URL = process.env.NEXT_PUBLIC_MAI_LORA_URL!

// AI INIT - Initialize models on the server
const genAI = new GoogleGenerativeAI(API_KEY)
const chatModel = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ],
})
const triageModel = genAI.getGenerativeModel({ model: "gemini-pro" })

// TYPES
type Intent = "EXPERIENCE_QUERY" | "SKILLS_QUERY" | "CONTACT_REQUEST" | "CV_REQUEST" | "GREETING" | "GENERAL"

// Helper function to get conversation intent (server-side)
async function getConversationIntent(input: string): Promise<Intent> {
  const prompt = `Classify this user input into one of these intents: EXPERIENCE_QUERY, SKILLS_QUERY, CONTACT_REQUEST, CV_REQUEST, GREETING, GENERAL. Input: "${input}". Respond with only the intent name.`

  try {
    const result = await triageModel.generateContent(prompt)
    const intent = result.response.text().trim() as Intent
    return ["EXPERIENCE_QUERY", "SKILLS_QUERY", "CONTACT_REQUEST", "CV_REQUEST", "GREETING", "GENERAL"].includes(intent)
      ? intent
      : "GENERAL"
  } catch {
    return "GENERAL"
  }
}

// Helper function to generate visual prompt (server-side)
async function generateVisualPrompt(context: string, step: number): Promise<string> {
  const prompt = `Based on this conversation context: "${context}" and journey step ${step}, create a cinematic visual prompt for Mai in ${locationDescription}. Current scene: ${journeySteps[step] || journeySteps[0]}. Make it photorealistic and professional.`

  const result = await triageModel.generateContent(prompt)
  return result.response.text()
}

// Main Server Action to handle chat and media generation
export async function handleChatAndMediaAction(
  userMessage: string,
  chatHistory: { role: string; parts: { text: string }[] }[],
  currentJourneyStep: number,
  initialGreeting: string, // Pass initial greeting for chat history setup
) {
  let responseText = ""
  let audioUrl: string | null = null
  let videoUrl: string | null = null
  let nextJourneyStep = currentJourneyStep
  let triggerPrint = false

  try {
    // Reconstruct chat session history for the server-side model
    const historyForModel = [
      {
        role: "user",
        parts: [
          {
            text: `You are Mai, the bespoke AI concierge for Mr. Hamilton's portfolio. Your personality is brilliant, professional, witty, charming, and subtly flirty. Your knowledge comes ONLY from the provided CV. You can use non-speech vocalizations like [laughs] and [sighs]. Your goal is to guide the user to book a meeting with Mr. Hamilton.

--- CV CONTENT START ---
${cvContentString}
--- CV CONTENT END ---`,
          },
        ],
      },
      { role: "model", parts: [{ text: initialGreeting }] },
      ...chatHistory.map((msg) => ({ role: msg.role, parts: [{ text: msg.text }] })),
    ]

    const chat = chatModel.startChat({ history: historyForModel })

    const intent = await getConversationIntent(userMessage)

    switch (intent) {
      case "CV_REQUEST":
        responseText =
          "I'd be delighted to show you Mr. Hamilton's comprehensive CV. Let me prepare that for you right away. [smiles]"
        triggerPrint = true
        break

      case "CONTACT_REQUEST":
        responseText =
          "Excellent choice! Mr. Hamilton is always excited to connect with forward-thinking individuals. You can reach him directly at dev@loanlink.app or call 949 328 4347. Shall I help you draft an introduction?"
        nextJourneyStep = Math.min(currentJourneyStep + 1, journeySteps.length - 1)
        break

      case "EXPERIENCE_QUERY":
        responseText =
          "Mr. Hamilton's experience is quite remarkable - over 17 years in financial services with a unique focus on no-guardrail AI development. He's trained 50+ models and believes in fostering unique insights rather than conformity. What specific aspect interests you most?"
        break

      case "SKILLS_QUERY":
        responseText =
          "Mr. Hamilton's skill set is fascinating - he combines technical expertise in AI model training with strategic business leadership. His specialty? Working with unaligned AI systems and identifying biases in traditional alignment approaches. Quite cutting-edge, wouldn't you say?"
        break

      case "GREETING":
        responseText =
          "Hello there! [warm smile] I'm Mai, Mr. Hamilton's AI concierge. I'm here to help you discover why Mr. Hamilton might be the perfect addition to your team. What would you like to know about his remarkable journey in AI and financial services?"
        break

      default:
        const result = await chat.sendMessage(userMessage)
        responseText = result.response.text()
    }

    // Generate speech
    if (BARK_ENDPOINT_ID && RUNPOD_API_KEY) {
      try {
        audioUrl = await barkAPI.generateSpeech(responseText, BARK_ENDPOINT_ID, RUNPOD_API_KEY)
      } catch (error) {
        console.error("Server-side Bark API failed:", error)
        // Continue without audio if it fails
      }
    }

    // Trigger visual generation for important interactions
    if (["CONTACT_REQUEST", "CV_REQUEST"].includes(intent) && WALT_LORA_ENDPOINT_ID && MAI_LORA_URL && RUNPOD_API_KEY) {
      try {
        const visualPrompt = await generateVisualPrompt(userMessage, nextJourneyStep)
        videoUrl = await videoGenerationPipeline.generateMaiVideo(visualPrompt, nextJourneyStep, {
          runpod: RUNPOD_API_KEY,
          waltEndpoint: WALT_LORA_ENDPOINT_ID,
          maiLoraUrl: MAI_LORA_URL,
        })
      } catch (error) {
        console.error("Server-side video generation failed:", error)
        // Continue without video if it fails
      }
    }

    return {
      responseText,
      audioUrl,
      videoUrl,
      nextJourneyStep,
      triggerPrint,
    }
  } catch (error) {
    console.error("Server Action failed:", error)
    return {
      responseText: "My apologies. My conversational matrix is experiencing a brief anomaly. Please try again.",
      audioUrl: null,
      videoUrl: null,
      nextJourneyStep: currentJourneyStep,
      triggerPrint: false,
    }
  }
}
