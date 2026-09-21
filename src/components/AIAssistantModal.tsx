import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Scale, 
  ExternalLink, 
  RotateCcw,
  Loader2, 
  Mic, 
  MicOff, 
  Paperclip, 
  Globe, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { modalCardVariants, MOTION_EASINGS } from '../utils/motion';
import { AIAttachment, AIMessage } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { VoiceWaveform } from './ai/VoiceWaveform';
import { AttachmentChips } from './ai/AttachmentChips';
import { WebCitationsList } from './ai/WebCitationsList';

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
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<AIAttachment[]>([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [autoVoice, setAutoVoice] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastFailedRequest, setLastFailedRequest] = useState<{ query: string; attachments: AIAttachment[] } | null>(null);

  // Audio recording state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Speech recognition (Speech-to-Text) state
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const speechRecognitionRef = useRef<any>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Active capability filter tab: 'all' | 'explain' | 'summarize' | 'compare' | 'find' | 'penalties' | 'database' | 'provisions'
  const [selectedCapability, setSelectedCapability] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste! I am your **Nyaya AI Legal & Emergency Assistant**, grounded in India's verified legal statutes, official emergency helplines, and procedural recourse frameworks.\n\n### ⚖️ Core Capabilities:\n• **🚨 Emergency & Help Assistant:** Instant 24x7 emergency contacts (112, 100, 101, 102/108, 1091), cyber fraud golden-hour response (1930), Zero FIR rights, and free legal aid (NALSA 15100).\n• **📡 Legal Updates Tracker:** Track recent Acts, Amendments, Repealed Laws, Court Developments, and Changes to Penalties with Google Search grounding.\n• **💡 Explain a Section:** Translate complex legal jargon into simple, citizen-friendly language.\n• **📜 Summarize an Act:** Get executive summaries, key pillars, and landmark sections of central & state Acts.\n• **⚖️ Compare Two Laws:** Cross-reference mappings (e.g. IPC vs BNS, CrPC vs BNSS, IEA vs BSA, IT Act vs DPDP).\n• **🔍 Find Relevant Sections:** Describe your real-life problem or scenario to pinpoint applicable laws and FIR recourse.\n• **🛡️ Penalties & Consequences:** Detailed breakdown of imprisonment, fines, bail status, and collateral consequences.\n• **📚 Verified Legal Database:** Grounded answers referencing official 13-field statutory data (definitions, sub-sections, exceptions, amendments).\n• **🏛️ Official Provisions & Links:** Direct in-app statutory links and verified India Code portal references.\n\nYou can also **speak via microphone**, upload **FIRs/PDFs/documents**, or attach **screenshots**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const LEGAL_CAPABILITIES = [
    {
      id: 'emergency',
      label: 'Emergency & Help',
      icon: '🚨',
      prompts: [
        "Someone is threatening me and I feel unsafe, what emergency number should I call right now?",
        "I was cheated online and money was debited from my bank account, what should I do immediately?",
        "Police are refusing to register my FIR, what are my legal rights and what is a Zero FIR?",
        "How do I get free legal aid from NALSA / DLSA and who is eligible under Section 12?",
        "Which authority should I approach to complain about defective goods or unpaid wages?",
        "What is the difference between an FIR and a Non-Cognizable (NC) report?"
      ]
    },
    {
      id: 'updates',
      label: 'Legal Updates',
      icon: '📡',
      prompts: [
        "Give me legal updates for India, all practice areas, for the last 30 days.",
        "Give me legal updates for India: Criminal law (BNS/BNSS/BSA) since 1 January 2026",
        "Give me legal updates for India: Corporate & Tax law this quarter",
        "Give me legal updates for India: Cyber & Tech regulations (IT Act/DPDP) in the last 60 days",
        "Give me legal updates for Telangana, Traffic and Municipal laws, for the last 30 days"
      ]
    },
    {
      id: 'explain',
      label: 'Explain Section',
      icon: '💡',
      prompts: [
        "Explain Section 420 of the IPC in simple terms",
        "Explain Section 103 of Bharatiya Nyaya Sanhita (BNS) 2023 in simple language",
        "Explain Section 66 of Information Technology Act 2000 in simple words",
        "Explain Section 185 of Motor Vehicles Act (drunk driving) in plain terms"
      ]
    },
    {
      id: 'summarize',
      label: 'Summarize Act',
      icon: '📜',
      prompts: [
        "Summarize the Consumer Protection Act, 2019",
        "Summarize the Bharatiya Nyaya Sanhita (BNS) 2023: intent, chapters, and landmark sections",
        "Summarize the Motor Vehicles (Amendment) Act 2019: key reforms and traffic penalties",
        "Summarize the Information Technology Act 2000: cyber offences and digital evidence"
      ]
    },
    {
      id: 'compare',
      label: 'Compare Two Laws',
      icon: '⚖️',
      prompts: [
        "Compare the old Motor Vehicles Act penalties with the amended ones",
        "Compare Indian Penal Code (IPC 1860) and Bharatiya Nyaya Sanhita (BNS 2023)",
        "Compare Code of Criminal Procedure (CrPC 1973) and BNSS 2023 (Zero FIR, digital summons)",
        "Compare Information Technology Act 2000 and Digital Personal Data Protection Act 2023"
      ]
    },
    {
      id: 'find',
      label: 'Find Relevant Sections',
      icon: '🔍',
      prompts: [
        "Which section applies if my employer doesn't pay my salary on time?",
        "What sections apply to online bank fraud where money was stolen via fake APK / OTP?",
        "What sections apply if landlord refuses to return security deposit without justification?",
        "What sections apply to rash driving resulting in vehicle collision on highway?"
      ]
    },
    {
      id: 'penalties',
      label: 'Penalties & Consequences',
      icon: '🛡️',
      prompts: [
        "What's the punishment for cheque bounce under the Negotiable Instruments Act?",
        "Explain penalties, fine amounts, and bailable status for hit-and-run under BNS Section 106",
        "Explain imprisonment, driving licence cancellation, and vehicle impounding for drunk driving",
        "Explain whether cyber financial fraud under Section 66D is bailable or non-bailable"
      ]
    },
    {
      id: 'database',
      label: 'Verified Legal DB',
      icon: '📚',
      prompts: [
        "What are the statutory definitions under Section 2 of Consumer Protection Act 2019?",
        "What are the legal exceptions for private defense under Bharatiya Nyaya Sanhita?",
        "What is the current legal status and enactment date of Bharatiya Sakshya Adhiniyam 2023?",
        "Show all sub-sections and amendments for Section 173 of BNSS (Zero FIR & investigation)"
      ]
    },
    {
      id: 'provisions',
      label: 'Official Provisions',
      icon: '🏛️',
      prompts: [
        "Give me the official link for Section 138 of the NI Act",
        "Provide official text and India Code portal link for BNS Section 103",
        "Provide official statutory links and gazette provisions for IT Act Section 66",
        "Where can I find the official bare act for Motor Vehicles Act 1988?"
      ]
    }
  ];

  // Derive prompts to show based on selected capability tab
  const activePrompts = selectedCapability === 'all'
    ? [
        "🚨 Emergency: What numbers should I call if in immediate danger?",
        "I was cheated online, how do I report within the golden hour on 1930?",
        "Police refuse to register an FIR: What are my rights and what is a Zero FIR?",
        "Explain Section 420 of the IPC in simple terms",
        "Summarize the Consumer Protection Act, 2019",
        "Compare the old Motor Vehicles Act penalties with the amended ones",
        "Which section applies if my employer doesn't pay my salary on time?",
        "How do I get free legal aid from NALSA / DLSA and who is eligible?",
        "What's the punishment for cheque bounce under the Negotiable Instruments Act?"
      ]
    : (LEGAL_CAPABILITIES.find(c => c.id === selectedCapability)?.prompts || []);

  // Auto-scroll on new message or stream chunk
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, streamingStatus]);

  // If initial question provided, trigger automatically
  useEffect(() => {
    if (showAIAssistant && aiInitialQuestion) {
      handleSend(aiInitialQuestion);
      setAiInitialQuestion('');
    }
  }, [showAIAssistant, aiInitialQuestion]);

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopAudioRecording(false);
      stopSpeechRecognition();
    };
  }, []);

  // Text-to-Speech (TTS) handler
  const toggleSpeech = useCallback((messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting for natural speech
    const cleanText = text
      .replace(/[*#_`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-IN')) || 
                         voices.find(v => v.lang.startsWith('en')) || 
                         voices[0];
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  }, [speakingMessageId]);

  // Safe clipboard copy for AI messages
  const handleCopyMessage = async (messageId: string, content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  // File Upload Handlers (Images, PDFs, Audio, Docs)
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isAudio = file.type.startsWith('audio/');
      const isDoc = file.type.includes('text') || file.name.endsWith('.doc') || file.name.endsWith('.docx');

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const newAttachment: AIAttachment = {
          id: 'att-' + Math.random().toString(36).substring(2, 9),
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          data: base64Data,
          previewUrl: isImage ? base64Data : undefined,
          type: isImage ? 'image' : isPdf ? 'pdf' : isAudio ? 'audio' : 'document'
        };

        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Clipboard Paste Support (e.g. Paste screenshot)
  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      handleFiles(e.clipboardData.files);
    }
  };

  // Drag and Drop Support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Speech-to-Text (Microphone input into input field)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: start direct voice message recorder if web speech not available
      startAudioRecording();
      return;
    }

    if (isListeningSpeech) {
      stopSpeechRecognition();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListeningSpeech(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        stopSpeechRecognition();
      };

      recognition.onend = () => {
        setIsListeningSpeech(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start speech recognition, using audio recorder fallback:', err);
      startAudioRecording();
    }
  };

  const stopSpeechRecognition = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    setIsListeningSpeech(false);
  };

  // Voice Message Recording (Audio Blob -> Attachment)
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Audio = e.target?.result as string;
          const audioAttachment: AIAttachment = {
            id: 'voice-' + Date.now(),
            name: `Voice Note (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            mimeType: 'audio/webm',
            size: audioBlob.size,
            data: base64Audio,
            type: 'audio'
          };
          setAttachments(prev => [...prev, audioAttachment]);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all media tracks
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access not granted or unavailable:", err);
      setMicError("Microphone permission was not granted. Please allow microphone access in your browser settings to record voice questions.");
      setTimeout(() => setMicError(null), 6000);
    }
  };

  const stopAudioRecording = (save = true) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && isRecordingAudio) {
      if (!save) {
        // Discard
        if (audioStream) {
          audioStream.getTracks().forEach(t => t.stop());
          setAudioStream(null);
        }
      }
      mediaRecorderRef.current.stop();
    }

    setIsRecordingAudio(false);
  };

  // Main Submit & Streaming handler
  const handleSend = async (queryText?: string, retryAttachments?: AIAttachment[]) => {
    const textToSend = (queryText !== undefined ? queryText : input).trim();
    const attachmentsToSend = retryAttachments || attachments;

    if ((!textToSend && attachmentsToSend.length === 0) || loading) return;

    // Reset error state
    setLastFailedRequest(null);

    const userMessage: AIMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: textToSend || (attachmentsToSend.length > 0 ? "Analyzing attached file(s)..." : ""),
      attachments: attachmentsToSend.length > 0 ? [...attachmentsToSend] : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setLoading(true);
    setStreamingStatus("Connecting to Nyaya Legal AI Engine...");

    const aiMessageId = 'ai-' + Date.now();
    let accumulatedContent = '';

    // Create placeholder for progressive streaming
    const placeholderAIMessage: AIMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setMessages(prev => [...prev, placeholderAIMessage]);

    // Build context history
    const conversationHistory = messages
      .filter(m => m.id !== 'welcome')
      .slice(-6)
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    try {
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend || "Please analyze and explain the legal implications of the attached document/media.",
          attachments: attachmentsToSend.map(a => ({
            name: a.name,
            mimeType: a.mimeType,
            data: a.data,
            type: a.type
          })),
          conversation: conversationHistory,
          state: user?.preferences?.state || 'Telangana',
          explanationMode: explanationMode,
          enableWebSearch: enableWebSearch
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = 'message';
        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.replace('event:', '').trim();
          } else if (line.startsWith('data:')) {
            const dataStr = line.replace('data:', '').trim();
            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === 'status') {
                setStreamingStatus(data.message || "Searching...");
              } else if (currentEvent === 'chunk') {
                setStreamingStatus(null);
                accumulatedContent += data.text || '';
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: accumulatedContent, isStreaming: true } 
                    : msg
                ));
              } else if (currentEvent === 'done') {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { 
                        ...msg, 
                        content: accumulatedContent || data.content || msg.content,
                        sources: data.sources || [],
                        webCitations: data.webCitations || [],
                        searchQueries: data.searchQueries || [],
                        model_used: data.model_used,
                        is_uncertain: data.is_uncertain,
                        isStreaming: false
                      } 
                    : msg
                ));

                // If auto-voice is enabled, speak out response automatically
                if (autoVoice && accumulatedContent) {
                  toggleSpeech(aiMessageId, accumulatedContent);
                }
              }
            } catch (jsonErr) {
              console.warn("Parse SSE chunk error:", jsonErr);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Streaming connection error, falling back to standard ask endpoint:", error);
      
      // Attempt fallback to non-streaming endpoint
      try {
        const fallbackRes = await fetch('/api/ai/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: textToSend,
            attachments: attachmentsToSend,
            conversation: conversationHistory,
            state: user?.preferences?.state || 'Telangana',
            explanationMode: explanationMode,
            enableWebSearch: enableWebSearch
          })
        });

        const data = await fallbackRes.json();
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? {
                ...msg,
                content: data.content || "Legal provisions retrieved from official records.",
                sources: data.sources || [],
                webCitations: data.webCitations || [],
                model_used: data.model_used,
                is_uncertain: data.is_uncertain,
                isStreaming: false
              }
            : msg
        ));
      } catch (fallbackErr) {
        // Save failed request for retry button
        setLastFailedRequest({ query: textToSend, attachments: attachmentsToSend });

        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? {
                ...msg,
                content: "I encountered a temporary connection issue while accessing the legal database. Your question has been saved. Please tap **Retry** below.",
                is_uncertain: true,
                isStreaming: false
              }
            : msg
        ));
      }
    } finally {
      setLoading(false);
      setStreamingStatus(null);
    }
  };

  const clearChat = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. What Indian law, Act, section, or document would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 modal-backdrop-blur overflow-hidden cursor-pointer select-none"
          onClick={() => setShowAIAssistant(false)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <motion.div 
            key="ai-assistant-card"
            variants={modalCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-3xl h-[92vh] flex flex-col liquid-glass-card text-slate-900 dark:text-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden cursor-default dark:bg-[#0B0B0B] dark:border-[#292929] select-text"
            onClick={e => e.stopPropagation()}
            onPaste={handlePaste}
          >
            
            {/* Drag & Drop Visual Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 z-50 bg-orange-500/20 dark:bg-[#7C5CFF]/20 backdrop-blur-md flex flex-col items-center justify-center border-2 border-dashed border-orange-500 dark:border-[#7C5CFF] rounded-3xl pointer-events-none animate-fadeIn">
                <FileText className="w-12 h-12 text-orange-600 dark:text-[#7C5CFF] mb-2 animate-bounce" />
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Drop files to analyze with Nyaya AI
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Supports Images, PDFs, Case Documents, and Audio Notes
                </p>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 liquid-header dark:bg-[#0B0B0B]/95 dark:border-b dark:border-[#222222]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 dark:from-[#7C5CFF] dark:to-[#6340e6] flex items-center justify-center text-white shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 ring-1 ring-white/30 shrink-0">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#22C55E] animate-pulse" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#FFFFFF] font-display uppercase tracking-wider">
                      Nyaya AI Multimodal Guide
                    </h2>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-[#22C55E] border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#777777] mt-0.5 font-medium">
                    Text • Voice • Image & PDF Document Analysis • Google Search Grounding
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                {/* Auto-Voice Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoVoice(!autoVoice)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    autoVoice 
                      ? 'bg-orange-500/20 text-orange-600 dark:bg-[#7C5CFF]/25 dark:text-[#7C5CFF]' 
                      : 'text-slate-400 hover:text-slate-700 dark:text-[#777777] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#181818]'
                  }`}
                  title={autoVoice ? "Auto Voice is ON (Responses read aloud)" : "Auto Voice is OFF (Tap to enable voice answers)"}
                >
                  {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Reset Chat */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={clearChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-[#777777] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#181818] transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>

                {/* Close */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowAIAssistant(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-[#777777] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-[#181818] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Disclaimer & Context Ribbon */}
            <div className="px-4 py-2 bg-orange-500/10 dark:bg-[#F59E0B]/10 border-b border-orange-500/20 dark:border-[#F59E0B]/20 text-[11px] text-orange-700 dark:text-[#F59E0B] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-500 dark:text-[#F59E0B] shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-900 dark:text-[#FFFFFF] font-semibold">Educational Legal Information:</strong> Grounded in Indian statutory acts. Not formal legal representation.
                </span>
              </div>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/50 dark:bg-[#181818] text-slate-600 dark:text-slate-300 shrink-0 ml-2">
                Region: {user?.preferences?.state || 'Telangana'}
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                      msg.role === 'user'
                        ? 'bg-slate-200 dark:bg-[#181818] border border-slate-300 dark:border-[#292929] text-slate-700 dark:text-[#B3B3B3]'
                        : 'bg-orange-500 dark:bg-[#7C5CFF] shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className="space-y-2 min-w-0 max-w-full">
                    {/* Multimodal Attachments Sent by User */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-end mb-1">
                        {msg.attachments.map(att => (
                          <div 
                            key={att.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 dark:bg-[#7C5CFF]/15 border border-orange-500/20 dark:border-[#7C5CFF]/30 text-[11px] text-slate-800 dark:text-slate-200"
                          >
                            {att.type === 'image' && att.previewUrl ? (
                              <img src={att.previewUrl} alt={att.name} className="w-5 h-5 rounded object-cover" />
                            ) : att.type === 'pdf' ? (
                              <FileText className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Paperclip className="w-3.5 h-3.5 text-orange-500 dark:text-[#7C5CFF]" />
                            )}
                            <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Main Text Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-orange-500/15 text-orange-950 dark:text-[#FFFFFF] dark:bg-[#7C5CFF]/20 border border-orange-500/30 dark:border-[#7C5CFF]/35 rounded-tr-none font-medium'
                          : 'bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] text-slate-800 dark:text-[#D1D5DB] rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="markdown-body prose prose-sm dark:prose-invert max-w-none break-words">
                        <Markdown
                          components={{
                            a: ({ href, children, ...props }) => {
                              if (href?.startsWith('law:')) {
                                const lawId = href.replace('law:', '');
                                return (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowAIAssistant(false);
                                      openLawDetail(lawId);
                                    }}
                                    className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md bg-orange-500/15 hover:bg-orange-500/25 dark:bg-[#7C5CFF]/20 dark:hover:bg-[#7C5CFF]/30 border border-orange-500/30 dark:border-[#7C5CFF]/40 text-orange-700 dark:text-[#a78bfa] font-bold text-xs transition-all cursor-pointer shadow-2xs align-middle"
                                    title="Open verified statutory section in app"
                                  >
                                    <Scale className="w-3 h-3 text-orange-500 dark:text-[#7C5CFF]" />
                                    <span>{children}</span>
                                  </button>
                                );
                              }
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 text-orange-600 dark:text-[#a78bfa] underline hover:text-orange-700 dark:hover:text-[#c4b5fd] font-medium"
                                  {...props}
                                >
                                  <span>{children}</span>
                                  <ExternalLink className="w-2.5 h-2.5 inline ml-0.5 opacity-80" />
                                </a>
                              );
                            },
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-[#292929]">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-[#292929] text-xs">
                                  {children}
                                </table>
                              </div>
                            ),
                            th: ({ children }) => (
                              <th className="px-3 py-2 bg-slate-200/70 dark:bg-[#181818] font-bold text-slate-800 dark:text-slate-200 text-left border-r last:border-r-0 border-slate-200 dark:border-[#292929]">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-3 py-2 border-t border-slate-200/60 dark:border-[#222222] border-r last:border-r-0 text-slate-700 dark:text-slate-300">
                                {children}
                              </td>
                            )
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      </div>

                      {/* Streaming cursor */}
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-orange-500 dark:bg-[#7C5CFF] ml-1 animate-pulse align-middle" />
                      )}

                      {/* Footer Info inside bubble */}
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/5 dark:border-white/5 text-[10px] text-slate-400 dark:text-slate-500">
                        <span>{msg.timestamp}</span>

                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2">
                            {msg.model_used && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">
                                {msg.model_used.replace('gemini-', '')}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-[#7C5CFF] transition-colors"
                              title="Copy response"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSpeech(msg.id, msg.content)}
                              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-[#7C5CFF] transition-colors"
                              title={speakingMessageId === msg.id ? "Stop voice" : "Read aloud"}
                            >
                              {speakingMessageId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Google Search Verified Web Grounding Citations */}
                    {msg.webCitations && msg.webCitations.length > 0 && (
                      <WebCitationsList citations={msg.webCitations} />
                    )}

                    {/* Verified Statutory Laws Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#292929] text-xs space-y-1.5 shadow-xs">
                        <div className="font-semibold text-slate-600 dark:text-[#777777] flex items-center gap-1 text-[11px]">
                          <Scale className="w-3 h-3 text-orange-500 dark:text-[#7C5CFF]" />
                          <span>Official Indian Statutes Referenced:</span>
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

              {/* Streaming or Thinking Indicator */}
              {loading && streamingStatus && (
                <div className="flex gap-3 max-w-[85%] animate-fadeIn">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 dark:bg-[#7C5CFF] flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/20 dark:shadow-[#7C5CFF]/25">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-[#292929] rounded-tl-none flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500 dark:text-[#7C5CFF] shrink-0" />
                    <span className="font-medium">{streamingStatus}</span>
                  </div>
                </div>
              )}

              {/* Failure & Retry Banner */}
              {lastFailedRequest && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-3 text-xs text-red-800 dark:text-red-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>The request could not complete. Your query is preserved.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSend(lastFailedRequest.query, lastFailedRequest.attachments)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 flex items-center gap-1 shrink-0 transition-colors shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 7 Legal Capabilities Bar & Suggested Queries Chips */}
            <div className="px-4 py-2.5 border-t border-black/5 dark:border-[#222222] bg-black/5 dark:bg-[#050505] space-y-2">
              {/* Capability Filter Tabs */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCapability('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCapability === 'all'
                        ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white shadow-xs'
                        : 'liquid-pill text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                    }`}
                  >
                    All Modes
                  </button>
                  {LEGAL_CAPABILITIES.map(cap => (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => {
                        setSelectedCapability(cap.id);
                        if (cap.id === 'updates') {
                          setEnableWebSearch(true);
                        }
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                        selectedCapability === cap.id
                          ? 'bg-orange-500/20 dark:bg-[#7C5CFF]/25 text-orange-700 dark:text-[#a78bfa] border border-orange-500/30 dark:border-[#7C5CFF]/40 font-bold'
                          : 'liquid-pill text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      <span>{cap.icon}</span>
                      <span>{cap.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setEnableWebSearch(!enableWebSearch)}
                  className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                    enableWebSearch
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
                  }`}
                  title="Toggle Google Search live grounding for recent amendments, gazettes, and court judgments"
                >
                  <Globe className={`w-3 h-3 ${enableWebSearch ? 'animate-pulse text-blue-500' : ''}`} />
                  <span className="hidden sm:inline">{enableWebSearch ? 'Web Grounding ON' : 'Web Grounding OFF'}</span>
                </button>
              </div>

              {/* Special Scope Banner for Legal Updates */}
              {selectedCapability === 'updates' && (
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-orange-500/10 border border-blue-500/20 text-[11px] text-blue-900 dark:text-blue-200 flex flex-wrap items-center justify-between gap-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📡</span>
                    <span className="font-semibold">5-Heading Digest:</span>
                    <span className="text-slate-600 dark:text-slate-300">1. New Acts • 2. Amendments • 3. Repealed Laws • 4. Court Developments • 5. Changes to Penalties</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold">
                    Google Search Grounding Active
                  </span>
                </div>
              )}

              {/* Dynamic Prompts for Active Capability */}
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                {activePrompts.map((q, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSend(q)}
                    className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium liquid-pill text-slate-700 dark:text-[#B3B3B3] hover:text-orange-600 dark:hover:text-[#FFFFFF] dark:bg-[#151515] dark:border-[#292929] dark:hover:border-[#7C5CFF]/40 transition-colors shrink-0 cursor-pointer shadow-2xs"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Multimodal Attachment Chips Preview */}
            <AttachmentChips
              attachments={attachments}
              onRemove={removeAttachment}
              disabled={loading}
            />

            {/* Input Bar & Multi-modal Controls */}
            <div className="p-3.5 sm:p-4 border-t border-black/5 dark:border-[#222222] liquid-header dark:bg-[#0B0B0B]">
              {micError && (
                <div className="mb-2.5 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-sm">🎙️</span>
                    <span className="font-medium truncate sm:whitespace-normal">{micError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMicError(null)}
                    className="text-amber-700 dark:text-amber-400 font-bold hover:opacity-75 text-sm px-1 cursor-pointer shrink-0"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx,.txt,audio/*"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />

              {/* If Audio Recording in progress, show VoiceWaveform */}
              {isRecordingAudio ? (
                <VoiceWaveform
                  isRecording={isRecordingAudio}
                  recordingDuration={recordingDuration}
                  audioStream={audioStream}
                  onStop={() => stopAudioRecording(true)}
                  onCancel={() => stopAudioRecording(false)}
                />
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* File Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-[#7C5CFF] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                    title="Upload document, PDF, image screenshot, or audio"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  {/* Voice Input (Speech-to-Text) Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    disabled={loading}
                    className={`p-2.5 rounded-full transition-all cursor-pointer disabled:opacity-50 shrink-0 ${
                      isListeningSpeech 
                        ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-[#7C5CFF]'
                    }`}
                    title={isListeningSpeech ? "Listening... Speak your question" : "Click to speak your question"}
                  >
                    {isListeningSpeech ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Text Input Field */}
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={
                      isListeningSpeech
                        ? "Listening... Speak your legal question now..."
                        : selectedCapability === 'explain'
                        ? "Ask to explain any Section in simple citizen words..."
                        : selectedCapability === 'summarize'
                        ? "Ask to summarize an Act (e.g., BNS 2023, Motor Vehicles Act)..."
                        : selectedCapability === 'compare'
                        ? "Ask to compare two laws (e.g., IPC vs BNS, CrPC vs BNSS)..."
                        : selectedCapability === 'find'
                        ? "Describe a situation to find applicable legal sections..."
                        : selectedCapability === 'penalties'
                        ? "Ask about imprisonment, fines, bail status, and consequences..."
                        : selectedCapability === 'database'
                        ? "Query verified definitions, exceptions, and amendments..."
                        : selectedCapability === 'provisions'
                        ? "Request official bare act text and India Code portal links..."
                        : "Ask about Indian laws, penalties, compare statutes, or upload a document..."
                    }
                    className={`flex-1 px-4 py-2.5 rounded-full liquid-pill text-sm text-slate-900 dark:text-[#FFFFFF] placeholder-slate-400 dark:placeholder-[#777777] dark:bg-[#151515] dark:border-[#292929] focus:outline-none focus:ring-2 focus:ring-orange-500/40 dark:focus:ring-[#7C5CFF]/40 transition-all ${
                      isListeningSpeech ? 'ring-2 ring-red-500/50' : ''
                    }`}
                  />

                  {/* Send Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    type="submit"
                    disabled={(!input.trim() && attachments.length === 0) || loading}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-[#7C5CFF] dark:to-[#6340e6] text-white flex items-center justify-center shadow-lg shadow-orange-500/25 dark:shadow-[#7C5CFF]/25 ring-1 ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
