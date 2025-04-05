import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Essas variáveis de ambiente devem ser configuradas no seu arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

export type SupabaseClient = typeof supabase; 