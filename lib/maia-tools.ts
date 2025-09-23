import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface Tool {
  name: string
  description: string
  parameters: Record<string, any>
  execute: (params: any) => Promise<any>
}

export class MaiaToolkit {
  private supabase

  constructor() {
    const cookieStore = cookies()
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )
  }

  private tools: Tool[] = [
    {
      name: "search_cv_experience",
      description: "Search David's professional experience for specific skills, companies, or projects",
      parameters: {
        query: { type: "string", description: "Search query for experience" },
        section_type: { type: "string", description: "Optional: filter by section type (work, education, skills)" },
      },
      execute: async (params) => {
        const { data } = await this.supabase
          .from("resume_sections")
          .select("*")
          .ilike("content", `%${params.query}%`)
          .limit(3)

        return (
          data?.map((section) => ({
            title: section.title,
            company: section.company,
            content: section.content,
            technologies: section.technologies,
          })) || []
        )
      },
    },
    {
      name: "get_recent_projects",
      description: "Get David's recent or featured projects",
      parameters: {
        featured_only: { type: "boolean", description: "Only return featured projects" },
        limit: { type: "number", description: "Number of projects to return" },
      },
      execute: async (params) => {
        let query = this.supabase.from("projects").select("*")

        if (params.featured_only) {
          query = query.eq("featured", true)
        }

        const { data } = await query.order("created_at", { ascending: false }).limit(params.limit || 5)

        return data || []
      },
    },
    {
      name: "get_skills_by_category",
      description: "Get David's skills organized by category",
      parameters: {
        category: { type: "string", description: "Optional: filter by skill category" },
      },
      execute: async (params) => {
        let query = this.supabase.from("skills").select("*")

        if (params.category) {
          query = query.eq("category", params.category)
        }

        const { data } = await query.order("proficiency", { ascending: false })

        return data || []
      },
    },
  ]

  getAvailableTools(): Tool[] {
    return this.tools
  }

  async executeTool(toolName: string, parameters: any): Promise<any> {
    const tool = this.tools.find((t) => t.name === toolName)
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`)
    }

    return await tool.execute(parameters)
  }

  getToolsForPrompt(): string {
    return this.tools
      .map((tool) => `${tool.name}: ${tool.description}\nParameters: ${JSON.stringify(tool.parameters)}`)
      .join("\n\n")
  }
}

export const maiaToolkit = new MaiaToolkit()
