import React, { useState, useCallback, useRef } from 'react';
import {View,Text,TextInput,TouchableOpacity,Platform,Alert,ScrollView,Keyboard,Modal,KeyboardAvoidingView,} from 'react-native';
import styles from './styles/loginScreenStyle';
import { useAuth } from '../data/AuthContext'; // Import the auth context

// UserTypeDropdown Component
const UserTypeDropdown = ({ selectedType, onSelect, isOpen, onToggle }) => {
  const userTypes = [
    { value: 'household', label: '🏠 Household', description: 'For families and individuals' },
    { value: 'restaurant', label: '🍽️ Restaurant', description: 'For restaurants and cafes' }
  ];

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={[styles.dropdownButton, isOpen && styles.dropdownButtonActive]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.inputIcon}>
          <Text style={styles.inputIconText}>🏢</Text>
        </View>
        <View style={styles.dropdownContent}>
          <Text style={styles.dropdownSelectedText}>
            {selectedType ? userTypes.find(type => type.value === selectedType)?.label : 'Select Account Type'}
          </Text>
          <Text style={styles.dropdownArrow}>{isOpen ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {userTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.dropdownItem,
                selectedType === type.value && styles.dropdownItemSelected
              ]}
              onPress={() => onSelect(type.value)}
              activeOpacity={0.8}
            >
              <View style={styles.dropdownItemContent}>
                <Text style={[
                  styles.dropdownItemLabel,
                  selectedType === type.value && styles.dropdownItemLabelSelected
                ]}>
                  {type.label}
                </Text>
                <Text style={[
                  styles.dropdownItemDescription,
                  selectedType === type.value && styles.dropdownItemDescriptionSelected
                ]}>
                  {type.description}
                </Text>
              </View>
              {selectedType === type.value && (
                <Text style={styles.dropdownCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// SignUpModal Component
const SignUpModal = ({ visible, onClose, onSignUp, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    userType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUserTypeSelect = (userType) => {
    handleInputChange('userType', userType);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = () => {
    if (!formData.userType) {
      Alert.alert('Error', 'Please select an account type');
      return;
    }
    onSignUp(formData);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      userType: '',
    });
    setShowPassword(false);
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <View style={styles.modalContentWrapper}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingContainer}
            keyboardVerticalOffset={0}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Join EcoBite! 🌱</Text>
                <Text style={styles.modalSubtitle}>Start your eco-friendly journey</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalForm}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.formContent}
              >
                {/* Name Row */}
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <Text style={styles.inputIconText}>👤</Text>
                      </View>
                      <TextInput
                        ref={firstNameRef}
                        style={styles.textInput}
                        placeholder="First Name"
                        placeholderTextColor="#999"
                        value={formData.firstName}
                        onChangeText={(text) => handleInputChange('firstName', text)}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => lastNameRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <Text style={styles.inputIconText}>👤</Text>
                      </View>
                      <TextInput
                        ref={lastNameRef}
                        style={styles.textInput}
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                        value={formData.lastName}
                        onChangeText={(text) => handleInputChange('lastName', text)}
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>📧</Text>
                    </View>
                    <TextInput
                      ref={emailRef}
                      style={styles.textInput}
                      placeholder="Email Address"
                      placeholderTextColor="#999"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      returnKeyType="next"
                      onSubmitEditing={() => usernameRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                {/* Username */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>🏷️</Text>
                    </View>
                    <TextInput
                      ref={usernameRef}
                      style={styles.textInput}
                      placeholder="Username"
                      placeholderTextColor="#999"
                      value={formData.username}
                      onChangeText={(text) => handleInputChange('username', text)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>🔒</Text>
                    </View>
                    <TextInput
                      ref={passwordRef}
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={() => !isDropdownOpen && toggleDropdown()}
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.eyeIcon}>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* User Type Dropdown */}
                <View style={styles.inputContainer}>
                  <UserTypeDropdown
                    selectedType={formData.userType}
                    onSelect={handleUserTypeSelect}
                    isOpen={isDropdownOpen}
                    onToggle={toggleDropdown}
                  />
                </View>

                {/* Account Type Info */}
                {formData.userType && (
                  <View style={styles.accountTypeInfo}>
                    <Text style={styles.accountTypeTitle}>
                      {formData.userType === 'household' ? '🏠 Household Account' : '🍽️ Restaurant Account'}
                    </Text>
                    <Text style={styles.accountTypeDescription}>
                      {formData.userType === 'household' 
                        ? 'Perfect for families looking to reduce food waste at home. Track expiry dates, get recipe suggestions, and save money!'
                        : 'Ideal for restaurants and cafes. Manage inventory, track food waste, optimize ordering, and boost your sustainability efforts!'
                      }
                    </Text>
                  </View>
                )}

                {/* Sign Up Button */}
                <TouchableOpacity 
                  style={[styles.signUpButton, isLoading && styles.signUpButtonLoading]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.spinner} />
                      <Text style={styles.signUpButtonText}>Creating Account...</Text>
                    </View>
                  ) : (
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                {/* Terms */}
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get auth functions from context
  const { login, register } = useAuth();
  
  // Sign up modal states
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Updated login handler using auth context
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // Use context login function - it handles everything
      const userData = await login(username.trim(), password);
      
      console.log('Login successful:', userData);
      // Navigation will be handled by App.js based on isAuthenticated
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.message === 'User not found') {
        errorMessage = 'Username not found. Please check your username or sign up.';
      } else if (error.message === 'Invalid password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated sign up handler using auth context
  const handleSignUp = useCallback(async (formData) => {
    const { firstName, lastName, email, username: signUpUsername, password: signUpPassword, userType } = formData;
    
    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !signUpUsername.trim() || !signUpPassword.trim() || !userType) {
      Alert.alert('Error', 'Please fill in all fields and select an account type');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (signUpPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsSignUpLoading(true);

    try {
      // Use context register function
      const userData = await register(
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        signUpUsername.trim().toLowerCase(),
        signUpPassword,
        userType
      );

      console.log('Registration successful:', userData);
      
      setIsSignUpLoading(false);
      
      const accountTypeText = userType === 'household' ? 'Household' : 'Restaurant';
      Alert.alert(
        'Registration Successful! 🎉',
        `Your ${accountTypeText} account has been created successfully! Welcome to EcoBite, ${firstName}! You can now sign in with your credentials.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowSignUpModal(false);
              setUsername(signUpUsername.trim().toLowerCase());
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Registration error:', error);
      setIsSignUpLoading(false);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message === 'Email already registered') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.message === 'Username already taken') {
        errorMessage = 'This username is already taken. Please choose a different username.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    }
  }, [register]);

  const openSignUpModal = useCallback(() => {
    setShowSignUpModal(true);
  }, []);

  const closeSignUpModal = useCallback(() => {
    setShowSignUpModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
      >
        {/* Background Gradient Overlay */}
        <View style={styles.backgroundOverlay} />
        
        {/* Floating Elements */}
        <View style={styles.floatingElement1} />
        <View style={styles.floatingElement2} />
        <View style={styles.floatingElement3} />

        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* Logo Placeholder */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🌱</Text>
            </View>
          </View>
          
          <Text style={styles.appName}>EcoBite</Text>
          <Text style={styles.tagline}>Fighting Food Waste Together</Text>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>45K</Text>
              <Text style={styles.statLabel}>Food Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12M</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8.5K</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue your eco journey</Text>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.inputIconText}>👤</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.inputIconText}>🔒</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Mode:</Text>
              <Text style={styles.demoText}>Create an account or use existing credentials</Text>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.spinner} />
                  <Text style={styles.loginButtonText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🎎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📧</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={openSignUpModal}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Decoration */}
        <View style={styles.bottomDecoration}>
          <Text style={styles.bottomText}>🌍 Save Food • Save Planet • Save Money</Text>
        </View>
      </ScrollView>

      {/* Sign Up Modal */}
      <SignUpModal 
        visible={showSignUpModal}
        onClose={closeSignUpModal}
        onSignUp={handleSignUp}
        isLoading={isSignUpLoading}
      />
    </View>
  );
};

export default LoginScreen;