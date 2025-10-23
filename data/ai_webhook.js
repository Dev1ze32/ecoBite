// testWebhookChat.js
// testWebhookChat.js
import { supabase } from './supabaseNode.js';

const webhookUrl = "https://dev1z.app.n8n.cloud/webhook/378f895f-6b92-4b86-835e-4f874cb47a40";

async function sendWebhook(sessionId, message) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "key": "__n8n_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6"
      },
      body: JSON.stringify({
        sessionId: sessionId,
        message: message
      })
    });

    const data = await response.json();
    console.log('Full webhook response:', data);
    return data.ai_reply; // ✅ Changed to match actual response
  } catch (error) {
    console.error("Error posting to webhook:", error);
    throw error;
  }
}

async function saveMessageToSupabase(conversationId, sender, content) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: sender,
        content: content
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
