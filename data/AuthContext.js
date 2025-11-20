// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginAPI, registerUser as registerAPI, getCurrentUser } from './auth';

// Create the context
const AuthContext = createContext({});

// Storage keys
const STORAGE_KEYS = {
  USER_SESSION: '@ecobite_user_session',
  USER_ID: '@ecobite_user_id',
  USERNAME: '@ecobite_username',
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user session on app start
  useEffect(() => {
    loadUserSession();
  }, []);

  // Load stored user session
  const loadUserSession = async () => {
    try {
      const userSession = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      
      if (userSession) {
        const userData = JSON.parse(userSession);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User session loaded:', userData);

        // Optionally verify session is still valid with Supabase
        try {
          const result = await getCurrentUser();
          if (result.success && result.user) {
            // Update with fresh data from server
            setUser(result.user);
            await saveUserSession(result.user);
          } else {
            // Session invalid, clear it
            await clearUserSession();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.log('Could not verify session, using cached data');
        }
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save user session to storage
  const saveUserSession = async (userData) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_SESSION,
        JSON.stringify(userData)
      );
      
      // Handle both user_id and auth_uuid (fallback)
      const userId = userData.user_id || userData.auth_uuid;
      if (userId) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_ID,
          userId.toString()
        );
      }
      
      if (userData.username) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USERNAME,
          userData.username
        );
      }
      
      console.log('User session saved:', userData);
    } catch (error) {
      console.error('Error saving user session:', error);
      // Don't throw - we can continue without local storage
    }
  };

  // Clear user session from storage
  const clearUserSession = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_SESSION,
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USERNAME,
      ]);
      console.log('User session cleared');
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  };

  // Login function
  const login = async (usernameOrEmail, password) => {
    try {
      setIsLoading(true);

      // Call your API - now returns { success, user, session, error }
      const result = await loginAPI(usernameOrEmail, password);
      
      // Check if login was successful
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      const userData = result.user;
      
      // Save to state and storage
      setUser(userData);
      setIsAuthenticated(true);
      await saveUserSession(userData);
      
      console.log('Login successful:', userData);
      return userData;
      
    } catch (error) {
      console.error('Login error in context:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (firstName, lastName, email, username, password, userType) => {
    try {
      setIsLoading(true);

      // Call your API - now returns { success, user, session, requiresEmailVerification, error }
      const result = await registerAPI(firstName, lastName, email, username, password, userType);
      
      // Check if registration was successful
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      const userData = result.user;
      
      // If email verification is NOT required, auto-login
      if (!result.requiresEmailVerification) {
        setUser(userData);
        setIsAuthenticated(true);
        await saveUserSession(userData);
        console.log('Auto-login after registration:', userData);
      } else {
        console.log('Registration successful, email verification required');
      }
      
      return userData;
      
    } catch (error) {
      console.error('Registration error in context:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Could call Supabase logout here too
      // await supabase.auth.signOut();
      
      setUser(null);
      setIsAuthenticated(false);
      await clearUserSession();
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if remote logout fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = async (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      await saveUserSession(newUserData);
      console.log('User data updated:', newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Helper Getters with safe fallbacks
  const getUserId = () => user?.user_id || user?.auth_uuid || null;
  const getUsername = () => user?.username || user?.first_name || 'User';
  const getUserType = () => user?.user_type || 'household';
  const getUserPlan = () => user?.user_plan || 'free';
  const getUserEmail = () => user?.email || null;
  const getFirstName = () => user?.first_name || null;
  const getLastName = () => user?.last_name || null;
  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'User';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    getUserId,
    getUsername,
    getUserType,
    getUserPlan,
    getUserEmail,
    getFirstName,
    getLastName,
    getFullName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export storage keys for direct access if needed
export { STORAGE_KEYS };