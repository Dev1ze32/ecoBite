// ai_webhook.js - React Native compatible version
// Place this in: data/ai_webhook.js
import 'react-native-url-polyfill/auto'
import Constants from 'expo-constants'

const WEBHOOK_URL = Constants.expoConfig?.extra?.webhookUrl;
const WEBHOOK_KEY = Constants.expoConfig?.extra?.webhookKey;
if (!WEBHOOK_URL || !WEBHOOK_KEY) {
  console.error('Missing Webhook environment variables!');
  throw new Error('Missing Webhook environment variables');
}

/**
 * Send a message to the AI webhook and get a response
 * @param {string} sessionId - Unique session/conversation ID
 * @param {string} message - User's message to the AI
 * @returns {Promise<string>} - AI's response 
 */
export async function sendWebhook(sessionId, message) {
  try {
    console.log('Calling AI webhook with:', { sessionId, message });
    
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "key": WEBHOOK_KEY
      },
      body: JSON.stringify({
        sessionId: sessionId,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Webhook response:', data);
    
    // Return the AI reply from the webhook response
    return data.ai_reply || data.response || data.message || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling webhook:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

/**
 * Save message to Supabase (optional - you're already doing this in SmartMealPlanScreen)
 * @param {number} conversationId - Conversation ID
 * @param {string} sender - 'user' or 'ai'
 * @param {string} content - Message content
 */
export async function saveMessageToSupabase(conversationId, sender, content) {
  // Import supabase here to avoid circular dependencies
  const { supabase } = require('./supabase');
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: sender,
        content: content,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    console.log('Message saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}