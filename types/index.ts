export interface PersonalInfo {
  name: string
  location: string
  phone: string
  email: string
  github: string
}

export interface Experience {
  period: string
  title: string
  company: string
  location: string
  description: string
}

export interface Project {
  period: string
  title: string
  company?: string
  description: string
}

export interface Education {
  period: string
  institution: string
  degree: string
}

export interface Skills {
  technical: string[]
  business: string[]
  specialized: string[]
}

export interface CVContent {
  personal: PersonalInfo
  coverLetter: string
  summary: string
  experience: Experience[]
  skills: Skills
  projects: Project[]
  education: Education[]
  hobbies: string[]
  personalCare: {
    title: string
    description: string
  }
}

export interface DictionaryEntry {
  language: string
  sections: {
    text: string
    speed: number
    style: string
  }[]
}
