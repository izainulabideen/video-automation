export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      scenarios: {
        Row: {
          id: string
          title: string
          niche: string
          hook: string
          audience: string | null
          emotion: string | null
          palette: string | null
          status: 'draft' | 'in_production' | 'published'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scenarios']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: 'draft' | 'in_production' | 'published' }
        Update: Partial<Database['public']['Tables']['scenarios']['Insert']>
      }
      prompts: {
        Row: {
          id: string
          scenario_id: string | null
          scene_type: string
          caption_word: string | null
          prompt_text: string
          ai_tool: string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['prompts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['prompts']['Insert']>
      }
      scripts: {
        Row: {
          id: string
          scenario_id: string | null
          body: string
          word_count: number | null
          duration_sec: number | null
          voice_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scripts']['Row'], 'id' | 'created_at' | 'updated_at' | 'word_count'>
        Update: Partial<Database['public']['Tables']['scripts']['Insert']>
      }
      graphics: {
        Row: {
          id: string
          scenario_id: string | null
          prompt_id: string | null
          file_url: string
          file_name: string
          file_size_kb: number | null
          scene_type: string | null
          caption_word: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['graphics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['graphics']['Insert']>
      }
      videos: {
        Row: {
          id: string
          scenario_id: string | null
          file_url: string | null
          platform_urls: Json | null
          duration_sec: number | null
          status: 'editing' | 'exported' | 'published'
          publish_date: string | null
          performance: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['videos']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: 'editing' | 'exported' | 'published' }
        Update: Partial<Database['public']['Tables']['videos']['Insert']>
      }
      tags: {
        Row: { id: string; name: string }
        Insert: Omit<Database['public']['Tables']['tags']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['tags']['Insert']>
      }
      scenario_tags: {
        Row: { scenario_id: string; tag_id: string }
        Insert: Database['public']['Tables']['scenario_tags']['Row']
        Update: Partial<Database['public']['Tables']['scenario_tags']['Insert']>
      }
    }
  }
}
