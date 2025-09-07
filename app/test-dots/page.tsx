"use client"

import DotHeader from "@/components/DotHeader"
import DotMatrixMarquee from "@/components/DotMatrixMarquee"

export default function TestDotsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-8 font-mono">Dot Matrix Test Page</h1>

      {/* Test DotHeader - Compact Design */}
      <div className="mb-12">
        <h2 className="text-lg mb-4 font-mono">DotHeader Test (Compact "d."):</h2>
        <div className="border border-gray-700 p-4 inline-block bg-black">
          <DotHeader />
        </div>
        <p className="text-sm text-gray-400 mt-2">Compact lowercase "d" + single dot period - BRIGHTEST on page</p>
      </div>

      {/* Size Comparison */}
      <div className="mb-12">
        <h2 className="text-lg mb-4 font-mono">Size Comparison:</h2>

        <div className="flex items-center space-x-8 mb-4">
          <div className="text-center">
            <DotHeader />
            <p className="text-xs mt-2 font-mono">Compact Header</p>
            <p className="text-xs text-gray-500">80×60px</p>
          </div>

          <div className="text-center">
            <div className="w-[80px] h-[60px] border border-gray-700">
              <DotMatrixMarquee text="d." speed={0} />
            </div>
            <p className="text-xs mt-2 font-mono">Marquee "d."</p>
            <p className="text-xs text-gray-500">80×60px</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-mono">d.</div>
            <p className="text-xs mt-2 font-mono">Text "d."</p>
            <p className="text-xs text-gray-500">Reference</p>
          </div>
        </div>
      </div>

      {/* Pattern Breakdown */}
      <div className="mb-12">
        <h2 className="text-lg mb-4 font-mono">Pattern Breakdown:</h2>
        <div className="bg-gray-900 p-4 font-mono text-xs">
          <pre>{`
Compact "d" Pattern (6×5):
Row 0: [0,0,1,1,0]  // Top curve
Row 1: [0,0,0,1,0]  // Ascender
Row 2: [0,1,1,1,0]  // Body top
Row 3: [1,0,0,1,0]  // Left + right
Row 4: [1,0,0,1,0]  // Left + right  
Row 5: [0,1,1,1,0]  // Body bottom

Plus: Single dot at (45, 45) for period
Total size: 80×60 pixels
          `}</pre>
        </div>
      </div>

      {/* Brightness Test */}
      <div className="mb-12">
        <h2 className="text-lg mb-4 font-mono">Brightness Verification:</h2>
        <div className="flex items-center space-x-4 p-4 bg-gray-900">
          <DotHeader />
          <span className="text-white">vs</span>
          <div className="w-12 h-12 bg-white"></div>
          <span className="text-gray-400">Header dots should match pure white brightness</span>
        </div>
      </div>

      {/* Grid Alignment */}
      <div className="mb-12">
        <h2 className="text-lg mb-4 font-mono">Grid Alignment:</h2>
        <div className="border border-gray-700 p-4 inline-block bg-black relative">
          <DotHeader />
          {/* Alignment grid */}
          <div className="absolute inset-0 pointer-events-none">
            <svg width="80" height="60" className="opacity-20">
              {/* 5px grid */}
              {Array.from({ length: 17 }, (_, i) => (
                <line key={i} x1={i * 5} y1="0" x2={i * 5} y2="60" stroke="#333" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 13 }, (_, i) => (
                <line key={i} x1="0" y1={i * 5} x2="80" y2={i * 5} stroke="#333" strokeWidth="0.5" />
              ))}
              {/* Period position marker */}
              <circle cx="45" cy="45" r="4" fill="none" stroke="#ff0000" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">Red circle shows period position</p>
      </div>

      <div className="mt-8 p-4 border border-gray-700 bg-gray-900">
        <h3 className="font-mono mb-2">Compact Design Checklist:</h3>
        <ul className="text-sm space-y-1 font-mono">
          <li>✓ Smaller, compact "d" (6×5 pattern)</li>
          <li>✓ Single circle for period</li>
          <li>✓ 80×60px total size</li>
          <li>✓ BRIGHTEST dots on page</li>
          <li>✓ Perfect dot alignment</li>
          <li>✓ Symmetrical design</li>
          <li>✓ Clean, minimal appearance</li>
        </ul>
      </div>
    </div>
  )
}
