import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

export const isSupabaseConfigured = hasSupabaseConfig

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null