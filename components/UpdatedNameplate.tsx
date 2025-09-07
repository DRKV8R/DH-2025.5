"use client"

import { updatedCVContent } from "@/data/updated-cv-content"

export default function UpdatedNameplate() {
  return (
    <div className="text-left space-y-4 max-w-5xl">
      {/* Name */}
      <div className="space-y-0">
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-geist-light tracking-tight leading-[0.8]">
          {updatedCVContent.personal.name.split(" ")[0]}
        </h1>
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-geist-light tracking-tight leading-[0.8]">
          {updatedCVContent.personal.name.split(" ")[1]}
        </h1>
      </div>

      {/* Location */}
      <p className="text-3xl md:text-4xl lg:text-5xl text-gray-300 tracking-wide font-geist-light leading-tight">
        Newport Beach CA
      </p>

      {/* Contact Information - Symmetrically Arranged */}
      <div className="flex flex-wrap items-center gap-6 text-lg md:text-xl font-geist-normal text-gray-400">
        <a
          href={`mailto:${updatedCVContent.personal.email}`}
          className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
        >
          email
        </a>
        <span className="text-gray-600">•</span>
        <a
          href={updatedCVContent.personal.github}
          className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
        <span className="text-gray-600">•</span>
        <a
          href={`tel:${updatedCVContent.personal.phone}`}
          className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
        >
          phone
        </a>
      </div>
    </div>
  )
}
