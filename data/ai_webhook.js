import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';

// Direct access from .env (Expo managed)
const BASE_URL = Constants.expoConfig?.extra?.webhookUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

if (!BASE_URL) console.error('Missing EXPO_PUBLIC_WEBHOOK_URL in .env file');
if (!API_KEY) console.error('Missing EXPO_PUBLIC_API_KEY in .env file');

/**
 * Send a message to the Python API (POST)
 * @param {string} sessionId - Thread/session identifier
 * @param {string} message - Message content
 * @param {string|number} userId - Supabase user ID
 */
export async function sendWebhook(sessionId, message, userId) {
  if (!BASE_URL) throw new Error('API URL is not configured');
  if (!userId) throw new Error('Missing userId');

  try {
    const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
    const endpoint = `${cleanBaseUrl}/chat`;

    console.log('Sending to AI API:', endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify({
        thread_id: sessionId,
        user_id: userId,      // <-- Added user_id
        message: message
      })
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 403) {
        throw new Error("Authentication Failed: Check your API Key.");
      }
      throw new Error(`API Error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data.response || "I apologize, I couldn't generate a response.";

  } catch (error) {
    console.error("Error calling AI API:", error);
    throw error;
  }
}

/**
 * Fetch conversation history from the Python API (GET)
 * @param {string} sessionId - Thread/session identifier
 * @param {string|number} userId - Supabase user ID
 */
export async function getConversationHistory(sessionId, userId) {
  if (!BASE_URL) {
    console.warn("Skipping history fetch: No API URL");
    return [];
  }
  if (!userId) {
    console.warn("Skipping history fetch: Missing userId");
    return [];
  }

  try {
    const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
    const endpoint = `${cleanBaseUrl}/history/${sessionId}?user_id=${userId}`;

    console.log('Fetching history from:', endpoint);

    const response = await fetch(endpoint, {
      headers: {
        "X-API-Key": API_KEY
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.error("History fetch blocked: Invalid API Key");
        return [];
      }
      console.log(`History fetch failed (${response.status}), likely new chat.`);
      return [];
    }

    const data = await response.json();
    return data.messages || [];

  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}
