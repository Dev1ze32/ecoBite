// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginAPI, registerUser as registerAPI } from './auth';

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
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_ID,
        userData.user_id.toString()
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.USERNAME,
        userData.username
      );
      console.log('User session saved:', userData);
    } catch (error) {
      console.error('Error saving user session:', error);
      throw error;
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
  const login = async (username, password) => {
    try {
      // Call your API
      const userData = await loginAPI(username, password);
      
      // Save to state and storage
      setUser(userData);
      setIsAuthenticated(true);
      await saveUserSession(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  // Register function
  const register = async (firstName, lastName, email, username, password, userType) => {
    try {
      // Call your API
      const userData = await registerAPI(firstName, lastName, email, username, password, userType);
      
      // Don't auto-login after registration, let user login manually
      // But you could auto-login if you want:
      // setUser(userData);
      // setIsAuthenticated(true);
      // await saveUserSession(userData);
      
      return userData;
    } catch (error) {
      console.error('Registration error in context:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      await clearUserSession();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user data
  const updateUser = async (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      await saveUserSession(newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Helper Getters
  const getUserId = () => user?.user_id ?? null;
  const getUsername = () => user?.username ?? null;
  const getUserType = () => user?.user_type ?? null;
  const getUserPlan = () => user?.user_plan ?? null;

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