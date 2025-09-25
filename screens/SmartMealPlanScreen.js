import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

// Internal prompt storage for future API usage
let aiPromptStorage = {
  prompts: [],
  responses: [],
  currentConversation: [],
  
  addPrompt: function(prompt, response = null) {
    const timestamp = new Date().toISOString()
    const promptData = {
      id: Date.now().toString(),
      prompt,
      response,
      timestamp,
      category: 'meal-planning'
    }
    
    this.prompts.push(promptData)
    this.currentConversation.push(promptData)
    return promptData
  },
  
  clearConversation: function() {
    this.currentConversation = []
  },
  
  getAllPrompts: function() {
    return this.prompts
  },
  
  getConversationContext: function() {
    return this.currentConversation
  }
}

const SmartMealPlanScreen = ({ navigation, userInventory = [] }) => {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [conversation, setConversation] = useState([
    {
      id: 'welcome',
      type: 'ai',
      message: "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef(null)

  // Sample suggestions based on food waste prevention
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
  }, [conversation])

  // Test AI responses (replace with actual API call later)
  const generateTestAIResponse = async (prompt) => {
    setIsLoading(true)
    
    // Store the prompt
    aiPromptStorage.addPrompt(prompt)
    
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
    
    setConversation(prev => [...prev, userMessage])
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
      aiPromptStorage.addPrompt(promptText, aiResponse)
      
      setConversation(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error generating AI response:', error)
      Alert.alert('Error', 'Failed to get AI response. Please try again.')
    }
  }

  const handleSuggestionPress = (suggestion) => {
    setCurrentPrompt(suggestion)
  }

  const clearConversation = () => {
    setConversation([
      {
        id: 'welcome',
        type: 'ai',
        message: "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?",
        timestamp: new Date().toISOString()
      }
    ])
    aiPromptStorage.clearConversation()
  }

  const formatMessage = (message) => {
    // Simple markdown-like formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers for now
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

      {/* Conversation Area */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.conversationArea}
        contentContainerStyle={styles.conversationContent}
        showsVerticalScrollIndicator={false}
      >
        {conversation.map((message) => (
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

      {/* Suggestions (show only if conversation is short) */}
      {conversation.length <= 2 && (
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
    </KeyboardAvoidingView>
  )
}

// Internal styles for the AI screen
const styles = StyleSheet.create({
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

  // Conversation Area
  conversationArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  conversationContent: {
    padding: 16,
    paddingBottom: 20,
  },

  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },

  userMessage: {
    alignSelf: 'flex-end',
  },

  aiMessage: {
    alignSelf: 'flex-start',
  },

  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  messageAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },

  messageTimestamp: {
    fontSize: 11,
    color: '#999',
  },

  messageContent: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  messageLine: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2c3e50',
    marginBottom: 4,
  },

  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2c3e50',
    marginBottom: 4,
    marginLeft: 8,
  },

  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },

  // Suggestions
  suggestionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingLeft: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
  },

  suggestionChip: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4ECDC4',
    maxWidth: 250,
  },

  suggestionText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },

  // Input Area
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  promptInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: 'transparent',
  },

  sendButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    marginLeft: 8,
  },

  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },

  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  inputHelper: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
})

export default SmartMealPlanScreen