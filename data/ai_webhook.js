import 'react-native-url-polyfill/auto'

// DIRECT ACCESS: Uses variables from your .env file
//Constants.expoConfig?.extra?.webhookUrl;
const BASE_URL = process.env.EXPO_PUBLIC_WEBHOOK_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

// Debug checks to help you spot missing config immediately
if (!BASE_URL) console.error('Missing EXPO_PUBLIC_WEBHOOK_URL in .env file');
if (!API_KEY) console.error('Missing EXPO_PUBLIC_API_KEY in .env file');

/**
 * Send a message to the Python API (POST)
 */
export async function sendWebhook(sessionId, message) {
  if (!BASE_URL) throw new Error('API URL is not configured');

  try {
    const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
    const endpoint = `${cleanBaseUrl}/chat`;
    
    console.log('Sending to AI API:', endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "X-API-Key": API_KEY // <--- AUTH HEADER ADDED
      },
      body: JSON.stringify({
        thread_id: sessionId, 
        message: message
      })
    });

    if (!response.ok) {
        const text = await response.text();
        // Friendly error for 403 Forbidden (Auth failed)
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
 */
export async function getConversationHistory(sessionId) {
  if (!BASE_URL) {
    console.warn("Skipping history fetch: No API URL");
    return [];
  }

  try {
    const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
    const endpoint = `${cleanBaseUrl}/history/${sessionId}`;
    
    console.log('Fetching history from:', endpoint);
    
    const response = await fetch(endpoint, {
        headers: { 
            "X-API-Key": API_KEY // <--- AUTH HEADER ADDED
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