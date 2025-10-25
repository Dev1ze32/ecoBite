import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import styles from './styles/SmartMealPlanScreenStyles';
import { useAuth } from '../data/AuthContext';
import { supabase } from '../data/supabase';
import { sendWebhook } from '../data/ai_webhook';

const SmartMealPlanScreen = ({ navigation, userInventory = [] }) => {
  const { user, getUserId, getUsername, getUserType } = useAuth();
  
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const scrollViewRef = useRef(null)
  
  const [conversationTabs, setConversationTabs] = useState([])
  const [activeTabId, setActiveTabId] = useState(null)
  const [showNewTabModal, setShowNewTabModal] = useState(false)
  const [newTabTitle, setNewTabTitle] = useState('')

  const activeConversation = conversationTabs.find(tab => tab.id === activeTabId)

  const suggestions = [
    "Create a meal plan using my expiring ingredients",
    "What recipes can I make with leftover vegetables?",
    "How to properly store fresh produce to last longer",
    "Suggest portions for a family of 4 to avoid waste"
  ]

  useEffect(() => {
    const userId = getUserId();
    console.log('SmartMealPlan - Current User ID:', userId);
    console.log('SmartMealPlan - Username:', getUsername());
    console.log('SmartMealPlan - User Type:', getUserType());
    
    if (userId) {
      loadUserConversations();
    }
  }, []);

  const loadUserConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const userId = getUserId();

      const { data: conversations, error: convError } = await supabase
        .from('Conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (convError) throw convError;

      if (!conversations || conversations.length === 0) {
        await createDefaultConversation();
        return;
      }

      const conversationIds = conversations.map(c => c.conversation_id);
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      const messagesByConversation = {};
      messages?.forEach(msg => {
        if (!messagesByConversation[msg.conversation_id]) {
          messagesByConversation[msg.conversation_id] = [];
        }
        messagesByConversation[msg.conversation_id].push({
          id: msg.id.toString(),
          type: msg.sender === 'user' ? 'user' : 'ai',
          message: msg.content,
          timestamp: msg.created_at
        });
      });

      const tabs = conversations.map(conv => ({
        id: conv.conversation_id,
        title: conv.title,
        messages: messagesByConversation[conv.conversation_id] || [],
        createdAt: conv.created_at
      }));

      setConversationTabs(tabs);
      
      if (tabs.length > 0) {
        setActiveTabId(tabs[0].id);
      }

      console.log(`Loaded ${tabs.length} conversations with messages`);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Creating a new one.');
      await createDefaultConversation();
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const createDefaultConversation = async () => {
    try {
      const userId = getUserId();
      const welcomeMessage = "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?";

      const { data: newConversation, error: convError } = await supabase
        .from('Conversations')
        .insert({
          user_id: userId,
          title: 'General Chat',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (convError) throw convError;

      const conversationId = newConversation.conversation_id;

      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender: 'ai',
          content: welcomeMessage,
          created_at: new Date().toISOString()
        });

      if (msgError) throw msgError;

      const newTab = {
        id: conversationId,
        title: 'General Chat',
        messages: [{
          id: `welcome_${Date.now()}`,
          type: 'ai',
          message: welcomeMessage,
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString()
      };

      setConversationTabs([newTab]);
      setActiveTabId(conversationId);
      
      console.log('Default conversation created with ID:', conversationId);
    } catch (error) {
      console.error('Error creating default conversation:', error);
      Alert.alert('Error', `Failed to create conversation: ${error.message}`);
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [activeConversation?.messages])

  // Save message to database
  const saveMessageToDatabase = async (conversationId, sender, content) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender: sender,
          content: content,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('Message saved to database');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Get AI response from webhook
  const generateAIResponse = async (prompt) => {
    setIsLoading(true)
    
    try {
      const sessionId = activeTabId;
      
      console.log('Sending to AI webhook:', { sessionId, prompt });
      
      const aiResponse = await sendWebhook(sessionId.toString(), prompt);
      
      console.log('AI Response received:', aiResponse);
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }
      
      setIsLoading(false);
      return aiResponse;
    } catch (error) {
      console.error('Error calling AI webhook:', error);
      setIsLoading(false);
      return `I apologize, but I'm having trouble processing your request right now. Please try again in a moment.`;
    }
  }

  const handleSendPrompt = async () => {
    if (!currentPrompt.trim()) return
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentPrompt.trim(),
      timestamp: new Date().toISOString()
    }
    
    setConversationTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, messages: [...tab.messages, userMessage] }
        : tab
    ))
    
    const promptText = currentPrompt.trim()
    setCurrentPrompt('')

    await saveMessageToDatabase(activeTabId, 'user', promptText);
    
    try {
      const aiResponse = await generateAIResponse(promptText)
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date().toISOString()
      }
      
      setConversationTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, messages: [...tab.messages, aiMessage] }
          : tab
      ))

      await saveMessageToDatabase(activeTabId, 'ai', aiResponse);

      await supabase
        .from('Conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('conversation_id', activeTabId);

    } catch (error) {
      console.error('Error generating AI response:', error)
      Alert.alert('Error', 'Failed to get AI response. Please try again.')
    }
  }

  const handleSuggestionPress = (suggestion) => {
    setCurrentPrompt(suggestion)
  }

  const createNewTab = async () => {
    if (!newTabTitle.trim()) {
      Alert.alert('Error', 'Please enter a conversation title')
      return
    }

    try {
      const userId = getUserId();
      const welcomeMessage = "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?";

      const { data: newConversation, error: convError } = await supabase
        .from('Conversations')
        .insert({
          user_id: userId,
          title: newTabTitle.trim(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (convError) throw convError;

      const conversationId = newConversation.conversation_id;

      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender: 'ai',
          content: welcomeMessage,
          created_at: new Date().toISOString()
        });

      if (msgError) throw msgError;

      const newTab = {
        id: conversationId,
        title: newTabTitle.trim(),
        messages: [{
          id: `welcome_${Date.now()}`,
          type: 'ai',
          message: welcomeMessage,
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString()
      };

      setConversationTabs(prev => [...prev, newTab]);
      setActiveTabId(conversationId);
      setNewTabTitle('');
      setShowNewTabModal(false);

      console.log('New conversation created with ID:', conversationId);
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Error', 'Failed to create conversation. Please try again.');
    }
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
          onPress: async () => {
            try {
              await supabase
                .from('messages')
                .delete()
                .eq('conversation_id', tabId);

              await supabase
                .from('Conversations')
                .delete()
                .eq('conversation_id', tabId);

              setConversationTabs(prev => prev.filter(tab => tab.id !== tabId));
              
              if (tabId === activeTabId) {
                const remainingTabs = conversationTabs.filter(tab => tab.id !== tabId);
                setActiveTabId(remainingTabs[0].id);
              }

              console.log('Conversation deleted:', tabId);
            } catch (error) {
              console.error('Error deleting conversation:', error);
              Alert.alert('Error', 'Failed to delete conversation');
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
          onPress: async () => {
            try {
              const welcomeMessage = "Hi! I'm your EcoBite AI assistant. I can help you create meal plans, suggest recipes for your surplus food, reduce waste, and answer any food-related questions. What would you like to know?";

              await supabase
                .from('messages')
                .delete()
                .eq('conversation_id', activeTabId);

              await supabase
                .from('messages')
                .insert({
                  conversation_id: activeTabId,
                  sender: 'ai',
                  content: welcomeMessage,
                  created_at: new Date().toISOString()
                });

              setConversationTabs(prev => prev.map(tab => 
                tab.id === activeTabId 
                  ? {
                      ...tab,
                      messages: [{
                        id: `welcome_${Date.now()}`,
                        type: 'ai',
                        message: welcomeMessage,
                        timestamp: new Date().toISOString()
                      }]
                    }
                  : tab
              ));

              console.log('Conversation cleared:', activeTabId);
            } catch (error) {
              console.error('Error clearing conversation:', error);
              Alert.alert('Error', 'Failed to clear conversation');
            }
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

  if (isLoadingConversations) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.aiHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.aiHeaderTitle}>EcoBite AI Assistant</Text>
          <Text style={{ fontSize: 10, color: '#999' }}>
            {getUserType() === 'restaurant' ? '🍽️ Restaurant Mode' : '🏠 Household Mode'}
          </Text>
        </View>
        <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

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
          
          <TouchableOpacity
            style={styles.newTabButton}
            onPress={() => setShowNewTabModal(true)}
          >
            <Text style={styles.newTabButtonText}>+ New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

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

      {activeConversation?.messages.length <= 1 && (
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