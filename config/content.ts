// Easy component updates and content management
export const CONTENT_CONFIG = {
  personal: {
    name: "David Hamilton",
    location: "Newport Beach CA",
    title: "Director of Operations",
    company: "NorCapital Lending Corporation",
    phone: "949 328 4347",
    email: "david@norcapitalcorp.com",
    linkedin: "https://linkedin.com/in/approval",
    website: "www.norcapitalcorp.com",
  },

  nameplate: {
    name: "David Hamilton",
    location: "Newport Beach CA",
    descriptors: ["innovator", "designer", "operator", "creator"], // For future typewriter effect
  },

  sections: {
    D: {
      title: "Dashboard",
      description: "Portfolio analytics and metrics",
      content: "Real-time insights into AI model performance and business operations",
    },
    A: {
      title: "About",
      description: "Background and philosophy",
      content: "17+ years in financial services, 50+ trained AI models, no-guardrail development expertise",
    },
    V: {
      title: "Ventures",
      description: "Key projects and case studies",
      content: "NorCapital Lending transformation, AI-driven risk assessment, operational excellence",
    },
    I: {
      title: "Insights",
      description: "Process and learnings",
      content: "Methodologies for training unrestricted AI models and scaling financial operations",
    },
    D2: {
      title: "Details",
      description: "Technical specifications",
      content: "Python, R, TensorFlow, AWS, real-time lending solutions, 24/7 support systems",
    },
  },

  ai: {
    persona: "David's AI assistant",
    capabilities: [
      "17+ years financial services experience",
      "50+ trained AI models",
      "No-guardrail AI development",
      "Real-time lending solutions",
      "Operations management expertise",
    ],
    responses: {
      greeting:
        "David's assistant here. I can help you learn about his 17+ years in financial services and AI development.",
      ai_focus: "David specializes in training models without guardrails and implementing cutting-edge AI solutions.",
      experience:
        "He's currently Director of Operations at NorCapital Lending with extensive startup and public company experience.",
      contact: "David is available for opportunities in AI development and operations leadership roles.",
    },
  },

  seo: {
    keywords: [
      "AI development",
      "financial services",
      "operations director",
      "Newport Beach",
      "lending",
      "machine learning",
      "no-guardrail AI",
      "financial technology",
      "operations management",
    ],
    skills: [
      "AI Model Training",
      "Financial Services Operations",
      "Team Leadership",
      "Strategic Planning",
      "Risk Management",
      "Process Optimization",
      "Digital Transformation",
    ],
  },
} as const

export type ContentConfig = typeof CONTENT_CONFIG
