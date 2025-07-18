import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          user_id: string
          video_id: string
          video_title: string
          video_thumbnail: string
          video_url: string
          messages: Array<{
            role: 'system' | 'user' | 'assistant'
            content: string
            created_at: string
          }>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          video_title: string
          video_thumbnail: string
          video_url: string
          messages?: Array<{
            role: 'system' | 'user' | 'assistant'
            content: string
            created_at: string
          }>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          video_title?: string
          video_thumbnail?: string
          video_url?: string
          messages?: Array<{
            role: 'system' | 'user' | 'assistant'
            content: string
            created_at: string
          }>
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}