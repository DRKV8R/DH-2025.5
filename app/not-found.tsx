import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-geist-light">404</h1>
        <p className="text-xl text-gray-300 font-geist-normal">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-white text-black px-6 py-3 font-geist-medium hover:bg-gray-200 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
