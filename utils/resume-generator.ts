import type { CVContent } from "@/types"

export function generateResumeText(content: CVContent): string {
  return `
${content.personal.name.toUpperCase()}
${content.personal.location}
${content.personal.phone}
${content.personal.email}

PROFESSIONAL SUMMARY
${content.summary}

WORK EXPERIENCE
${content.experience
  .map(
    (exp) => `
${exp.period}
${exp.title}
${exp.company} - ${exp.location}
${exp.description}
`,
  )
  .join("\n")}

TECHNICAL SKILLS
${content.skills.technical.join(", ")}

BUSINESS SKILLS
${content.skills.business.join(", ")}

SPECIALIZED SKILLS
${content.skills.specialized.join(", ")}

KEY PROJECTS
${content.projects
  .map(
    (project) => `
${project.period} - ${project.title}
${project.company || ""}
${project.description}
`,
  )
  .join("\n")}

EDUCATION
${content.education
  .map(
    (edu) => `
${edu.period} - ${edu.institution}
${edu.degree}
`,
  )
  .join("\n")}

PERSONAL INTERESTS
${content.hobbies.join(", ")}
  `.trim()
}

export function downloadResume(content: CVContent): void {
  const resumeText = generateResumeText(content)
  const blob = new Blob([resumeText], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = "David_Hamilton_Resume.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
