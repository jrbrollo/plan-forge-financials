
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Use hardcoded values instead of environment variables for reliability
const supabaseUrl = "https://tolixnstpgukaktedhqj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbGl4bnN0cGd1a2FrdGVkaHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4Nzc2OTQsImV4cCI6MjA1OTQ1MzY5NH0.9Z7jZVlRvT038WOmRjNrKmuzu0Vy3FmOz6UV0XXh5wU"

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

export type SupabaseClient = typeof supabase;
