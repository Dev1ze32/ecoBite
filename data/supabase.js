// supabase.js
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

// Get values from environment variables via app.config.js
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

// Validate that environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.log('Available extra config:', Constants.expoConfig?.extra)
  throw new Error('Missing Supabase environment variables. Please check your .env file and app.config.js')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)