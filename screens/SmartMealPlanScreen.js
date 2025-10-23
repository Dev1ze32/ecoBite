import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import styles from './styles/SmartMealPlanScreenStyles';

// Internal prompt storage for future API usage
let aiPromptStorage = {
  conversations: {}, // Store multiple conversations by ID
  
  addPrompt: function(conversationId, prompt, response = null) {
    if (!this.conversations[conversationId]) {
      this.conversations[conversationId] = []
    }
    
    const timestamp = new Date().toISOString()
    const promptData = {
      id: Date.now().toString(),
      prompt,
      response,
      timestamp,
      category: 'meal-planning'
    }
    
    this.conversations[conversationId].push(promptData)
    return promptData
  },
  
  getConversation: function(conversationId) {
    return this.conversations[conversationId] || []
  },
  
  deleteConversation: function(conversationId) {
    delete this.conversations[conversationId]
  },
  
  getAllConversations: function() {
    return this.conversations
  }
}

const SmartMealPlanScreen = ({ navigation, userInventory = [] }) => {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef(null)
  
  // Conversation tabs management
  const [conversationTabs, setConversationTabs] = useState([
    {
      id: 'conv_1',
      title: 'General Chat',
      messages: [
        {
          id: 'welcome',
          type: 'ai',
          message: "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?",
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }
  ])
  const [activeTabId, setActiveTabId] = useState('conv_1')
  const [showNewTabModal, setShowNewTabModal] = useState(false)
  const [newTabTitle, setNewTabTitle] = useState('')

  // Get current active conversation
  const activeConversation = conversationTabs.find(tab => tab.id === activeTabId)

  // Sample suggestions
  const suggestions = [
    "Create a meal plan using my expiring ingredients",
    "What recipes can I make with leftover vegetables?",
    "How to properly store fresh produce to last longer",
    "Suggest portions for a family of 4 to avoid waste"
  ]

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [activeConversation?.messages])

  // Test AI responses
  const generateTestAIResponse = async (prompt) => {
    setIsLoading(true)
    
    // Store the prompt
    aiPromptStorage.addPrompt(activeTabId, prompt)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock AI responses based on prompt content
    let response = ''
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('recipe') || lowerPrompt.includes('cook')) {
      response = "Here are some recipe suggestions based on reducing food waste:\n\n• **Veggie Scrap Broth**: Use vegetable peels and scraps to make a nutritious broth\n• **Leftover Stir-fry**: Combine any vegetables nearing expiration with rice or noodles\n• **Smoothie Bowl**: Blend overripe fruits with yogurt for a healthy breakfast\n\nWould you like detailed instructions for any of these recipes?"
    } else if (lowerPrompt.includes('meal plan')) {
      response = "I'd be happy to create a meal plan for you! To give you the best suggestions:\n\n• What ingredients do you currently have?\n• How many people are you cooking for?\n• Any dietary restrictions?\n• Which items are expiring soon?\n\nThis will help me create a plan that minimizes waste and maximizes nutrition."
    } else if (lowerPrompt.includes('store') || lowerPrompt.includes('preserve')) {
      response = "Great question about food storage! Here are key tips to extend freshness:\n\n• **Herbs**: Store like flowers in water, cover with plastic\n• **Leafy Greens**: Wrap in damp paper towel, keep in fridge\n• **Bananas**: Keep separate from other fruits\n• **Bread**: Store in cool, dry place or freeze\n\nProper storage can extend food life by 3-7 days on average!"
    } else if (lowerPrompt.includes('portion') || lowerPrompt.includes('family')) {
      response = "Smart question about portions! Here's a guide to reduce waste:\n\n• **Rice/Pasta**: 1/4 cup dry per person\n• **Vegetables**: 1/2 cup cooked per person\n• **Protein**: 3-4 oz per person\n• **Fruits**: 1/2 cup fresh per person\n\nTip: Start with smaller portions and offer seconds rather than over-serving initially!"
    } else {
      response = `I understand you're asking about "${prompt}". As your EcoBite assistant, I'm here to help with meal planning, recipes, food storage, and waste reduction. Could you provide more details about what specific help you need with your food management?`
    }
    
    setIsLoading(false)
    return response
  }

  const handleSendPrompt = async () => {
    if (!currentPrompt.trim()) return
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentPrompt.trim(),
      timestamp: new Date().toISOString()
    }
    
    // Update the active conversation with the user message
    setConversationTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, messages: [...tab.messages, userMessage] }
        : tab
    ))
    
    const promptText = currentPrompt.trim()
    setCurrentPrompt('')
    
    try {
      const aiResponse = await generateTestAIResponse(promptText)
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date().toISOString()
      }
      
      // Store the complete interaction
      aiPromptStorage.addPrompt(activeTabId, promptText, aiResponse)
      
      // Update the active conversation with AI response
      setConversationTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, messages: [...tab.messages, aiMessage] }
          : tab
      ))
    } catch (error) {
      console.error('Error generating AI response:', error)
      Alert.alert('Error', 'Failed to get AI response. Please try again.')
    }
  }

  const handleSuggestionPress = (suggestion) => {
    setCurrentPrompt(suggestion)
  }

  const createNewTab = () => {
    if (!newTabTitle.trim()) {
      Alert.alert('Error', 'Please enter a conversation title')
      return
    }

    const newTab = {
      id: `conv_${Date.now()}`,
      title: newTabTitle.trim(),
      messages: [
        {
          id: `welcome_${Date.now()}`,
          type: 'ai',
          message: "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?",
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }

    setConversationTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
    setNewTabTitle('')
    setShowNewTabModal(false)
  }

  const deleteTab = (tabId) => {
    if (conversationTabs.length === 1) {
      Alert.alert('Error', 'You must have at least one conversation')
      return
    }

    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setConversationTabs(prev => prev.filter(tab => tab.id !== tabId))
            aiPromptStorage.deleteConversation(tabId)
            
            // Switch to another tab if deleting active tab
            if (tabId === activeTabId) {
              const remainingTabs = conversationTabs.filter(tab => tab.id !== tabId)
              setActiveTabId(remainingTabs[0].id)
            }
          }
        }
      ]
    )
  }

  const clearConversation = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setConversationTabs(prev => prev.map(tab => 
              tab.id === activeTabId 
                ? {
                    ...tab,
                    messages: [
                      {
                        id: `welcome_${Date.now()}`,
                        type: 'ai',
                        message: "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?",
                        timestamp: new Date().toISOString()
                      }
                    ]
                  }
                : tab
            ))
            aiPromptStorage.deleteConversation(activeTabId)
          }
        }
      ]
    )
  }

  const formatMessage = (message) => {
    return message
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .split('\n')
      .map((line, index) => (
        <Text key={index} style={line.startsWith('•') ? styles.bulletPoint : styles.messageLine}>
          {line}
        </Text>
      ))
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.aiHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.aiHeaderTitle}>EcoBite AI Assistant</Text>
        <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Conversation Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollView}
        >
          {conversationTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                tab.id === activeTabId && styles.activeTab
              ]}
              onPress={() => setActiveTabId(tab.id)}
              onLongPress={() => deleteTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                tab.id === activeTabId && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
              {tab.messages.length > 1 && (
                <View style={styles.messageBadge}>
                  <Text style={styles.messageBadgeText}>
                    {tab.messages.length - 1}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          {/* New Tab Button */}
          <TouchableOpacity
            style={styles.newTabButton}
            onPress={() => setShowNewTabModal(true)}
          >
            <Text style={styles.newTabButtonText}>+ New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conversation Area */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.conversationArea}
        contentContainerStyle={styles.conversationContent}
        showsVerticalScrollIndicator={false}
      >
        {activeConversation?.messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageContainer, 
              message.type === 'user' ? styles.userMessage : styles.aiMessage
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.messageAuthor}>
                {message.type === 'user' ? 'You' : 'EcoBite AI'}
              </Text>
              <Text style={styles.messageTimestamp}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.messageContent}>
              {formatMessage(message.message)}
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageAuthor}>EcoBite AI</Text>
            </View>
            <View style={styles.messageContent}>
              <ActivityIndicator size="small" color="#4ECDC4" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      {activeConversation?.messages.length <= 2 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try asking:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.promptInput}
            value={currentPrompt}
            onChangeText={setCurrentPrompt}
            placeholder="Ask about recipes, meal plans, food storage..."
            multiline
            maxLength={500}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !currentPrompt.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendPrompt}
            disabled={!currentPrompt.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputHelper}>
          {currentPrompt.length}/500 • Ask anything about meal planning and food waste
        </Text>
      </View>

      {/* New Tab Modal */}
      <Modal
        visible={showNewTabModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNewTabModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Conversation</Text>
            <TextInput
              style={styles.modalInput}
              value={newTabTitle}
              onChangeText={setNewTabTitle}
              placeholder="Enter conversation title (e.g., Recipe Ideas)"
              maxLength={30}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowNewTabModal(false)
                  setNewTabTitle('')
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createNewTab}
              >
                <Text style={styles.modalCreateButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default SmartMealPlanScreen