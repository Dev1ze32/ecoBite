// auth.js
import { supabase } from './supabase'

// ============================
// CHECK IF USER EXISTS (by username only, email is handled by Supabase Auth)
// ============================
export async function checkUsernameExists(username) {
  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error
  }

  return !!data // Returns true if username exists
}

// ============================
// REGISTER USER
// ============================
export async function registerUser(firstName, lastName, email, username, password, userType) {
  try {
    // 1️⃣ Validate user type
    if (!['household', 'restaurant'].includes(userType.toLowerCase())) {
      throw new Error("User type must be either 'household' or 'restaurant'")
    }

    // 2️⃣ Check if username already exists
    const usernameExists = await checkUsernameExists(username)
    if (usernameExists) {
      throw new Error("Username already taken")
    }

    // 3️⃣ Create Supabase Auth user (this handles email uniqueness and password hashing)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name: firstName,
          last_name: lastName,
          user_type: userType.toLowerCase()
        }
      }
    })

    if (authError) {
      // Handle specific Supabase Auth errors
      if (authError.message.includes('already registered')) {
        throw new Error("Email already registered")
      }
      throw authError
    }

    const auth_uuid = authData.user?.id
    if (!auth_uuid) {
      throw new Error("Failed to create authentication account")
    }

    // 4️⃣ Insert into your custom users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        auth_uuid,
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        user_plan: 'free',
        user_type: userType.toLowerCase(),
        created_at: new Date().toISOString()
      }])
      .select('user_id, auth_uuid, username, email, user_plan, user_type, first_name, last_name')
      .single()

    if (profileError) {
      // If profile creation fails, we should ideally delete the auth user
      // For now, log the error
      console.error("Profile creation failed:", profileError)
      throw new Error(`Failed to create user profile: ${profileError.message}`)
    }

    return {
      success: true,
      user: profileData,
      session: authData.session,
      requiresEmailVerification: !authData.session
    }

  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================
// LOGIN USER
// ============================
export async function login(usernameOrEmail, password) {
  try {
    console.log('🔍 Login attempt:', { usernameOrEmail, passwordLength: password?.length });
    
    let email = usernameOrEmail

    // 1️⃣ If username provided (no @ symbol), look up email
    if (!usernameOrEmail.includes('@')) {
      console.log('📧 Looking up email for username:', usernameOrEmail);
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', usernameOrEmail)
        .single()

      console.log('📧 Username lookup result:', { userData, userError });

      if (userError || !userData) {
        throw new Error('Username not found')
      }

      email = userData.email
      console.log('✅ Found email:', email);
    }

    // 2️⃣ Sign in with Supabase Auth
    console.log('🔐 Attempting Supabase login with email:', email);
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('🔐 Supabase auth result:', { 
      success: !!authData.user, 
      error: authError?.message 
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Invalid username/email or password')
      }
      if (authError.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address before logging in')
      }
      throw authError
    }

    // 3️⃣ Fetch user profile
    console.log('👤 Fetching user profile for:', authData.user.id);
    
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('user_id, auth_uuid, username, email, user_plan, user_type, first_name, last_name')
      .eq('auth_uuid', authData.user.id)
      .single()

    console.log('👤 Profile data:', { profileData, profileError });

    if (profileError) {
      throw new Error('Failed to load user profile')
    }

    console.log('✅ Login successful:', profileData);

    return {
      success: true,
      user: profileData,
      session: authData.session
    }

  } catch (error) {
    console.error("❌ Login error:", error);
    return {
      success: false,
      error: error.message
    }
  }
}

// ============================
// LOGOUT USER
// ============================
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: error.message }
  }
}

// ============================
// GET CURRENT USER
// ============================
export async function getCurrentUser() {
  try {
    // 1️⃣ Get current auth session
    const { data: { user }, error: sessionError } = await supabase.auth.getUser()

    if (sessionError || !user) {
      return { success: false, user: null }
    }

    // 2️⃣ Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('user_id, auth_uuid, username, email, user_plan, user_type, first_name, last_name')
      .eq('auth_uuid', user.id)
      .single()

    if (profileError) {
      throw new Error('Failed to load user profile')
    }

    return {
      success: true,
      user: profileData
    }

  } catch (error) {
    console.error("Get current user error:", error)
    return { success: false, error: error.message }
  }
}

// ============================
// CHECK IF USER IS LOGGED IN
// ============================
export async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// ============================
// UPDATE USER PROFILE
// ============================
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return { success: true, user: data }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: error.message }
  }
}

// ============================
// CHANGE PASSWORD
// ============================
export async function changePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, error: error.message }
  }
}

// ============================
// RESET PASSWORD (Send reset email)
// ============================
export async function sendPasswordResetEmail(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'yourapp://reset-password' // Deep link for mobile app
    })

    if (error) throw error

    return { success: true, message: 'Password reset email sent' }
  } catch (error) {
    console.error("Password reset error:", error)
    return { success: false, error: error.message }
  }
}