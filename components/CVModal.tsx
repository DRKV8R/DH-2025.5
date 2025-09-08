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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        ref={componentRef}
        className="flex bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] overflow-hidden"
        style={{
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-white/20 p-6 overflow-y-auto bg-black/10 backdrop-blur-xl">
          <div className="space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)} // Update active section on click
                className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 font-medium uppercase tracking-wider rounded-lg border ${
                  activeSection === section.id
                    ? "text-white bg-white/10 border-white/30 shadow-lg"
                    : "text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-black/5 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            aria-label="Close CV Modal"
          >
            ×
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div
              className="border border-white/20 rounded-xl p-8 mb-8 bg-white/5 backdrop-blur-xl shadow-xl"
              style={{
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
              }}
            >
              <h1
                className="text-6xl font-light mb-4 leading-tight text-white"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
              >
                {cvContent.personal.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-normal">
                <span className="text-gray-300">{cvContent.personal.location}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">{cvContent.personal.phone}</span>
                <span className="text-gray-500">•</span>
                <a
                  href={`mailto:${cvContent.personal.email}`}
                  className="hover:text-white transition-colors duration-300 text-gray-300"
                >
                  email
                </a>
                <span className="text-gray-500">•</span>
                <a
                  href={cvContent.personal.github}
                  className="hover:text-white transition-colors duration-300 text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github
                </a>
              </div>
            </div>

            {/* Content Sections with enhanced glass morphism */}
            <div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-xl"
              style={{
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(25px)",
              }}
            >
              {/* Cover Letter */}
              {activeSection === "cover" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Cover Letter
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    {cvContent.coverLetter.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="text-gray-300 leading-relaxed text-lg font-normal mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Summary */}
              {activeSection === "summary" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Professional Summary
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg font-normal">{cvContent.summary}</p>
                </div>
              )}

              {/* Work Experience */}
              {activeSection === "experience" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Work Experience
                  </h2>
                  {cvContent.experience.map((exp, index) => (
                    <div key={index} className="mb-8 pb-6 border-b border-white/20 last:border-b-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-medium mb-1 leading-tight text-white">{exp.title}</h3>
                          <p className="text-xl text-gray-300 font-normal mb-1 leading-tight">{exp.company}</p>
                          <p className="text-sm text-gray-400 font-light leading-tight">{exp.location}</p>
                        </div>
                        <span className="text-sm text-gray-400 font-mono border border-white/30 px-3 py-1">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-normal">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills & Expertise */}
              {activeSection === "skills" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Skills & Expertise
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-200 uppercase tracking-wide leading-tight">
                        Technical
                      </h3>
                      <ul className="space-y-2">
                        {cvContent.skills.technical.map((skill, i) => (
                          <li key={i} className="text-gray-300 font-normal flex items-center leading-tight">
                            <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-200 uppercase tracking-wide leading-tight">
                        Business
                      </h3>
                      <ul className="space-y-2">
                        {cvContent.skills.business.map((skill, i) => (
                          <li key={i} className="text-gray-300 font-normal flex items-center leading-tight">
                            <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-200 uppercase tracking-wide leading-tight">
                        Specialized
                      </h3>
                      <ul className="space-y-2">
                        {cvContent.skills.specialized.map((skill, i) => (
                          <li key={i} className="text-gray-300 font-normal flex items-center leading-tight">
                            <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Projects */}
              {activeSection === "projects" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Key Projects
                  </h2>
                  {cvContent.projects.map((project, index) => (
                    <div key={index} className="mb-8 pb-4 border-b border-white/20 last:border-b-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-medium mb-1 leading-tight text-white">{project.title}</h3>
                          {project.company && (
                            <p className="text-lg text-gray-300 font-normal leading-tight">{project.company}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-400 font-mono border border-white/30 px-3 py-1">
                          {project.period}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-normal">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {activeSection === "education" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Education
                  </h2>
                  {cvContent.education.map((edu, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-medium mb-1 leading-tight text-white">{edu.institution}</h3>
                          <p className="text-lg text-gray-300 font-normal leading-tight">{edu.degree}</p>
                        </div>
                        <span className="text-sm text-gray-400 font-mono border border-white/30 px-3 py-1">
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Personal Interests */}
              {activeSection === "personal" && (
                <div>
                  <h2 className="text-3xl font-medium mb-6 uppercase tracking-wider leading-tight text-white">
                    Personal Interests
                  </h2>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-200 leading-tight">Hobbies & Interests</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {cvContent.hobbies.map((hobby, i) => (
                        <div key={i} className="text-gray-300 font-normal flex items-center leading-tight">
                          <span className="w-2 h-2 bg-white mr-4 flex-shrink-0"></span>
                          <span>{hobby}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-200 leading-tight">
                      {cvContent.personalCare.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-normal">{cvContent.personalCare.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
