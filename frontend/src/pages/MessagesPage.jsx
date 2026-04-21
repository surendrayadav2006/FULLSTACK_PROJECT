import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getConversations, getMessages, sendMessage } from '../services/messageService';
import Avatar from '../components/ui/Avatar';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function MessagesPage() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket() || {};
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (msg) => {
      if (activeChat && (msg.sender._id === activeChat._id || msg.sender === activeChat._id)) {
        setMessages(prev => [...prev, msg]);
      }
      loadConversations();
    });
    socket.on('userTyping', ({ from }) => {
      if (activeChat && from === activeChat._id) setTyping(true);
    });
    socket.on('userStopTyping', ({ from }) => {
      if (activeChat && from === activeChat._id) setTyping(false);
    });
    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [socket, activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const { data } = await getConversations();
      setConversations(data.conversations);
    } catch {} finally { setLoading(false); }
  };

  const selectChat = async (chatUser) => {
    setActiveChat(chatUser);
    try {
      const { data } = await getMessages(chatUser._id);
      setMessages(data.messages);
    } catch {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    try {
      if (socket) {
        socket.emit('sendMessage', { receiver: activeChat._id, content: newMessage });
        socket.emit('stopTyping', { to: activeChat._id });
      } else {
        const { data } = await sendMessage({ receiver: activeChat._id, content: newMessage });
        setMessages(prev => [...prev, data.message]);
      }
      setNewMessage('');
      loadConversations();
    } catch {}
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && activeChat) {
      socket.emit('typing', { to: activeChat._id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', { to: activeChat._id });
      }, 2000);
    }
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Messages</h1>
      </motion.div>

      <div className="glass rounded-2xl overflow-hidden flex" style={{ height: 'calc(100vh - 12rem)' }}>
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 dark:border-dark-700 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 dark:border-dark-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search conversations..." className="input-field pl-9 py-2 text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-3 space-y-3">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                <MessageCircle className="mx-auto mb-2 text-gray-300" size={32} />
                No conversations yet
              </div>
            ) : (
              conversations.map(conv => (
                <button key={conv.conversationId} onClick={() => selectChat(conv.user)}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors text-left ${
                    activeChat?._id === conv.user?._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                  <Avatar src={conv.user?.avatar} name={conv.user?.name} size="md"
                    online={onlineUsers?.includes(conv.user?._id)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-dark-900 dark:text-white truncate">{conv.user?.name}</p>
                      <span className="text-[10px] text-gray-400 shrink-0">{formatTime(conv.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose from your connections to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex items-center gap-3">
                <Avatar src={activeChat.avatar} name={activeChat.name} size="md"
                  online={onlineUsers?.includes(activeChat._id)} />
                <div>
                  <p className="font-semibold text-dark-900 dark:text-white">{activeChat.name}</p>
                  <p className="text-xs text-gray-500">
                    {typing ? <span className="text-primary-500">typing...</span>
                      : onlineUsers?.includes(activeChat._id) ? <span className="text-emerald-500">Online</span> : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                  const isMine = (msg.sender?._id || msg.sender) === (user?.id || user?._id);
                  return (
                    <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                        isMine ? 'bg-gradient-primary text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-dark-700 text-dark-900 dark:text-white rounded-bl-md'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                          {formatTime(msg.createdAt)}
                          {isMine && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-dark-700 flex gap-3">
                <input type="text" placeholder="Type a message..." value={newMessage} onChange={handleTyping}
                  className="input-field flex-1 py-2.5" />
                <button type="submit" disabled={!newMessage.trim()}
                  className="gradient-btn px-4 rounded-xl disabled:opacity-50">
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
