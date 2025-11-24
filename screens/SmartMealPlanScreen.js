import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import styles from './styles/SmartMealPlanScreenStyles';
import { useAuth } from '../data/AuthContext';
import { supabase } from '../data/supabase';
import { sendWebhook, getConversationHistory } from '../data/ai_webhook';

const SmartMealPlanScreen = ({ navigation, userInventory = [] }) => {
  const { getUserId, getUsername, getUserType } = useAuth();
  
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
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
    
    if (userId) {
      loadUserConversations();
    }
  }, []);

  // 1. Load the list of "Folders" (Conversations) from Supabase
  const loadUserConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const userId = getUserId();

      // Only fetch the container info, not the messages
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

      // Initialize tabs. 'loaded' flag tells us if we've fetched API history yet.
      const tabs = conversations.map(conv => ({
        id: conv.conversation_id,
        title: conv.title,
        messages: [], 
        createdAt: conv.created_at,
        loaded: false 
      }));

      setConversationTabs(tabs);
      
      if (tabs.length > 0) {
        setActiveTabId(tabs[0].id);
      }

      console.log(`Loaded ${tabs.length} conversations (Index only)`);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversations. Creating a new one.');
      await createDefaultConversation();
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // 2. Watch for Tab Changes -> Fetch History from Agent API
  useEffect(() => {
    if (activeTabId) {
      const tab = conversationTabs.find(t => t.id === activeTabId);
      if (tab && !tab.loaded) {
        loadHistoryForTab(activeTabId);
      }
    }
  }, [activeTabId]);

  const loadHistoryForTab = async (threadId) => {
    setIsLoadingHistory(true);
    try {
        console.log(`Fetching history for thread: ${threadId}`);
        // Call your Python API to get history from checkpoints
        const history = await getConversationHistory(threadId);
        
        setConversationTabs(prev => prev.map(tab => {
            if (tab.id === threadId) {
                return {
                    ...tab,
                    // If API returns empty (new chat), keep empty array or default
                    messages: history.length > 0 ? history : tab.messages,
                    loaded: true
                };
            }
            return tab;
        }));
    } catch (error) {
        console.error("Failed to load history", error);
    } finally {
        setIsLoadingHistory(false);
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

      // We don't save to 'messages' table anymore. 
      // We just update local state so the user sees the welcome immediately.
      const newTab = {
        id: conversationId,
        title: 'General Chat',
        messages: [{
          id: `welcome_${Date.now()}`,
          type: 'ai',
          message: welcomeMessage,
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString(),
        loaded: true // Marked true so we don't try to fetch empty history
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
    // Safety check 1: Ensure ref exists before setting timeout
    if (scrollViewRef.current) {
        setTimeout(() => {
            // Safety check 2: Ensure ref STILL exists when timeout fires (using ?.)
            scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 100);
    }
  }, [activeConversation?.messages, isLoading, isLoadingHistory])


  const handleSendPrompt = async () => {
    if (!currentPrompt.trim()) return
    
    const promptText = currentPrompt.trim()
    
    // 1. Optimistic UI Update (Show user message immediately)
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: promptText,
      timestamp: new Date().toISOString()
    }
    
    setConversationTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, messages: [...tab.messages, userMessage] }
        : tab
    ))
    
    setCurrentPrompt('')
    
    // Note: We REMOVED saveMessageToDatabase(activeTabId, 'user', promptText);
    // The Python Agent will save it to 'checkpoints' automatically.

    try {
      setIsLoading(true);
      
      // 2. Call API
      const aiResponse = await sendWebhook(activeTabId.toString(), promptText);
      
      // 3. Update UI with AI Response
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

      // Optional: Update 'updated_at' in Supabase Conversations for sorting
      await supabase
        .from('Conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('conversation_id', activeTabId);

    } catch (error) {
      console.error('Error generating AI response:', error)
      Alert.alert('Error', 'Failed to get AI response. Please try again.')
    } finally {
        setIsLoading(false);
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
      const welcomeMessage = "Hi! How can I help you with this new topic?";

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

      // Update Local State Only
      const newTab = {
        id: conversationId,
        title: newTabTitle.trim(),
        messages: [{
          id: `welcome_${Date.now()}`,
          type: 'ai',
          message: welcomeMessage,
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString(),
        loaded: true
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
              // We only delete the Index from Supabase. 
              // The checkpoints in Agent memory remain but become inaccessible (orphaned), which is fine.
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
      'This will start a fresh history for this topic. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Strategy: To "Clear" memory in LangGraph without a complex API call,
              // we delete the current Conversation ID and make a NEW one with the same title.
              // This gives us a fresh 'thread_id' for the Agent.
              
              const currentTab = conversationTabs.find(t => t.id === activeTabId);
              if (!currentTab) return;

              const userId = getUserId();
              const oldId = activeTabId;
              const title = currentTab.title;
              const welcomeMessage = "Conversation cleared. What would you like to know?";

              // 1. Delete Old Index
              await supabase.from('Conversations').delete().eq('conversation_id', oldId);

              // 2. Create New Index (Same Title)
              const { data: newConv, error } = await supabase
                .from('Conversations')
                .insert({
                    user_id: userId,
                    title: title,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

              if (error) throw error;

              // 3. Replace in UI
              const newTab = {
                  id: newConv.conversation_id,
                  title: title,
                  messages: [{
                    id: `welcome_${Date.now()}`,
                    type: 'ai',
                    message: welcomeMessage,
                    timestamp: new Date().toISOString()
                  }],
                  createdAt: new Date().toISOString(),
                  loaded: true
              };

              setConversationTabs(prev => prev.map(t => t.id === oldId ? newTab : t));
              setActiveTabId(newConv.conversation_id);

              console.log('Conversation cleared (Re-created with new ID):', newConv.conversation_id);
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
    if (!message) return null;
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
              {/* Only show badge if we have messages loaded and more than just the welcome */}
              {tab.loaded && tab.messages.length > 1 && (
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
        {/* Show specific loading indicator when fetching history for a tab */}
        {isLoadingHistory ? (
             <View style={{padding: 20, alignItems: 'center'}}>
                 <ActivityIndicator size="small" color="#4ECDC4" />
                 <Text style={{color: '#999', marginTop: 10}}>Loading history...</Text>
             </View>
        ) : (
            activeConversation?.messages.map((message, index) => (
            <View 
                key={message.id || index} 
                style={[
                styles.messageContainer, 
                message.type === 'user' ? styles.userMessage : styles.aiMessage
                ]}
            >
                <View style={styles.messageHeader}>
                <Text style={styles.messageAuthor}>
                    {message.type === 'user' ? 'You' : 'EcoBite AI'}
                </Text>
                {message.timestamp && (
                    <Text style={styles.messageTimestamp}>
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                )}
                </View>
                <View style={styles.messageContent}>
                {formatMessage(message.message)}
                </View>
            </View>
            ))
        )}
        
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

      {/* Show suggestions only if we have very few messages */}
      {(!isLoadingHistory && activeConversation?.messages.length <= 1) && (
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