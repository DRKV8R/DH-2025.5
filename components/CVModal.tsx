"use client"

import type React from "react"
import { useRef, useState } from "react" // Import useState
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
  const [activeSection, setActiveSection] = useState("cover") // Add activeSection state

  const handlePrint = () => {
    if (componentRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>David Hamilton Resume</title>
              <style>
                body { font-family: monospace; margin: 20px; }
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
        ref={componentRef}
        className="glass-pane max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="w-48 border-r border-white/40 p-6 overflow-y-auto">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)} // Update active section on click
                className={`w-full text-left px-4 py-2 text-xs transition-all duration-1000 font-geist-normal uppercase tracking-wider border ${
                  activeSection === section.id
                    ? "text-white font-geist-medium border-white/50"
                    : "text-gray-300 hover:text-white border-white/20 hover:border-white/40"
                }`}
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-400 text-lg"
            aria-label="Close CV Modal"
          >
            ×
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div
              className="border border-white/30 p-6 mb-8"
              style={{
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
              }}
            >
              <h1 className="text-6xl font-geist-light mb-3 leading-tight text-white">{cvContent.personal.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm font-geist-normal">
                <span className="text-gray-300">{cvContent.personal.location}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">{cvContent.personal.phone}</span>
                <span className="text-gray-500">•</span>
                <a
                  href={`mailto:${cvContent.personal.email}`}
                  className="hover:text-white transition-colors duration-1000 text-gray-300"
                >
                  email
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href={cvContent.personal.github}
                  className="hover:text-white transition-colors duration-1000 text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github
                </a>
              </div>
            </div>

            {/* Content Sections */}
            {activeSection === "cover" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Cover Letter
                </h2>
                <div className="prose prose-invert max-w-none">
                  {cvContent.coverLetter.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed text-lg font-geist-normal mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "summary" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Professional Summary
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg font-geist-normal">{cvContent.summary}</p>
              </div>
            )}

            {activeSection === "experience" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Work Experience
                </h2>
                {cvContent.experience.map((exp, index) => (
                  <div key={index} className="mb-8 pb-6 border-b border-white/20 last:border-b-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-geist-medium mb-1 leading-tight text-white">{exp.title}</h3>
                        <p className="text-xl text-gray-300 font-geist-normal mb-1 leading-tight">{exp.company}</p>
                        <p className="text-sm text-gray-400 font-geist-light leading-tight">{exp.location}</p>
                      </div>
                      <span className="text-sm text-gray-400 font-mono border border-white/30 px-3 py-1">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed font-geist-normal">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "skills" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Skills & Expertise
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-geist-semibold mb-4 text-gray-200 uppercase tracking-wide leading-tight">
                      Technical
                    </h3>
                    <ul className="space-y-2">
                      {cvContent.skills.technical.map((skill, i) => (
                        <li key={i} className="text-gray-300 font-geist-normal flex items-center leading-tight">
                          <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-geist-semibold mb-4 text-gray-200 uppercase tracking-wide leading-tight">
                      Business
                    </h3>
                    <ul className="space-y-2">
                      {cvContent.skills.business.map((skill, i) => (
                        <li key={i} className="text-gray-300 font-geist-normal flex items-center leading-tight">
                          <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-geist-semibold mb-4 text-gray-200 uppercase tracking-wide leading-tight">
                      Specialized
                    </h3>
                    <ul className="space-y-2">
                      {cvContent.skills.specialized.map((skill, i) => (
                        <li key={i} className="text-gray-300 font-geist-normal flex items-center leading-tight">
                          <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "projects" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Key Projects
                </h2>
                {cvContent.projects.map((project, index) => (
                  <div key={index} className="mb-8 pb-4 border-b border-white/20 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-geist-medium mb-1 leading-tight text-white">{project.title}</h3>
                        {project.company && (
                          <p className="text-lg text-gray-300 font-geist-normal leading-tight">{project.company}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-400 font-mono border border-white/30 px-3 py-1">
                        {project.period}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed font-geist-normal">{project.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "education" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Education
                </h2>
                {cvContent.education.map((edu, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-geist-medium mb-1 leading-tight text-white">{edu.institution}</h3>
                        <p className="text-lg text-gray-300 font-geist-normal leading-tight">{edu.degree}</p>
                      </div>
                      <span className="text-sm text-gray-400 font-mono border border-white/30 px-3 py-1">
                        {edu.period}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "personal" && (
              <div>
                <h2 className="text-3xl font-geist-medium mb-6 uppercase tracking-wider leading-tight text-white">
                  Personal Interests
                </h2>

                <div className="mb-8">
                  <h3 className="text-xl font-geist-semibold mb-4 text-gray-200 leading-tight">Hobbies & Interests</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {cvContent.hobbies.map((hobby, i) => (
                      <div key={i} className="text-gray-300 font-geist-normal flex items-center leading-tight">
                        <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                        <span>{hobby}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-geist-semibold mb-4 text-gray-200 leading-tight">
                    {cvContent.personalCare.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-geist-normal">
                    {cvContent.personalCare.description}
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
