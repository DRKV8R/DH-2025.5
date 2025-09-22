"use client"

import { useState } from "react"
import { enhancedCVContent } from "@/data/enhanced-cv-content"

export default function CVButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("summary")

  const sections = [
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" }, // Added projects section
    { id: "education", label: "Education" },
    { id: "achievements", label: "Achievements" },
    { id: "cover", label: "Cover Letter" },
  ]

  return (
    <>
      {/* Floating CV Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-8 right-8 bg-white text-black px-6 py-3 text-sm font-geist-medium hover:bg-gray-200 transition-all duration-200 z-40 tracking-wide"
        aria-label="Open CV Modal"
      >
        CV
      </button>

      {/* CV Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-98 z-50 flex items-center justify-center p-4">
          <div className="cv-modal bg-black border border-white max-w-6xl max-h-[95vh] overflow-hidden flex">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r border-gray-800 p-6 overflow-y-auto">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors font-geist-normal ${
                      activeSection === section.id
                        ? "bg-white text-black font-geist-medium"
                        : "text-gray-300 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10 font-geist-light"
                aria-label="Close CV Modal"
              >
                ×
              </button>

              {/* Content Sections */}
              <div className="space-y-8">
                {activeSection === "summary" && (
                  <div>
                    <div className="text-center space-y-4 mb-8">
                      <h2 className="text-4xl font-geist-light">{enhancedCVContent.personal.name}</h2>
                      <p className="text-xl text-gray-300 font-geist-normal">{enhancedCVContent.personal.title}</p>
                      <p className="text-lg text-gray-400 font-geist-light">{enhancedCVContent.personal.company}</p>
                      <p className="text-sm text-gray-500 font-geist-light">{enhancedCVContent.personal.location}</p>
                      <div className="flex justify-center space-x-6 text-sm font-geist-normal">
                        <span>{enhancedCVContent.personal.phone}</span>
                        <span>•</span>
                        <span>{enhancedCVContent.personal.email}</span>
                        <span>•</span>
                        <a href={enhancedCVContent.personal.linkedin} className="hover:text-gray-300">
                          LinkedIn
                        </a>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-geist-medium mb-4">Professional Summary</h3>
                      <p className="text-gray-300 leading-relaxed text-lg font-geist-normal">
                        {enhancedCVContent.personal.summary}
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === "experience" && (
                  <div>
                    <h3 className="text-2xl font-geist-medium mb-6">Professional Experience</h3>
                    {enhancedCVContent.experience.map((exp, index) => (
                      <div key={index} className="mb-8 pb-6 border-b border-gray-800 last:border-b-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-geist-medium">{exp.title}</h4>
                            <p className="text-lg text-gray-300 font-geist-normal">{exp.company}</p>
                            <p className="text-sm text-gray-400 font-geist-light">{exp.location}</p>
                          </div>
                          <span className="text-sm text-gray-400 font-mono">{exp.period}</span>
                        </div>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-gray-300 text-sm leading-relaxed flex font-geist-normal">
                              <span className="text-red-500 mr-3">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "skills" && (
                  <div>
                    <h3 className="text-2xl font-geist-medium mb-6">Skills & Expertise</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-geist-semibold mb-4 text-gray-200">Technical Skills</h4>
                        <ul className="space-y-2">
                          {enhancedCVContent.skills.technical.map((skill, i) => (
                            <li key={i} className="text-gray-300 font-geist-normal flex">
                              <span className="text-red-500 mr-3">•</span>
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-geist-semibold mb-4 text-gray-200">Business Skills</h4>
                        <ul className="space-y-2">
                          {enhancedCVContent.skills.business.map((skill, i) => (
                            <li key={i} className="text-gray-300 font-geist-normal flex">
                              <span className="text-red-500 mr-3">•</span>
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
                    <h3 className="text-2xl font-geist-medium mb-6">Key Projects</h3>

                    {/* VISUALOOP Project */}
                    <div className="mb-8 pb-6 border-b border-gray-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-geist-medium">VISUALOOP: AI Music Visualizer Utility</h4>
                          <p className="text-lg text-gray-300 font-geist-normal">Personal Project</p>
                        </div>
                        <span className="text-sm text-gray-400 font-mono">2024 - Present</span>
                      </div>
                      <div className="space-y-4 text-gray-300 font-geist-normal">
                        <p className="leading-relaxed">
                          Sophisticated single-page web application that empowers users to create unique, shareable
                          music videos through AI-powered visual generation.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-geist-semibold text-gray-200 mb-2 uppercase tracking-wide">
                              Core Features
                            </h5>
                            <ul className="space-y-1 text-sm">
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>AI-powered video generation from album art
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Client-side FFmpeg audio/video merging
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Retro iPod-style interface with click wheel
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Seamless looping video visualizers
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Gallery system for saved projects
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-sm font-geist-semibold text-gray-200 mb-2 uppercase tracking-wide">
                              Technical Stack
                            </h5>
                            <ul className="space-y-1 text-sm">
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>React with TypeScript
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Google Gemini API (VEO-2.0)
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>FFmpeg.wasm for video processing
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Tailwind CSS with custom retro styling
                              </li>
                              <li className="flex">
                                <span className="text-red-500 mr-2">•</span>Client-side file processing
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-geist-semibold text-gray-200 mb-2 uppercase tracking-wide">
                            Workflow
                          </h5>
                          <p className="text-sm leading-relaxed">
                            Users upload image and audio assets → AI analyzes album art to generate visual prompts →
                            VEO-2.0 creates silent looping videos → Client-side FFmpeg merges video with audio → Final
                            MP4 available for download through nostalgic iPod interface
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Existing AI Projects */}
                    <div className="mb-8 pb-6 border-b border-gray-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-geist-medium">AI Integration & Model Training</h4>
                          <p className="text-lg text-gray-300 font-geist-normal">NorCapital Lending</p>
                        </div>
                        <span className="text-sm text-gray-400 font-mono">2015 - Present</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-geist-normal">
                        Pioneered AI integration in financial services, training 50+ machine learning models for
                        real-time lending decisions, audio source separation, and transcription capabilities across
                        enterprise applications.
                      </p>
                    </div>

                    <div className="mb-8 pb-6 border-b border-gray-800 last:border-b-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-geist-medium">Adult MMO & VR Development</h4>
                          <p className="text-lg text-gray-300 font-geist-normal">Independent Project</p>
                        </div>
                        <span className="text-sm text-gray-400 font-mono">2020 - Present</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-geist-normal">
                        Contributed to adult-facing massive open world metaverse with 100,000+ active users, gaining
                        insights into user-generated content, virtual economies, and immersive experience design.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === "education" && (
                  <div>
                    <h3 className="text-2xl font-geist-medium mb-6">Education</h3>
                    {enhancedCVContent.education.map((edu, index) => (
                      <div key={index} className="mb-8 pb-6 border-b border-gray-800 last:border-b-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-geist-medium">{edu.degree}</h4>
                            <p className="text-lg text-gray-300 font-geist-normal">{edu.university}</p>
                            <p className="text-sm text-gray-400 font-geist-light">{edu.location}</p>
                          </div>
                          <span className="text-sm text-gray-400 font-mono">{edu.period}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "achievements" && (
                  <div>
                    <h3 className="text-2xl font-geist-medium mb-6">Achievements</h3>
                    <ul className="space-y-2">
                      {enhancedCVContent.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-300 text-sm leading-relaxed flex font-geist-normal">
                          <span className="text-red-500 mr-3">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSection === "cover" && (
                  <div>
                    <h3 className="text-2xl font-geist-medium mb-6">Cover Letter</h3>
                    <p className="text-gray-300 leading-relaxed text-lg font-geist-normal">
                      {enhancedCVContent.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
