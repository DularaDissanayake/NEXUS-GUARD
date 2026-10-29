// services/chat_assistant_service.jsx

const API_BASE_URL = 'http://localhost:8000'; // Update this if your FastAPI backend runs on a different host/port

/**
 * Sends a message to the FastAPI backend chat endpoint.
 * 
 * @param {string|null} sessionId - The current session UUID (null for the first message)
 * @param {string} message - The user's input text
 * @returns {Promise<{session_id: string, reply: string}>}
 */
export const sendChatMessage = async (sessionId, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Returns { session_id: "...", reply: "..." }
  } catch (error) {
    console.error("Error communicating with Gemini chatbot backend:", error);
    throw error;
  }
};