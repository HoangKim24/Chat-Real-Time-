import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useMessageStore } from '../store/useMessageStore';
import { useConversationStore } from '../store/useConversationStore';

interface ChatAreaProps {
  onChannelClick?: () => void;
}

interface Reaction {
  emoji: string;
  count: number;
  me: boolean;
}

interface LocalMessage {
  id: number;
  senderId: number;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  isMe: boolean;
  reactions: Reaction[];
  replyTo?: {
    user: string;
    content: string;
  };
  type?: 'system' | 'default';
  isEdited?: boolean;
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
}

const ChatArea = ({ onChannelClick: _onChannelClick }: ChatAreaProps) => {
  const { user } = useAuthStore();
  const { messages: apiMessages, fetchMessages, sendMessage, editMessage, deleteMessage, isLoading } = useMessageStore();
  const { activeConversation } = useConversationStore();
  
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [replyingTo, setReplyingTo] = useState<LocalMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<LocalMessage | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation?.id, fetchMessages]);

  // Transform API messages to local format
  useEffect(() => {
    const transformed: LocalMessage[] = apiMessages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName: msg.senderName || 'Người dùng',
      senderAvatar: msg.senderAvatar || `https://ui-avatars.com/api/?name=${msg.senderName || 'Người dùng'}&background=1f2937&color=fff`,
      content: msg.content,
      createdAt: msg.createdAt,
      isMe: msg.senderId === user?.id,
      reactions: [],
      isEdited: msg.isEdited,
    }));
    setLocalMessages(transformed);
  }, [apiMessages, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'bây giờ';
      if (diffMins < 60) return `${diffMins}p trước`;
      if (diffHours < 24) return `${diffHours}h trước`;
      if (diffDays < 7) return `${diffDays}d trước`;
      
      return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;

    const result = await sendMessage({
      content: messageInput,
      conversationId: activeConversation?.id ?? null,
      receiverId: null,
      channelId: null,
    });

    if (result) {
      setMessageInput('');
      setReplyingTo(null);
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessage || editContent.trim() === '') return;
    
    const success = await editMessage({
      messageId: editingMessage.id,
      senderId: user?.id ?? 0,
      content: editContent,
      conversationId: activeConversation?.id ?? 0,
    });

    if (success) {
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    await deleteMessage(messageId);
  };

  const handleReaction = (messageId: number, emoji: string) => {
    setLocalMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.me) {
            const newReactions = msg.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, me: false } : r).filter(r => r.count > 0);
            return { ...msg, reactions: newReactions };
          } else {
            const newReactions = msg.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, me: true } : r);
            return { ...msg, reactions: newReactions };
          }
        } else {
          return { ...msg, reactions: [...msg.reactions, { emoji, count: 1, me: true }] };
        }
      }
      return msg;
    }));
    setShowEmojiPicker(null);
  };

  const handleReply = (msg: LocalMessage) => {
    setReplyingTo(msg);
    const input = document.getElementById('chat-message-input') as HTMLInputElement;
    input?.focus();
  };

  const channelName = activeConversation?.name || 'chung';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent animate-fade-in">
      {/* Header */}
      <div className="h-16 flex items-center px-4 pl-14 md:px-8 shrink-0 border-b border-white/5 bg-slate-900/40 backdrop-blur-3xl z-10 shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-xl">#</span>
            <h3 className="text-white font-bold text-base tracking-wide">{channelName}</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">Thảo luận và phản hồi trong không gian làm việc</span>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <button className="text-slate-400 hover:text-cyan-400 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 active:scale-90" title="Gọi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="w-[18px] h-[18px]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </button>
          <div className="relative group hidden md:block">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Tìm kiếm..." className="bg-slate-800/50 text-sm rounded-xl cursor-text w-48 pl-9 pr-4 py-1.5 text-white/90 outline-none border border-transparent focus:border-cyan-400/30 ring-0 focus:ring-0 focus:w-64 focus:bg-slate-800/80 transition-all duration-300 placeholder-slate-500 font-medium" />
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 flex flex-col gap-1 relative scrollbar-thin">
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-400 text-sm">Đang tải tin nhắn...</span>
          </div>
        )}

        {/* No conversation selected */}
        {!activeConversation && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-3xl flex items-center justify-center">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40" className="text-slate-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-white/60 mb-1">Chọn một hội thoại</h3>
              <p className="text-sm text-slate-500">Chọn một kênh hoặc hội thoại để bắt đầu trò chuyện</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {activeConversation && (
          <div className="flex flex-col gap-0.5 mt-auto">
            {localMessages.map(msg => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-4 animate-fade-in relative">
                    <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 -z-10"></div>
                    <span className="text-[11px] font-medium text-slate-400 bg-[#0F172A] px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {msg.content} <span className="text-white/20 text-[10px] ml-1">{formatTime(msg.createdAt)}</span>
                    </span>
                  </div>
                );
              }
              return (
              <div key={msg.id} className={`flex items-start gap-3 group animate-slide-up py-1.5 px-2 hover:bg-white/[0.02] rounded-lg transition-colors ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                
                {!msg.isMe && (
                  <div className="relative shrink-0 mt-1">
                    <img src={msg.senderAvatar} alt="avatar" className="w-9 h-9 rounded-xl shadow-lg border border-white/10" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F172A]"></div>
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  {/* Name & Time */}
                  {!msg.isMe && (
                     <div className="flex items-baseline space-x-2 mb-1.5 px-1">
                       <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors cursor-pointer">{msg.senderName}</span>
                       <span className="text-[11px] text-slate-500 font-medium" title={new Date(msg.createdAt).toLocaleString()}>{formatTime(msg.createdAt)}</span>
                       {msg.isEdited && <span className="text-[10px] text-slate-600 italic">(sửa)</span>}
                     </div>
                  )}
                  
                  {msg.isMe && (
                     <div className="flex items-center space-x-2 mb-1.5 px-1 justify-end">
                       <span className="text-[11px] text-slate-500 font-medium" title={new Date(msg.createdAt).toLocaleString()}>{formatTime(msg.createdAt)}</span>
                       {msg.isEdited && <span className="text-[10px] text-slate-600 italic">(sửa)</span>}
                       <span className="text-[10px] text-cyan-400/70 font-semibold" title="Đã đọc">✓✓</span>
                     </div>
                  )}

                  {/* Chat Bubble & Actions */}
                  <div className={`relative group/msg flex items-center ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      {/* Reply Context */}
                      {msg.replyTo && (
                        <div className={`mb-1 px-3 py-1 bg-white/5 border-l-2 border-cyan-500 rounded-lg text-[13px] text-slate-400 italic max-w-full truncate flex items-center gap-2 opacity-80 ${msg.isMe ? 'mr-1' : 'ml-1'}`}>
                          <span className="font-bold text-cyan-500/80 not-italic text-[11px] uppercase tracking-tighter">Trả lời {msg.replyTo.user}:</span>
                          <span className="truncate">{msg.replyTo.content}</span>
                        </div>
                      )}
                      
                      {/* Edit Mode */}
                      {editingMessage?.id === msg.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleEditMessage(); if (e.key === 'Escape') { setEditingMessage(null); setEditContent(''); } }}
                            className="bg-slate-800 border border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-white outline-none min-w-[200px]"
                            autoFocus
                          />
                          <button onClick={handleEditMessage} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold">Lưu</button>
                          <button onClick={() => { setEditingMessage(null); setEditContent(''); }} className="text-slate-400 hover:text-white text-xs font-bold">Hủy</button>
                        </div>
                      ) : (
                        <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                          msg.isMe 
                          ? 'bg-cyan-600 text-white rounded-br-sm' 
                          : 'bg-slate-800/80 text-slate-200 rounded-bl-sm hover:bg-slate-800'
                        }`}>
                          {msg.content}
                        </div>
                      )}
                    </div>

                    {/* Message Actions (Hover) */}
                    <div className={`absolute top-0 flex items-center bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 opacity-0 group-hover/msg:opacity-100 transition-all duration-300 p-1 pointer-events-none group-hover/msg:pointer-events-auto z-20 ${msg.isMe ? 'right-0 -translate-y-[110%]' : 'left-0 -translate-y-[110%]'}`}>
                      <div className="relative">
                        <button 
                          onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Thêm phản ứng"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                        </button>
                        
                        {showEmojiPicker === msg.id && (
                          <div className="absolute bottom-full mb-3 left-0 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2.5 flex gap-2.5 shadow-2xl z-50 animate-fade-in min-w-max">
                            {['🔥', '✨', '⚡', '👍', '❤️', '😂', '😄', '😢', '😡', '😭'].map(emoji => (
                              <button 
                                key={emoji} 
                                onClick={() => handleReaction(msg.id, emoji)}
                                className="hover:scale-150 active:scale-95 transition-all p-1 text-xl shrink-0"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleReply(msg)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Trả lời"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="w-3.5 h-3.5"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                      </button>
                      {msg.isMe && (
                        <>
                          <button 
                            onClick={() => { setEditingMessage(msg); setEditContent(msg.content); }}
                            className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Chỉnh sửa"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Xóa"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </>
                      )}
                    </div>

                  </div>

                  {/* Display Reactions */}
                  {msg.reactions.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 mt-1 px-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      {msg.reactions.map(r => (
                        <button 
                          key={r.emoji}
                          onClick={() => handleReaction(msg.id, r.emoji)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black transition-all ${
                            r.me 
                            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/10' 
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-sm">{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Premium Floating Input Box */}
      {activeConversation && (
        <div className="px-4 md:px-8 pb-4 pt-1 shrink-0">
          {messageInput.length > 0 && (
            <div className="mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1 px-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>Đang soạn...
            </div>
          )}
          {replyingTo && (
             <div className="bg-slate-800/50 backdrop-blur-md border-t border-x border-white/5 px-4 py-2 rounded-t-2xl flex items-center justify-between animate-fade-in translate-y-1">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider leading-none mb-1">Đang trả lời {replyingTo.senderName || (replyingTo.isMe ? user?.username : 'Không rõ')}</span>
                    <span className="text-xs text-slate-400 truncate">{replyingTo.content}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
             </div>
          )}
          <div className={`bg-slate-900/70 backdrop-blur-xl flex flex-col gap-2.5 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-white/5 focus-within:border-cyan-400/30 focus-within:ring-2 focus-within:ring-cyan-500/25 transition-all duration-300 ${replyingTo ? 'rounded-b-3xl border-t-0' : 'rounded-3xl'}`}>
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.25em] font-black text-slate-500">
              <span>Soạn tin nhắn</span>
              <span className="text-cyan-400/80">Enter để gửi</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="text-slate-400 hover:text-cyan-400 p-2 hover:bg-white/5 rounded-xl transition-all shrink-0 active:scale-90" title="Đính kèm tệp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="w-4 h-4"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              
              <input
                id="chat-message-input"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder={`Nhắn tin trong ${channelName}`}
                className="bg-transparent border-none text-slate-100 outline-none w-full placeholder-slate-500 text-[15px] flex-1 min-w-0 py-2.5"
              />

              <div className="flex items-center gap-1 shrink-0">
                <div className="relative">
                  <button 
                    onClick={() => setShowEmojiPicker(showEmojiPicker === -1 ? null : -1)}
                    className="text-slate-400 hover:text-cyan-400 p-2 hover:bg-white/5 rounded-xl transition-all active:scale-90" title="Thêm biểu tượng cảm xúc"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  </button>

                  {showEmojiPicker === -1 && (
                    <div className="absolute bottom-full mb-2 right-0 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-3 flex flex-wrap gap-2 w-64 shadow-2xl z-50 animate-fade-in">
                      {['🔥', '✨', '⚡', '👍', '❤️', '😂', '😄', '😢', '😡', '🎉', '🚀', '💯'].map(emoji => (
                        <button 
                          key={emoji} 
                          onClick={() => { setMessageInput(prev => prev + emoji); setShowEmojiPicker(null); }}
                          className="hover:scale-125 active:scale-95 transition-all p-2 text-lg shrink-0 hover:bg-white/10 rounded-xl"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleSendMessage}
                  disabled={messageInput.trim() === ''}
                  className="bg-gradient-to-br from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 text-white px-4 h-10 rounded-2xl transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center justify-center font-bold ml-auto disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-400/50"
                >
                  <span className="hidden sm:inline mr-1.5 text-xs font-black uppercase tracking-wider">Gửi</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className="w-3.5 h-3.5"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4429026 L1.15159189,1.4429026 C0.342644975,2.22844149 0.342644975,3.50588171 0.8376543,4.13399899 C0.8376543,4.13399899 0.994623095,4.31193633 1.15159189,4.5762186 L3.03521743,11.0172115 C3.03521743,11.4885037 3.34915502,11.6889879 3.50612381,11.6889879 L16.6915026,12.4744748 Z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
