import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

interface CuteChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

const AVATARS = [
  { id: 'pip', name: 'Pip 🐾', emoji: '🐾', title: 'Study Pup' },
  { id: 'mochi', name: 'Mochi 🍡', emoji: '🐱', title: 'Focus Cat' },
  { id: 'berry', name: 'Berry 🍓', emoji: '🐰', title: 'Bunny Scholar' },
];

const ROLES = [
  { id: 'study_buddy', label: '🐾 Study Buddy', desc: 'Encouraging study tips & motivation' },
  { id: 'exam_coach', label: '🎓 Exam Coach', desc: 'Timetables, memory hacks & deep prep' },
  { id: 'stationery_stylist', label: '🌸 Stationery Stylist', desc: 'Aesthetic desk setups & note layouts' },
];

const MODELS = [
  { id: 'gemini-3.5-flash', name: 'General Buddy', badge: '🌟 Standard', speed: 'Balanced', desc: 'Ideal for chat & advice' },
  { id: 'gemini-3.1-flash-lite', name: 'Quick Spark', badge: '⚡ Ultra Fast', speed: 'Fastest', desc: 'Instant flash answers' },
  { id: 'gemini-3.1-pro-preview', name: 'Deep Brain', badge: '🧠 Complex Reasoning', speed: 'In-Depth', desc: 'Advanced breakdowns & math' },
];

const STARTER_PROMPTS = [
  '🎒 What stationery kit fits my exam crunch?',
  '⏱️ Make a 2-hour Pomodoro study sprint schedule',
  '☕ How do I beat afternoon study fatigue?',
  '🎨 Suggest a cute pastel highlighter color palette',
  '🧠 Explain the Feynman technique for rapid memory'
];

export const CuteChatbot: React.FC<CuteChatbotProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('studysprint_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved chat:', e);
      }
    }
    return [
      {
        id: 'welcome-1',
        role: 'model',
        text: "Hi there! I'm **Pip** 🐾, your cute AI Study Buddy at StudySprint! Whether you need exam cram hacks, aesthetic stationery tips, or a custom Pomodoro schedule, I'm here to help. What are we studying today? ✨",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('study_buddy');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('studysprint_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Prepare history payload for server
    const currentHistory = messages.map((m) => ({
      role: m.role,
      text: m.text
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: currentHistory,
          model: selectedModel,
          role: selectedRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || "Pip is recharging his cute brain batteries! ⚡ Try asking once more.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `🐾 *Pip sneezed!* Couldn't reach the study cloud right now (${err.message || 'connection glitch'}). Make sure GEMINI_API_KEY is available or retry in a moment! ✨`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const welcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'model',
      text: "Fresh blank notebook ready! 📝 Ask me anything about study schedules, exam prep, or the cutest stationery.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel
    };
    setMessages([welcome]);
    localStorage.removeItem('studysprint_chat_history');
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const currentAvatar = AVATARS[avatarIndex];

  return (
    <>
      {/* Floating Cute Launcher Button (when minimized/closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open Pip Cute AI Study Buddy"
          className="fixed bottom-6 right-6 z-[9990] group flex items-center gap-2.5 bg-[#FFC93C] hover:bg-[#ffbe1a] text-[#1E2A4A] border-3 border-[#1E2A4A] shadow-[4px_4px_0px_#1E2A4A] hover:shadow-[2px_2px_0px_#1E2A4A] hover:translate-x-[2px] hover:translate-y-[2px] px-4 py-3 rounded-full font-display font-bold text-sm transition-all duration-150 cursor-pointer"
        >
          <span className="text-2xl animate-bounce">🐾</span>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-black text-sm">Ask Pip AI</span>
            <span className="text-[10px] font-medium opacity-80">Cute Study Buddy ✨</span>
          </div>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#1E2A4A] animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Cute AI Chatbot"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9995] w-[calc(100vw-2rem)] sm:w-[420px] max-w-[95vw] h-[600px] max-h-[85vh] bg-[#FFFDF7] dark:bg-[#111827] border-3 border-[#1E2A4A] dark:border-amber-300 rounded-3xl shadow-[8px_8px_0px_#1E2A4A] dark:shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Top Header */}
          <div className="bg-[#FFC93C] dark:bg-[#F59E0B] p-3.5 border-b-3 border-[#1E2A4A] dark:border-amber-300 text-[#1E2A4A] dark:text-slate-950 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setAvatarIndex((prev) => (prev + 1) % AVATARS.length)}
                title="Click to cycle mascot avatar!"
                className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-900 border-2 border-[#1E2A4A] flex items-center justify-center text-xl shrink-0 hover:scale-105 transition-transform cursor-pointer shadow-[2px_2px_0px_#1E2A4A]"
              >
                {currentAvatar.emoji}
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-base tracking-tight truncate">
                    {currentAvatar.name}
                  </h3>
                  <span className="text-[10px] bg-[#1E2A4A] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                    AI Buddy
                  </span>
                </div>
                <p className="text-xs font-medium text-[#1E2A4A]/80 dark:text-slate-900 truncate">
                  {loading ? 'Thinking up study magic... ⚡' : 'Online & ready to help ✨'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Settings Toggle */}
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                title="Model & Role Settings"
                className={`p-1.5 rounded-xl border-2 border-[#1E2A4A] font-bold text-xs cursor-pointer transition-colors ${
                  showSettings ? 'bg-[#1E2A4A] text-white' : 'bg-white/80 hover:bg-white text-[#1E2A4A]'
                }`}
                aria-label="Settings"
              >
                ⚙️
              </button>
              {/* Clear Chat */}
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-[#1E2A4A] border-2 border-[#1E2A4A] font-bold text-xs cursor-pointer transition-colors"
                aria-label="Clear chat"
              >
                🧹
              </button>
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                title="Minimize Chat"
                className="p-1.5 rounded-xl bg-white/80 hover:bg-rose-100 text-[#1E2A4A] border-2 border-[#1E2A4A] font-bold text-xs cursor-pointer transition-colors"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Model & Role Settings Drawer */}
          {showSettings && (
            <div className="bg-amber-50 dark:bg-slate-900 p-3.5 border-b-2 border-[#1E2A4A]/20 dark:border-slate-800 text-xs flex flex-col gap-2.5 shrink-0 animate-in slide-in-from-top-2">
              <div>
                <span className="font-bold text-[#1E2A4A] dark:text-amber-300 block mb-1">
                  🤖 Gemini Model Selection:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-1.5 rounded-xl text-left border cursor-pointer transition-all ${
                        selectedModel === m.id
                          ? 'bg-[#1E2A4A] text-white border-[#1E2A4A] font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-bold truncate text-[11px]">{m.name}</div>
                      <div className="text-[9px] opacity-75 truncate">{m.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-[#1E2A4A] dark:text-amber-300 block mb-1">
                  🎭 Chatbot Persona:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`px-2.5 py-1 rounded-xl whitespace-nowrap border cursor-pointer text-[11px] transition-all ${
                        selectedRole === r.id
                          ? 'bg-amber-400 text-slate-950 font-bold border-[#1E2A4A]'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Model Status Bar */}
          <div className="bg-amber-100/60 dark:bg-slate-900/60 px-3 py-1 border-b border-amber-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              {selectedModel} · {selectedRole.replace('_', ' ')}
            </span>
            <span className="font-hand font-bold text-amber-700 dark:text-amber-400">
              powered by Gemini
            </span>
          </div>

          {/* Message Thread (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-body">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                      isUser
                        ? 'bg-[#1E2A4A] text-white rounded-tr-xs border border-[#1E2A4A]'
                        : 'bg-amber-50/90 dark:bg-slate-800/90 text-[#1E2A4A] dark:text-slate-100 rounded-tl-xs border-2 border-amber-200/90 dark:border-slate-700'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-amber-200/50 dark:border-slate-700/50">
                        <span className="font-display font-bold text-[11px] text-amber-800 dark:text-amber-400 flex items-center gap-1">
                          <span>{currentAvatar.emoji}</span> {currentAvatar.name}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          {msg.modelUsed && (
                            <span className="text-[9px] font-mono bg-white/70 dark:bg-slate-900 px-1 rounded border border-slate-200 dark:border-slate-700">
                              {msg.modelUsed.includes('pro') ? 'pro' : msg.modelUsed.includes('lite') ? 'lite' : 'flash'}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            title="Copy reply"
                            className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {copiedId === msg.id ? '✓ Copied' : '📋'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formatted Text */}
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                      {msg.text}
                    </div>

                    <div className={`mt-1 text-[9px] ${isUser ? 'text-slate-300 text-right' : 'text-slate-400 text-left'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs py-1">
                <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-slate-800 flex items-center justify-center text-xs animate-spin">
                  🐾
                </span>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-amber-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="font-hand font-bold text-xs">Pip is writing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 pt-1 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-[#1E2A4A] dark:text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 whitespace-nowrap cursor-pointer transition-colors shadow-2xs shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t-2 border-[#1E2A4A]/15 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask Pip about study tips, stationery, exams...`}
                  rows={2}
                  disabled={loading}
                  className="w-full resize-none bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#FFC93C] dark:focus:border-amber-400 rounded-2xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-10 px-4 bg-[#FFC93C] hover:bg-[#ffbe1a] disabled:opacity-40 disabled:cursor-not-allowed text-[#1E2A4A] font-display font-black text-sm rounded-2xl border-2 border-[#1E2A4A] shadow-[2px_2px_0px_#1E2A4A] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-all flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                Send 🚀
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-body">
              <span>Shift+Enter for newline</span>
              <span>StudySprint AI Concierge 🐾</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
