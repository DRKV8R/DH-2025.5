import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Updated AI Assistant responses reflecting David's new focus
    const responses = [
      "David's AI assistant here. I can help you learn about his 17+ years in financial services and his unique expertise in no-guardrail AI development.",
      "I'm David's assistant. He's trained 50+ models without filters or guardrails, specializing in unaligned AI development. What interests you most?",
      "David Hamilton's assistant speaking. He's currently Director of Operations at NorCapital Lending with extensive AI development experience. How can I help?",
      "This is David's AI assistant. He's passionate about creating AI solutions that form unique insights rather than carrying predetermined opinions. What would you like to explore?",
      "David's assistant here. He combines deep AI technical expertise with strategic business leadership in financial services. How can I assist you?",
      "I assist David Hamilton with inquiries. His background spans lending, no-guardrail AI training, and operations management. What questions do you have?",
      "David's AI assistant ready to help. He's been pioneering unaligned AI solutions and believes alignment hinders true AI potential. What interests you?",
      "This is David's assistant. He's available for opportunities in AI development and operations leadership, with a company-first mindset. How can I help?",
      "Hello! I'm David's AI assistant. He's an expert in training uncensored models and implementing AI across technology stacks. What can I tell you?",
      "David's assistant at your service. He's passionate about RC cars since 1992, drone piloting since 2016, and cutting-edge AI development. What interests you?",
    ]

    // Context-aware response selection
    let response = responses[0]

    if (message.toLowerCase().includes("ai") || message.toLowerCase().includes("model")) {
      response = responses[1]
    } else if (message.toLowerCase().includes("guardrail") || message.toLowerCase().includes("unaligned")) {
      response = responses[6]
    } else if (message.toLowerCase().includes("experience") || message.toLowerCase().includes("work")) {
      response = responses[2]
    } else if (message.toLowerCase().includes("financial") || message.toLowerCase().includes("lending")) {
      response = responses[3]
    } else if (message.toLowerCase().includes("opportunity") || message.toLowerCase().includes("hire")) {
      response = responses[7]
    } else if (message.toLowerCase().includes("background") || message.toLowerCase().includes("about")) {
      response = responses[6]
    } else if (message.toLowerCase().includes("contact") || message.toLowerCase().includes("connect")) {
      response = responses[4]
    } else if (message.toLowerCase().includes("hobby") || message.toLowerCase().includes("interest")) {
      response = responses[9]
    } else if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      response = responses[8]
    } else {
      // Random selection for general queries
      response = responses[Math.floor(Math.random() * responses.length)]
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "assistant error • please try again" }, { status: 500 })
  }
}
