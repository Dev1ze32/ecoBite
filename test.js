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
    return data.message; // Return only the message from JSON response
  } catch (error) {
    console.error("Error posting to webhook:", error);
    throw error;
  }
}

console.log(sendWebhook(1, "hello world"))