// supabase.js - Updated with user context support
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Set user context for RLS policies
 * Call this before any database operations
 * @param {number} userId - Current user's ID
 */
export const setUserContext = async (userId) => {
  if (!userId) {
    console.warn('setUserContext called with no userId');
    return;
  }

  try {
    // Set the user_id in Postgres session
    await supabase.rpc('set_user_context', { user_id: userId });
    console.log('User context set for user:', userId);
  } catch (error) {
    console.error('Error setting user context:', error);
  }
}

/**
 * Helper to execute queries with user context
 * @param {number} userId - Current user's ID
 * @param {Function} queryFn - Function that returns a Supabase query
 */
export const withUserContext = async (userId, queryFn) => {
  await setUserContext(userId);
  return await queryFn();
}