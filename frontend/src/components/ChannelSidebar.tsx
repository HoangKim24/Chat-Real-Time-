import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import { useAuthStore } from '../store/useAuthStore';
import { useConversationStore } from '../store/useConversationStore';
import { useServerStore } from '../store/useServerStore';

interface ChannelSidebarProps {
  onChannelClick?: () => void;
}

const ChannelSidebar = ({ onChannelClick }: ChannelSidebarProps) => {
  const { user, logout } = useAuthStore();
  const { conversations, activeConversation, fetchConversations, selectConversation } = useConversationStore();
  const { activeServer, channels, createChannel } = useServerStore();

  const [isWorkspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddChannelModalOpen, setAddChannelModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleChannelClick = (conv: typeof conversations[0]) => {
    selectConversation(conv);
    onChannelClick?.();
    setIsMobileMenuOpen(false);
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !activeServer) return;
    await createChannel({
      channelName: newChannelName,
      type: 0,
      serverId: activeServer.id,
    });
    setNewChannelName('');
    setAddChannelModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-3 left-3 z-30 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 shadow-lg transition-colors"
        title="Bật/tắt thanh bên"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className={`w-64 bg-slate-900/60 backdrop-blur-xl flex flex-col h-full shrink-0 border-r border-white/5 animate-fade-in fixed md:relative z-20 transition-transform md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          onClick={() => setWorkspaceModalOpen(true)}
          className="h-16 flex items-center px-4 shrink-0 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 truncate flex-1 block">
             <div className="relative w-7 h-7 shrink-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg blur-sm opacity-40 mix-blend-screen group-hover:opacity-60 transition-opacity"></div>
               <div className="relative w-full h-full bg-slate-800 rounded-lg flex items-center justify-center shadow-inner border border-white/10 group-hover:scale-105 active:scale-90 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="text-cyan-400 w-3.5 h-3.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /><circle cx="8" cy="11.5" r="1.5" fill="currentColor"/><circle cx="12" cy="11.5" r="1.5" fill="currentColor"/><circle cx="16" cy="11.5" r="1.5" fill="currentColor"/></svg>
               </div>
             </div>
             
             <div className="flex flex-col items-start truncate overflow-hidden">
               <span className="text-[15px] font-bold text-white leading-none truncate w-full">{activeServer?.serverName || 'Trụ sở Chatflow'}</span>
             </div>
          </div>
          
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" className="text-slate-500 group-hover:text-white transition-all duration-300 shrink-0 ml-1 w-3 h-3">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <Modal 
          isOpen={isWorkspaceModalOpen} 
          onClose={() => setWorkspaceModalOpen(false)}
          title="Chi tiết không gian làm việc"
        >
           <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h4 className="font-semibold text-white mb-1">{activeServer?.serverName || 'Trụ sở phát triển Chatflow'}</h4>
                <p className="text-sm text-white/50">{activeServer?.description || 'Nơi cùng nhau xây dựng tương lai của nhắn tin.'}</p>
              </div>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-cyan-400">
                 <span className="font-medium text-sm">Mời mọi người</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.2 0-2.3.5-3.1 1.4A4 4 0 0 0 1 19v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white">
                 <span className="font-medium text-sm">Cài đặt không gian</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
              <div className="h-[1px] bg-white/10 my-2"></div>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-500">
                 <span className="font-medium text-sm">Rời khỏi không gian</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
           </div>
        </Modal>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 scrollbar-thin">
          <div className="mx-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
            Không gian hiện tại: <span className="text-white font-semibold">{activeServer?.serverName || 'Trụ sở Chatflow'}</span>
          </div>
          {/* Text Channels from Server */}
          {channels.length > 0 && (
            <div>
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 hover:text-slate-300 transition-colors cursor-pointer group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10" className="mr-1.5 transition-transform group-hover:rotate-90 w-2.5 h-2.5"><polyline points="9 18 15 12 9 6"/></svg>
                Kênh máy chủ <span className="ml-1 text-slate-500">({channels.length})</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setAddChannelModalOpen(true); }}
                  className="ml-auto p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
              <div className="space-y-0.5">
                {channels.map(ch => (
                  <div 
                    key={ch.id}
                    className="flex items-center text-slate-400 hover:text-slate-200 hover:bg-white/5 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-150 group"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="mr-2 text-slate-500 group-hover:text-slate-400 transition-colors w-4 h-4"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                    <span className="text-sm font-medium truncate">{ch.channelName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversations (DMs / Groups) */}
          <div>
            <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 hover:text-slate-300 transition-colors cursor-pointer group">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="10" height="10" className="mr-1.5 transition-transform group-hover:rotate-90 w-2.5 h-2.5"><polyline points="9 18 15 12 9 6"/></svg>
              Hội thoại <span className="ml-1 text-slate-500">({conversations.length})</span>
            </div>
            <div className="space-y-0.5">
              {conversations.map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => handleChannelClick(conv)}
                  className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer transition-all active:scale-95 ${
                    activeConversation?.id === conv.id 
                      ? 'text-white bg-slate-800/80' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="mr-2 text-slate-400 w-4 h-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span className="text-sm font-medium truncate">{conv.name || `Hội thoại #${conv.id}`}</span>
                </div>
              ))}

              {conversations.length === 0 && (
                <div className="mx-2 mt-1 p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-slate-500 leading-relaxed">
                  Chưa có hội thoại nào. Hãy tạo workspace hoặc mời thêm thành viên để bắt đầu.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Area */}
        <div className="h-[72px] bg-slate-900/80 mt-auto flex items-center px-4 shrink-0 border-t border-white/5">
          <div 
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center flex-1 min-w-0 pr-2 cursor-pointer group hover:bg-white/5 p-1 -ml-1 rounded-md transition-all active:scale-95"
          >
            <div className="relative shrink-0">
              <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'Người dùng'}&background=06b6d4&color=fff`} alt="Ảnh đại diện" className="relative w-7 h-7 rounded-full border border-transparent group-hover:border-white/20 transition-all duration-300" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="ml-2 flex flex-col justify-center min-w-0">
              <span className="text-sm font-semibold text-white truncate leading-none">{user?.displayName || user?.username || 'Người dùng'}</span>
              <span className="text-[10px] text-slate-500 truncate mt-1 tracking-tight">@{user?.username || 'nguoi-dung'}</span>
            </div>
          </div>
          
          <div className="flex items-center text-slate-400 shrink-0 gap-1">
            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90" title="Cài đặt người dùng">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 active:scale-90" 
              title="Đăng xuất"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>

        <Modal 
          isOpen={isProfileModalOpen} 
          onClose={() => setProfileModalOpen(false)}
          title="Hồ sơ của tôi"
        >
          <div className="flex flex-col items-center">
             <div className="relative mb-6">
               <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'Người dùng'}&background=06b6d4&color=fff&size=200`} alt="Ảnh đại diện" className="w-28 h-28 rounded-full border-4 border-[#0F1219]" />
               <div className="absolute bottom-1 right-1 w-6 h-6 bg-cyan-400 rounded-full border-4 border-[#0F1219]"></div>
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-1">{user?.displayName || user?.username || 'Người dùng'}</h3>
             <span className="text-sm font-medium text-white/50 bg-white/5 px-3 py-1 rounded-full mb-6">@{user?.username || 'nguoi-dung'}</span>

             <div className="w-full space-y-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-1">Địa chỉ email</span>
                  <span className="text-sm text-cyan-400">{user?.email || 'Không có'}</span>
                </div>
                {user?.bio && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-widest block mb-1">Giới thiệu</span>
                    <span className="text-sm text-white/80">{user.bio}</span>
                  </div>
                )}
              </div>
           </div>
        </Modal>

        <Modal
          isOpen={isAddChannelModalOpen}
          onClose={() => setAddChannelModalOpen(false)}
          title="Tạo kênh văn bản"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest pl-1">Tên kênh</label>
              <input 
                type="text" 
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateChannel(); }}
                className="bg-black/30 border border-white/5 focus:border-cyan-400/50 rounded-xl p-3 text-white outline-none w-full" 
                placeholder="# kenh-moi" 
                autoFocus 
              />
            </div>
            <button 
              onClick={handleCreateChannel}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all mt-4"
            >Tạo kênh</button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ChannelSidebar;
