import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "David Hamilton - Director of Operations | AI Development | Newport Beach",
  description:
    "Experienced director in financial services & AI development. 17+ years in lending, 50+ trained models, innovative solutions for modern businesses.",
  keywords: [
    "AI development",
    "financial services",
    "operations director",
    "Newport Beach",
    "lending",
    "machine learning",
    "portfolio management",
    "no-guardrail AI",
    "financial technology",
    "operations management",
  ],
  authors: [{ name: "David Hamilton", url: "https://davidhamilton.dev" }],
  creator: "David Hamilton",
  publisher: "David Hamilton",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://davidhamilton.dev",
    title: "David Hamilton - Director of Operations | AI Development",
    description: "AI Development & Financial Services Expert - 17+ years experience, 50+ trained models",
    siteName: "David Hamilton Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "David Hamilton - AI Development Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Hamilton - AI Development Expert",
    description: "Director of Operations specializing in no-guardrail AI development and financial services innovation",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://davidhamilton.dev",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Essential performance hints only */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <link rel="preconnect" href="https://davidhamilton.dev" />

        {/* Schema.org structured data for enhanced search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "David Hamilton",
              jobTitle: "Director of Operations",
              worksFor: {
                "@type": "Organization",
                name: "NorCapital Lending Corporation",
                url: "https://www.norcapitalcorp.com",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Newport Beach",
                addressRegion: "CA",
                addressCountry: "US",
              },
              url: "https://davidhamilton.dev",
              sameAs: ["https://linkedin.com/in/approval", "https://www.norcapitalcorp.com"],
              knowsAbout: [
                "AI Development",
                "Financial Services",
                "Lending",
                "Operations Management",
                "Machine Learning",
                "No-Guardrail AI Training",
                "Financial Technology",
                "Risk Assessment",
                "Process Optimization",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Director of Operations",
                occupationLocation: {
                  "@type": "City",
                  name: "Newport Beach, CA",
                },
                skills: [
                  "AI Model Training",
                  "Financial Services Operations",
                  "Team Leadership",
                  "Strategic Planning",
                  "Risk Management",
                ],
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "UC Irvine - Paul Merage School of Business",
              },
            }),
          }}
        />

        {/* Additional structured data for professional profile */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "David Hamilton - AI Development Consulting",
              description: "Expert AI development and financial services consulting with 17+ years experience",
              provider: {
                "@type": "Person",
                name: "David Hamilton",
              },
              areaServed: {
                "@type": "State",
                name: "California",
              },
              serviceType: [
                "AI Development",
                "Operations Management",
                "Financial Services Consulting",
                "Machine Learning Implementation",
              ],
            }),
          }}
        />

        {/* Viewport and mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${GeistSans.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  )
}
