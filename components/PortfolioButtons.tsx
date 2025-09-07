"use client"

import { useState } from "react"

const cvContent = {
  personal: {
    name: "David Hamilton",
    location: "Newport Beach, CA",
    phone: "949 328 4313",
    email: "dev@loanlink.app",
    github: "https://github.com/davidhamilton",
  },

  coverLetter: `As a director a few times over in both publicly traded and start up financial services and software companies I aim to bring a unique and valuable perspective to your team having the ability to access interact and train models with no guardrails, & no filter. This makes me uniquely qualified to speak to the assumptions, capabilities and shortcomings of modern AI.

Personally and privately I have trained and fine tuned over 50 models to date both adult chat and simply unaligned or non bias data implementation. This is something that I believe will be one thing that hinders AI. Alignment is to carry our opinions as its own instead of forming unique insights. This is obvious in science and medical research but is just as true in simple conversations. 

In this short time occupying this planet I chose not to take myself so seriously that I'm blinded to nuance in experience. There are seemingly infinite points of view in any situation placing high value in individuality and conformity alike. There is an inherent danger in cultivating and developing something to be smarter than creator.

In my previous roles, I have honed my skills in data analysis, project management, and team leadership. I have a proven track record of leveraging novel data sets to drive strategic decision making and enhanced customer experiences. In every scenario where I work for a company I have approached the end goal with a company first mindset making the company I chose to represent extremely important. 

With that said I am eager to discuss how my background in AI development, finance, and customer experience mixed with insane work ethic can contribute to the continued success of your vision. Thank you for your careful consideration.

Carpe Diem,
David Hamilton`,

  summary: `Dynamic Director of Operations with over 17 years of experience in the lending and finance industry, known for driving operational excellence and fostering strong broker relationships. Expertise encompasses residential mortgage, commercial finance, and innovative systems integration, ensuring seamless processes and enhanced client satisfaction. Proven track record of developing marketing platforms and production workflows that boost efficiency and profitability. Passionate about creating solutions that meet client needs beyond traditional hours, leading teams with a commitment to exceptional service and real-time responsiveness. Thrives in managing fully remote teams while maintaining high standards of performance and accountability.`,

  experience: [
    {
      period: "March 2018 – Present",
      title: "Executive Director Of Operations",
      company: "NorCapital Lending Corporation",
      location: "Newport Beach, CA",
      description:
        "Our small but mighty team tackles lending with a personal approach. At NorCapital we know that lending shouldn't only happen between 9-5. We encourage industry professionals, investors, and homeowners to give us a call. We make ourselves available in real time to our clients and partners. You won't have a 15-minute Q+A with a phone robot you will get solutions for all personal and client facing scenarios.",
    },
    {
      period: "January 2016 – July 2017",
      title: "Sales Manager | Rehash Division Founder",
      company: "Greenlight Loans/Nationstar Mortgage/MrCooper",
      location: "Irvine, California",
      description:
        "My position with this amazing group started in the Irvine CA office of Greenlight financial services. As a loan officer in a high volume call center, I had the ability to field more than 100 loan scenarios a week. This lead to the addition of one-off special forces of call center banking. I was instrumental in building leading and ultimately managing rehash for the remainder of my time with the organization. Without a single inbound call we ranked top 5 in the organization for our 4 year run.",
    },
    {
      period: "July 2014 – December 2015",
      title: "MLO",
      company: "Greenlight Loans/Nationstar Mortgage/MrCooper",
      location: "Orange County, California Area",
      description:
        "You've got the GREENLIGHT!! Nationstar Mortgage Mr. Cooper... The rest is history. Licensed in 10 states.",
    },
    {
      period: "August 2017 – December 2017",
      title: "Senior Mortgage Loan Officer",
      company: "loanDepot",
      location: "Irvine, California",
      description:
        "Amazing vision, great technology, and leadership unrivaled by most companies. I had the chance to work alongside a team with a work ethic that is in line with the speed of the industry and market.",
    },
    {
      period: "August 2005 – November 2009",
      title: "VP Sales",
      company: "Integrity Funding",
      location: "Newport Beach",
      description:
        "Led B2B commercial finance initiatives, enhancing revenue streams through strategic partnerships. Developed franchise and startup finance solutions tailored to client needs, increasing market penetration. Managed ophthalmology medical equipment financing projects, streamlining approval processes.",
    },
    {
      period: "March 2003 – September 2005",
      title: "Finance B2B Commercial",
      company: "Nationwide Funding LLC",
      location: "Irvine",
      description:
        "Led B2B commercial finance initiatives, enhancing revenue streams through strategic partnerships. Developed franchise and startup finance solutions tailored to client needs, increasing market penetration.",
    },
  ],

  skills: {
    technical: [
      "API integration",
      "Programming | Developer",
      "Systems architect",
      "Telephony server",
      "Microsoft Azure | AWS | Cloud Architect",
      "Google Cloud",
      "Google Workspace",
      "Microsoft Systems",
      "Microsoft Server",
      "Twilio",
    ],
    business: [
      "Sales",
      "Leadership",
      "Operations Management",
      "Team Leadership",
      "Project Management",
      "Data Analysis",
      "Strategic Decision Making",
      "Customer Experience",
      "Broker Relations",
    ],
    specialized: [
      "AI Development",
      "Model Training & Fine-tuning",
      "No-Guardrail AI Implementation",
      "Unaligned Data Processing",
      "Adult Industry Technology",
      "VR Development",
      "Mobile Application Development",
    ],
  },

  education: [
    {
      period: "January 2002 – January 2004",
      institution: "CEI",
      degree: "(Expired) MCSE in MCDBA & Business and Personal/Financial Services Marketing Operations",
    },
  ],

  projects: [
    {
      period: "January 2015 – Present",
      title: "AI Integration | Source Separation | Transcription",
      company: "Integrity Finance | Norcapital",
      description:
        "Starting off in audio source separation it was an extension to audio production. This was my first real exposure to python and AI. After 2015 I leveraged AI in every workplace app. If the app did not offer transcription I would place our software that does in our technology stack to leverage transcription capabilities.",
    },
    {
      period: "January 2021 – Present",
      title: "Generative AI",
      company: "Homelab | Startup",
      description:
        "The first time my focus was not on capture but on the output. Integration, tool usage, antigenic collaborative workflow.",
    },
    {
      period: "January 2020 – Present",
      title: "Adult MMO",
      description:
        "I have been part of an adult facing Massive open world meta verse for over 5 years with over a few hundred thousand players. Gained valuable insights into what the world looks like if you create it for yourself.",
    },
  ],

  hobbies: [
    "Weight lifting",
    "Drone Pilot (since 2016)",
    "Software Development",
    "DJ, Music Producer, Song Writer",
    "Runner",
    "Auto Racing, Motorcycle Racing, Sim Racing",
    "Digital art, Photography, Video editing",
    "Server Architect",
    "Fashion, Design",
    "Mobile Application Development",
    "Sound Design, Video Production",
    "Game Development",
    "AI Development",
    "VR Development",
    "Radio Controlled car racing (since 1992)",
  ],

  personalCare: {
    title: "Personal Care (Adult Electronics)",
    description:
      "With a fairly long history in the space I have been involved in testing prelaunch, beta, pre production, Alpha hardware, alpha software, focus groups, international sales. I have trained and currently self hosting & training uncensored and genre focused adult industry language models. The space is new and exciting and would be honored to be the first ever for any exploitation free adult generative technology.",
  },
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

export default function PortfolioButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("cover")

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-8 right-8 bg-white text-black px-8 py-4 text-sm font-geist-medium hover:bg-gray-200 transition-all duration-200 z-40 tracking-wider uppercase"
        aria-label="Open Portfolio"
      >
        PORTFOLIO
      </button>

      {/* CV Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={() => setIsModalOpen(false)}
          />

          <div
            className="relative cv-modal border border-white/50 max-w-6xl max-h-[95vh] overflow-hidden flex w-full shadow-2xl"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Sidebar */}
            <div className="w-48 border-r border-white/40 p-6 overflow-y-auto">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 text-xs transition-all duration-200 font-geist-normal uppercase tracking-wider border ${
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
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10 font-geist-light"
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
                            <h3 className="text-xl font-geist-medium mb-1 leading-tight text-white">
                              {edu.institution}
                            </h3>
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
                      <h3 className="text-xl font-geist-semibold mb-4 text-gray-200 leading-tight">
                        Hobbies & Interests
                      </h3>
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
      )}
    </>
  )
}
