// smart meal plan screen styles
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Header Styles
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  
  aiHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },

  backButton: {
    padding: 8,
  },

  backButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '500',
  },

  clearButton: {
    padding: 8,
  },

  clearButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },

  // Tabs Styles
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabsScrollView: {
    maxHeight: 50,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  messageBadge: {
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  messageBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  newTabButtonText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },

  // Conversation Area Styles
  conversationArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  conversationContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  messageAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#999',
  },
  messageContent: {
    flexDirection: 'column',
  },
  messageLine: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Suggestions Styles
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  suggestionsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  suggestionChip: {
    backgroundColor: '#F0F9F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  suggestionText: {
    fontSize: 13,
    color: '#4ECDC4',
    fontWeight: '500',
  },

  // Input Area Styles
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  promptInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 8,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0E0DD',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputHelper: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: width - 64,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalCreateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});