import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, RefreshCw, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! 👋 I'm your AI Assistant for AppointmentHub. Ask me anything about finding healthcare clinics, booking hair salons, managing appointments, or boosting your business listing with Pro Membership!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          model: selectedModel,
          systemInstruction: `You are the official AI Booking & Business Assistant for AppointmentHub.
AppointmentHub is an all-in-one verified appointment booking marketplace for clinics, salons, repair services, fitness centers, tutors, and local businesses.

Your goals:
1. Help customers search and book local verified services quickly.
2. Explain how to manage appointments, reschedule, or view digital booking passes.
3. For business owners, explain the Pro Membership & Priority Rank upgrade (₹999/month), which places their business AT THE TOP of customer search results with a gold ⭐ "TOP FEATURED" badge.
4. Keep responses friendly, helpful, concise, and formatted with bullet points when applicable.
5. Emphasize trust, speed, and real verified service providers.`
        })
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: data.error || "Sorry, I couldn't process your request right now. Please try again.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error('Chat bot error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: "Network error trying to contact the AI assistant. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-slate-900 text-amber-400 hover:bg-slate-800 shadow-2xl transition-all duration-300 flex items-center gap-2.5 border-2 border-amber-400/40 hover:scale-105 cursor-pointer group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 fill-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
          </div>
          <span className="font-extrabold text-white text-xs hidden md:inline tracking-tight pr-1">
            AI Assistant
          </span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[400px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">AppointmentHub AI</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-400 text-[9px] font-extrabold border border-amber-500/30">
                    GEMINI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">24/7 Smart Service Guide & Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Model Selector Bar */}
          <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-semibold shrink-0">
            <span>Model Mode:</span>
            <select
              value={selectedModel}
              onChange={(e: any) => setSelectedModel(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-[11px] font-bold text-slate-800 cursor-pointer"
            >
              <option value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (Fast)</option>
              <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Deep)</option>
              <option value="gemini-3.1-flash-lite">🚀 Gemini Flash Lite</option>
            </select>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-1 shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`text-[9px] block text-right font-medium ${
                      msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span className="text-[11px] font-semibold">Gemini is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {messages.length < 4 && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => handleSendMessage("How do I book an appointment?")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] whitespace-nowrap cursor-pointer transition-colors"
              >
                📅 How to book?
              </button>
              <button
                onClick={() => handleSendMessage("What is Pro Membership for business owners?")}
                className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[10px] whitespace-nowrap cursor-pointer transition-colors"
              >
                👑 What is Pro Membership?
              </button>
              <button
                onClick={() => handleSendMessage("Recommend healthcare clinics in Lucknow")}
                className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-[10px] whitespace-nowrap cursor-pointer transition-colors"
              >
                🏥 Find Clinics
              </button>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI about bookings, clinics, or Pro membership..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
