import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  MessageSquare, 
  User, 
  Check, 
  CheckCheck, 
  Loader2, 
  Search, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppUser } from '../../services/authService';
import { chatService, ChatDoc, ChatMessageDoc } from '../../services/chatService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface NetworkingChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  targetAuthor?: { authorId: string; authorName: string } | null;
}

export const NetworkingChatModal: React.FC<NetworkingChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetAuthor,
}) => {
  const [chats, setChats] = useState<ChatDoc[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDoc | null>(null);
  const [messages, setMessages] = useState<ChatMessageDoc[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [participantNames, setParticipantNames] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Subscribe to user's conversation list
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const unsubscribe = chatService.subscribeToMyChats(currentUser.uid, (chatList) => {
      setChats(chatList);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, currentUser]);

  // 2. Handle direct targetAuthor navigation (e.g. from "Message Founder" button on news item)
  useEffect(() => {
    if (!isOpen || !currentUser || !targetAuthor || !targetAuthor.authorId) return;

    // Check if chat already open
    if (selectedChat?.participants.includes(targetAuthor.authorId)) return;

    const startDirectChat = async () => {
      try {
        setStartingChat(true);
        const result = await chatService.createOrGetChat(targetAuthor.authorId);
        
        // Cache author name
        setParticipantNames((prev) => ({
          ...prev,
          [targetAuthor.authorId]: targetAuthor.authorName,
        }));

        setSelectedChat({
          id: result.chatId,
          participants: [currentUser.uid, targetAuthor.authorId],
          participantsKey: '',
          lastMessage: '',
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed to open chat with author:', err);
      } finally {
        setStartingChat(false);
      }
    };

    startDirectChat();
  }, [isOpen, currentUser, targetAuthor]);

  // 3. Subscribe to messages when a chat is selected
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const unsubscribe = chatService.subscribeToMessages(selectedChat.id, (msgs) => {
      setMessages(msgs);

      // Auto mark unread messages as read
      const unreadForMe = msgs.filter(
        (m) => m.senderId !== currentUser.uid && !m.readBy.includes(currentUser.uid)
      );

      if (unreadForMe.length > 0) {
        chatService.markAsRead(selectedChat.id, currentUser.uid, unreadForMe);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedChat, currentUser]);

  // 4. Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5. Resolve recipient names lazily
  useEffect(() => {
    if (!currentUser || chats.length === 0) return;

    chats.forEach(async (c) => {
      const otherUid = c.participants.find((p) => p !== currentUser.uid);
      if (otherUid && !participantNames[otherUid]) {
        try {
          const userSnap = await getDoc(doc(db, 'users', otherUid));
          if (userSnap.exists()) {
            const name = userSnap.data()?.displayName || 'Startup Founder';
            setParticipantNames((prev) => ({ ...prev, [otherUid]: name }));
          }
        } catch {
          // ignore
        }
      }
    });
  }, [chats, currentUser, participantNames]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || !currentUser || sending) return;

    const text = messageInput.trim();
    setMessageInput('');

    try {
      setSending(true);
      await chatService.sendMessage(selectedChat.id, currentUser.uid, text);
    } catch (err: any) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const getRecipientName = (chat: ChatDoc) => {
    if (!currentUser) return 'Founder';
    const otherUid = chat.participants.find((p) => p !== currentUser.uid);
    if (!otherUid) return 'Founder';
    return participantNames[otherUid] || 'Startup Peer';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl h-[650px] max-h-[90vh] bg-white dark:bg-[#0E0E0E] rounded-3xl border border-slate-200 dark:border-[#262626] shadow-2xl flex flex-col md:flex-row overflow-hidden text-slate-800 dark:text-white"
      >
        {/* Left Sidebar: Conversations List */}
        <div className={`w-full md:w-80 border-r border-slate-200 dark:border-[#222222] flex flex-col bg-slate-50/50 dark:bg-[#0B0B0B] ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold">Networking Chats</h2>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {startingChat && (
              <div className="p-3 text-xs text-indigo-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting with founder...</span>
              </div>
            )}

            {chats.length === 0 && !startingChat ? (
              <div className="text-center py-12 px-4 space-y-2 text-slate-400 dark:text-[#666666]">
                <MessageSquare className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No active chats yet.</p>
                <p className="text-[11px]">Click "Message Founder" on any approved news story to start networking.</p>
              </div>
            ) : (
              chats.map((chat) => {
                const isSelected = selectedChat?.id === chat.id;
                const otherUid = chat.participants.find((p) => p !== currentUser?.uid) || '';
                const recipientName = participantNames[otherUid] || 'Startup Member';
                const unread = chat.unreadCounts?.[currentUser?.uid || ''] || 0;

                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-slate-900 dark:text-white border border-indigo-500/30'
                        : 'hover:bg-slate-100 dark:hover:bg-[#161616] text-slate-600 dark:text-[#999999]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {recipientName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {recipientName}
                        </span>
                        {unread > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-[#777777] truncate mt-0.5">
                        {chat.lastMessage || 'Direct connection'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Thread Area */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#0E0E0E] ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden text-xs text-indigo-500 font-bold"
                  >
                    &larr; Back
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {getRecipientName(selectedChat).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {getRecipientName(selectedChat)}
                    </h3>
                    <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Verified Founder &bull; Realtime Messaging</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 dark:text-[#666666] space-y-2">
                    <Sparkles className="w-6 h-6 mx-auto opacity-50" />
                    <p className="text-xs">No messages yet. Say hello and introduce your startup!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.uid;
                    const isRead = msg.readBy && msg.readBy.length > 1;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-orange-500 dark:bg-[#7C5CFF] text-white rounded-br-sm'
                              : 'bg-slate-100 dark:bg-[#181818] text-slate-800 dark:text-[#E0E0E0] border border-slate-200/80 dark:border-[#282828] rounded-bl-sm'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>

                        {/* Read Receipt indicator */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-[#666666] mt-0.5 px-1">
                          {isMe && (
                            isRead ? (
                              <CheckCheck className="w-3 h-3 text-indigo-400" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" />
                            )
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-[#222222] flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#282828] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sending}
                  className="p-2.5 rounded-2xl bg-orange-500 dark:bg-[#7C5CFF] text-white disabled:opacity-40 cursor-pointer shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-24 px-6 space-y-3 text-slate-400 dark:text-[#666666]">
              <MessageSquare className="w-12 h-12 mx-auto opacity-30 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-[#AAAAAA]">
                Direct Founder Networking
              </h3>
              <p className="text-xs max-w-xs mx-auto">
                Select a conversation from the left to read and send messages.
              </p>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};
