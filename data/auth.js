// auth.js
import { supabase } from './supabase'

export async function checkUserExists(email, username) {
  const { data, error } = await supabase
    .from('users')
    .select('email, username')
    .or(`email.eq.${email},username.eq.${username}`)
    .limit(1)

  if (error) throw error

  if (data.length > 0) {
    if (data[0].email === email) throw new Error("Email already registered")
    if (data[0].username === username) throw new Error("Username already taken")
  }
  return false
}

export async function registerUser(firstName, lastName, email, username, password, userType) {
  await checkUserExists(email, username)

  if (!['household', 'restaurant'].includes(userType)) {
    throw new Error("User type must be either 'household' or 'restaurant'")
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password,  // ⚠️ plaintext for now
      user_plan: 'free',
      user_type: userType,
      created_at: new Date()
    }])
    .select('user_id, username, email, user_plan, user_type')
    .single()

  if (error) throw error
  return data
}

export async function login(username, password) {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, username, password, user_plan, user_type')
    .eq('username', username)
    .single()

  if (error) throw new Error("User not found")
  if (data.password !== password) throw new Error("Invalid password")

  return {
    user_id: data.user_id,
    username: data.username,
    user_plan: data.user_plan,
    user_type: data.user_type
  }
}
