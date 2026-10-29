import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/chat_assistant_service';

const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null); // Tracks session across turns (null initially)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm the NEXUS GUARD assistant. How can I help you spot a scam today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    const newUserMessage = { id: Date.now(), text: userMessageText, sender: 'user' };

    // Append user message instantly
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send data via the service file (session_id is null on first request)
      const data = await sendChatMessage(sessionId, userMessageText);

      // Update session_id with the one returned from backend
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Append bot response
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: data.reply, 
          sender: 'bot' 
        }
      ]);
    } catch (error) {
      // Fallback error message if backend fails or experiences 503 high demand
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: "⚠️ Sorry, I'm having trouble connecting to the server or the AI model is busy. Please try again in a moment.", 
          sender: 'bot' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 mb-4 border border-gray-100 flex flex-col overflow-hidden h-[450px]">
          {/* Header */}
          <div className="bg-trust-blue-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">NEXUS Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 focus:outline-none">
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-line ${
                  msg.sender === 'user' 
                    ? 'bg-trust-blue-900 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator Bubble */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 border border-gray-200 rounded-lg rounded-bl-none p-3 shadow-sm flex items-center space-x-2 text-sm">
                  <Loader2 size={16} className="animate-spin text-trust-blue-900" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue-900"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-trust-blue-900 text-white rounded-full p-2 hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-trust-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center focus:outline-none"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default AIChatbotWidget;