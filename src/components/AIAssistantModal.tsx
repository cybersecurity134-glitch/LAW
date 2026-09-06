import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  BookOpen, 
  ExternalLink, 
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: Array<{
    law_id: string;
    section_number: string;
    act_name: string;
    source_url: string;
  }>;
  isUncertain?: boolean;
}

export const AIAssistantModal: React.FC = () => {
  const { 
    showAIAssistant, 
    setShowAIAssistant, 
    aiInitialQuestion, 
    setAiInitialQuestion,
    openLawDetail,
    user,
    explanationMode
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste! I am your **Nyaya AI Legal Information Guide**.\n\nI can help you understand Indian laws, sections, punishments, bailable/non-bailable status, and legal remedies (including the **Bharatiya Nyaya Sanhita 2023**, **IT Act 2000**, and **Motor Vehicles Act**).\n\n*Important Notice: I provide educational legal information only, not formal legal advice. Always consult an advocate for court cases.*`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "What law applies to online UPI financial fraud?",
    "What is the penalty for drunk driving in Telangana?",
    "Explain Section 66 of the Information Technology Act",
    "What is Zero FIR under Bharatiya Nagarik Suraksha Sanhita (BNSS)?",
    "What are my rights if a product purchased online is defective?"
  ];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // If initial question provided, trigger automatically
  useEffect(() => {
    if (showAIAssistant && aiInitialQuestion) {
      handleSend(aiInitialQuestion);
      setAiInitialQuestion('');
    }
  }, [showAIAssistant, aiInitialQuestion]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          state: user?.preferences?.state || 'Telangana',
          explanationMode: explanationMode
        })
      });

      const data = await response.json();

      const aiResponse: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.content || "I could not retrieve the legal provision. Please verify with official India Code archives.",
        sources: data.sources || [],
        isUncertain: data.is_uncertain
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: "I encountered a connection issue while consulting the legal knowledge base. Please check your network or try searching the sections directly in the app.",
          isUncertain: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Conversation cleared. What Indian law, Act, section, or penalty would you like to explore?`
      }
    ]);
  };

  return (
    <AnimatePresence>
      {showAIAssistant && (
        <motion.div 
          key="ai-assistant-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: MOTION_EASINGS.appleDecel }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 modal-backdrop-blur overflow-hidden cursor-pointer"
          onClick={() => setShowAIAssistant(false)}
        >
          <motion.div 
            key="ai-assistant-card"
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-3xl h-[90vh] flex flex-col liquid-glass-card text-slate-900 dark:text-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden cursor-default dark:bg-[#0B0B0B] dark:border-[#292929]"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 liquid-header dark:bg-[#0B0B0B]/95 dark:border-b dark:border-[#222222]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#6340e6] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 ring-1 ring-white/30">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#22C55E] animate-pulse" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#FFFFFF] font-display uppercase tracking-wider">
                      Legal AI Assistant
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#777777] mt-0.5 font-medium">
                    Ask anything about Indian legal provisions, punishments, or procedures
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={clearChat}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-[#777777] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#181818] transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowAIAssistant(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-[#777777] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#181818] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

        {/* Disclaimer Bar */}
        <div className="px-4 py-2 bg-orange-500/10 dark:bg-[#F59E0B]/10 border-b border-orange-500/20 dark:border-[#F59E0B]/20 text-[11px] text-orange-700 dark:text-[#F59E0B] flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-orange-500 dark:text-[#F59E0B] shrink-0" />
          <span>
            <strong className="text-slate-900 dark:text-[#FFFFFF] font-semibold">Educational Information Only:</strong> Sourced from verified Indian statutes. Not a substitute for formal legal representation.
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  msg.sender === 'user'
                    ? 'bg-slate-200 dark:bg-[#181818] border border-slate-300 dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3]'
                    : 'bg-orange-500 dark:bg-[#7C5CFF] shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-orange-500/15 text-orange-950 dark:text-[#FFFFFF] dark:bg-[#7C5CFF]/20 border border-orange-500/30 dark:border-[#7C5CFF]/35 rounded-tr-none font-medium'
                      : 'bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] text-slate-800 dark:text-[#B3B3B3] rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>
                </div>

                {/* Sources if matched */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs space-y-1.5 shadow-xs">
                    <div className="font-semibold text-slate-600 dark:text-[#777777] flex items-center gap-1 text-[11px]">
                      <Scale className="w-3 h-3 text-orange-500 dark:text-[#7C5CFF]" />
                      Relevant Verified Laws:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setShowAIAssistant(false);
                            openLawDetail(src.law_id);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 dark:bg-[#7C5CFF]/15 dark:hover:bg-[#7C5CFF]/25 border border-orange-500/20 dark:border-[#7C5CFF]/30 text-orange-700 dark:text-[#7C5CFF] font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          <span>{src.section_number} ({src.act_name})</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-orange-500 dark:bg-[#7C5CFF] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] rounded-tl-none flex items-center gap-2 text-xs text-slate-500 dark:text-[#777777]">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500 dark:text-[#7C5CFF]" />
                <span>Consulting Indian statutes and gazette database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample questions chips */}
        <div className="px-4 py-2.5 border-t border-black/5 dark:border-[#222222] bg-black/5 dark:bg-[#050505]">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#777777] mb-1.5 tracking-wider">
            Suggested Queries
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sampleQuestions.map((q, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929] dark:hover:border-[#7C5CFF]/40 transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-black/5 dark:border-[#222222] liquid-header dark:bg-[#0B0B0B]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about any Indian law, offence, penalty, or legal right..."
              className="flex-1 px-4 py-3 rounded-full liquid-pill text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] dark:bg-[#151515] dark:border-[#292929] focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-[#7C5CFF]/40 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] text-white flex items-center justify-center shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 ring-1 ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
