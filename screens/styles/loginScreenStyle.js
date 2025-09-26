import { StyleSheet } from 'react-native';
import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ECC71',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ECC71',
  },
  
  // Floating Elements
  floatingElement1: {
    position: 'absolute',
    top: 100,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingElement2: {
    position: 'absolute',
    top: 200,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  floatingElement3: {
    position: 'absolute',
    top: 150,
    left: width * 0.7,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 60 : 60,
    paddingBottom: 40,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Form Section
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    zIndex: 3,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  // Input Styles
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputIconText: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 15,
  },
  eyeButton: {
    padding: 5,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // Demo Credentials
  demoContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ECC71',
    marginBottom: 5,
  },
  demoText: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'monospace',
  },

  // Button Styles
  loginButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 15,
    paddingVertical: 18,
    marginBottom: 15,
    shadowColor: '#2ECC71',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonLoading: {
    backgroundColor: '#95D5B2',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    marginRight: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '500',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },

  // Social Login
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // Sign Up
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '600',
  },

  // Bottom Decoration
  bottomDecoration: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Updated Modal Styles - Now 90% of screen
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  modalContentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  keyboardAvoidingContainer: {
    flexShrink: 1,
    maxHeight: height * 0.95,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.90, // Updated to 90%
    minHeight: height * 0.85, // Updated to 85% minimum
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    padding: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    right: 25,
    top: 25,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
    paddingHorizontal: 25,
  },
  formContent: {
    paddingBottom: 25,
    flexGrow: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },

  // Dropdown Styles
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 60,
  },
  dropdownButtonActive: {
    borderColor: '#2ECC71',
    backgroundColor: '#F0FFF4',
  },
  dropdownContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1001,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemSelected: {
    backgroundColor: '#F0FFF4',
  },
  dropdownItemContent: {
    flex: 1,
  },
  dropdownItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dropdownItemLabelSelected: {
    color: '#2ECC71',
  },
  dropdownItemDescription: {
    fontSize: 13,
    color: '#666',
  },
  dropdownItemDescriptionSelected: {
    color: '#27AE60',
  },
  dropdownCheckmark: {
    fontSize: 16,
    color: '#2ECC71',
    fontWeight: '700',
    marginLeft: 10,
  },

  // Account Type Info
  accountTypeInfo: {
    backgroundColor: '#F0FFF4',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ECC71',
    marginBottom: 8,
  },
  accountTypeDescription: {
    fontSize: 14,
    color: '#27AE60',
    lineHeight: 20,
  },

  signUpButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 15,
    paddingVertical: 18,
    marginTop: 15,
    marginBottom: 20,
    shadowColor: '#2ECC71',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  signUpButtonLoading: {
    backgroundColor: '#95D5B2',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  termsLink: {
    color: '#2ECC71',
    fontWeight: '600',
  },
});

export default styles;