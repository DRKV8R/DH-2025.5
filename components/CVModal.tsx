"use client"

import type React from "react"
import { useRef, useState } from "react"
import { cvContent } from "@/data/cv-data"

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
  printTrigger: React.MutableRefObject<() => void>
}

const sections = [
  { id: "cover", label: "Cover Letter" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "personal", label: "Personal" },
]

export default function CVModal({ isOpen, onClose, printTrigger }: CVModalProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("cover")

  const handlePrint = () => {
    if (componentRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>David Hamilton Resume</title>
              <style>
                body { font-family: Helvetica, Arial, sans-serif; margin: 20px; }
                pre { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              ${componentRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  printTrigger.current = handlePrint

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        ref={componentRef}
      >
        {/* Sidebar Navigation */}
        <div className="w-64 bg-black/50 border-r border-white/20 p-6">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === section.id
                    ? "bg-white/20 text-white border border-white/30"
                    : "text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="text-white font-mono">
            {activeSection === "cover" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Cover Letter</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>Dear next ex boss,</p>
                  <p>{cvContent.coverLetter}</p>
                </div>
              </div>
            )}

            {activeSection === "summary" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Professional Summary</h2>
                <p className="text-sm leading-relaxed">{cvContent.summary}</p>
              </div>
            )}

            {activeSection === "experience" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Experience</h2>
                <div className="space-y-6">
                  {cvContent.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-white/20 pl-4">
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-white/80">{exp.company}</p>
                      <p className="text-sm text-white/60 mb-2">{exp.period}</p>
                      <p className="text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "skills" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Skills</h2>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(cvContent.skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
                      <ul className="space-y-1 text-sm">
                        {skillList.map((skill, index) => (
                          <li key={index} className="text-white/80">
                            • {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "projects" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Projects</h2>
                <div className="space-y-6">
                  {cvContent.projects.map((project, index) => (
                    <div key={index} className="border border-white/20 rounded p-4">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-sm text-white/60 mb-2">{project.period}</p>
                      <p className="text-sm leading-relaxed mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-white/10 rounded text-xs border border-white/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "education" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Education</h2>
                <div className="space-y-4">
                  {cvContent.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-white/20 pl-4">
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-white/80">{edu.school}</p>
                      <p className="text-sm text-white/60">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "personal" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Personal</h2>
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    <strong>Location:</strong> {cvContent.personal.location}
                  </p>
                  <p>
                    <strong>Interests:</strong> {cvContent.personal.interests.join(", ")}
                  </p>
                  <p>
                    <strong>Languages:</strong> {cvContent.personal.languages.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
