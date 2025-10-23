// supabaseNode.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!')
  throw new Error('Missing Supabase environment variables')
}

// Service role client bypasses RLS
export const supabase = createClient(supabaseUrl, supabaseServiceKey)