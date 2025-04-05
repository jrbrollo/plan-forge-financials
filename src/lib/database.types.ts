export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      planners: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          company: string | null
          profile_picture: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          company?: string | null
          profile_picture?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          company?: string | null
          profile_picture?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          planner_id: string
          name: string
          age: number
          email: string
          phone: string
          data: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          planner_id: string
          name: string
          age: number
          email: string
          phone: string
          data?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          planner_id?: string
          name?: string
          age?: number
          email?: string
          phone?: string
          data?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 