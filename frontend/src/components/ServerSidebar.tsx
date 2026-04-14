import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { useServerStore } from '../store/useServerStore';

interface ServerSidebarProps {
  onHomeClick?: () => void;
  activeView?: 'chat' | 'friends';
}

const ServerSidebar = ({ onHomeClick, activeView }: ServerSidebarProps) => {
  const { servers, activeServer, createServer, selectServer, fetchServers } = useServerStore();
  const [isAddServerModalOpen, setAddServerModalOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerDescription, setNewServerDescription] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Bạn có lời mời mới', detail: 'Lời mời tham gia workspace vừa được gửi đến bạn.', time: '2 phút trước' },
    { id: 2, title: 'Kênh mới được tạo', detail: 'Kênh #thong-bao đã được thêm vào workspace.', time: '15 phút trước' },
  ]);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, [isNotificationsOpen]);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  const handleCreateServer = async () => {
    if (!newServerName.trim()) return;
    await createServer({
      serverName: newServerName,
      description: newServerDescription || undefined,
    });
    setNewServerName('');
    setNewServerDescription('');
    setAddServerModalOpen(false);
  };

  return (
    <div className="w-[64px] h-full bg-slate-950 flex flex-col items-center py-4 gap-3 shrink-0 z-20 shadow-2xl animate-fade-in border-r border-white/5 hidden sm:flex">
      <div
        onClick={onHomeClick}
        title={activeView === 'friends' ? 'Bấm để quay về Chat' : 'Bấm để mở Bạn bè'}
        className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[20px] hover:rounded-[12px] cursor-pointer flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20 active:scale-90 transition-all duration-300 group"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 group-hover:rotate-12 transition-transform"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-6px] z-[60]">
          {activeView === 'friends' ? 'Quay về Chat' : 'Mở Bạn bè'}
        </span>
      </div>

      <div className="w-10 h-[2px] bg-white/5 rounded-full my-1"></div>

      <div ref={notificationsRef} className="relative group w-full flex justify-center mt-1">
        <div
          className="w-10 h-10 bg-white/5 border border-transparent rounded-[20px] hover:rounded-[12px] cursor-pointer flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500 transition-all duration-300 active:scale-90 relative group"
          onClick={() => setNotificationsOpen(!isNotificationsOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-cyan-500 text-[9px] text-slate-950 font-black flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>

        {isNotificationsOpen && (
          <div className="absolute left-16 top-0 w-80 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden transform animate-fade-in origin-top-left">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white tracking-wide">Thông báo</h3>
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider"
              >
                Đánh dấu tất cả
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="p-5 text-center text-sm text-slate-500">Không có thông báo mới</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setNotificationsOpen(false)}
                      className="w-full text-left p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{item.detail}</div>
                      <div className="text-[11px] text-cyan-400/80 mt-2">{item.time}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {servers.map((server) => (
        <div key={server.id} className="relative group w-full flex justify-center">
          {activeServer?.id === server.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-lg"></div>
          )}

          <div
            onClick={() => selectServer(server)}
            className={`w-10 h-10 cursor-pointer flex items-center justify-center text-white font-bold active:scale-90 transition-all duration-300 ${
              activeServer?.id === server.id
                ? 'bg-indigo-500 rounded-[12px] shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 border border-transparent rounded-[20px] hover:rounded-[12px] hover:bg-indigo-500'
            }`}
          >
            {(server.serverName || 'S').charAt(0).toUpperCase()}
          </div>
        </div>
      ))}

      <div
        onClick={() => setAddServerModalOpen(true)}
        className="w-10 h-10 bg-transparent border border-white/10 border-dashed rounded-[20px] hover:rounded-[12px] cursor-pointer flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-200 mt-1 hover:border-transparent active:scale-90"
      >
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
      </div>

      <Modal
        isOpen={isAddServerModalOpen}
        onClose={() => setAddServerModalOpen(false)}
        title="Tạo không gian làm việc"
      >
        <div className="text-center mb-6">
          <p className="text-sm text-white/60 mb-6">Không gian làm việc là nơi bạn và bạn bè trò chuyện. Hãy tạo của riêng bạn và bắt đầu kết nối.</p>

          <div className="group cursor-pointer mx-auto w-24 h-24 rounded-full border-2 border-dashed border-white/20 hover:border-cyan-400 flex flex-col items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" className="mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            <span className="text-xs font-semibold uppercase tracking-widest">Tải lên</span>
          </div>

          <div className="flex flex-col gap-4 text-left w-full">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest pl-1">
                Tên không gian làm việc
              </label>
              <input
                type="text"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                className="bg-black/30 border border-white/5 focus:bg-black/50 focus:border-cyan-400/50 rounded-xl p-3 shadow-inner text-white outline-none transition-all duration-300 w-full placeholder-white/20"
                placeholder="Ví dụ: Máy chủ của Kim"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-widest pl-1">
                Mô tả (không bắt buộc)
              </label>
              <input
                type="text"
                value={newServerDescription}
                onChange={(e) => setNewServerDescription(e.target.value)}
                className="bg-black/30 border border-white/5 focus:bg-black/50 focus:border-cyan-400/50 rounded-xl p-3 shadow-inner text-white outline-none transition-all duration-300 w-full placeholder-white/20"
                placeholder="Không gian này dùng để làm gì?"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button onClick={() => setAddServerModalOpen(false)} className="px-4 py-2.5 rounded-xl font-medium text-white/60 hover:text-white transition-colors">Quay lại</button>
          <button
            onClick={handleCreateServer}
            className="px-6 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20 transition-all"
          >
            Tạo
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ServerSidebar;
