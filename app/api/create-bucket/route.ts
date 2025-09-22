import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Use service role key for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === "intro-videos")

    if (!bucketExists) {
      const { error } = await supabaseAdmin.storage.createBucket("intro-videos", {
        public: true,
      })

      if (error) {
        console.error("Error creating bucket:", error)
        return NextResponse.json({ error: "Failed to create bucket" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bucket creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
