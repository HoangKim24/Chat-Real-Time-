import { useEffect, useMemo, useState } from 'react';
import { useConversationStore } from '../store/useConversationStore';
import { useServerStore } from '../store/useServerStore';

const RightSidebar = () => {
  const { activeConversation, members: convMembers, fetchMembers: fetchConvMembers } = useConversationStore();
  const { activeServer, members: serverMembers, fetchMembers: fetchServerMembers } = useServerStore();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (activeConversation?.id) {
      fetchConvMembers(activeConversation.id);
    }
  }, [activeConversation?.id, fetchConvMembers]);

  useEffect(() => {
    if (activeServer?.id) {
      fetchServerMembers(activeServer.id);
    }
  }, [activeServer?.id, fetchServerMembers]);

  const members = activeServer ? serverMembers : convMembers;
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredMembers = useMemo(() => {
    if (!normalizedKeyword) return members;

    return members.filter((member) => {
      const display = (member.displayName || '').toLowerCase();
      const username = (member.username || '').toLowerCase();
      return display.includes(normalizedKeyword) || username.includes(normalizedKeyword);
    });
  }, [members, normalizedKeyword]);

  const isOnline = (id: number, userId: number) => ((id || userId) % 3) !== 0;

  const onlineMembers = filteredMembers.filter((member) => isOnline(member.id, member.userId));
  const offlineMembers = filteredMembers.filter((member) => !isOnline(member.id, member.userId));

  const contextLabel = activeServer ? activeServer.serverName : activeConversation?.name;

  return (
    <div className="w-72 bg-slate-900/45 flex-col h-full shrink-0 border-l border-white/5 pb-4 hidden lg:flex backdrop-blur-xl">
      {/* Header */}
      <div className="h-16 flex items-center px-4 shrink-0 border-b border-white/5 justify-between">
        <h3 className="text-sm font-semibold text-white/90">Thành viên <span className="text-xs text-white/50 ml-1">({members.length})</span></h3>
        <span className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/80 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-2 py-0.5">
          Trực tuyến {onlineMembers.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">Không gian</div>
          <div className="text-sm font-semibold text-white truncate">{contextLabel || 'Chưa chọn cuộc trò chuyện'}</div>
        </div>

        <label className="block">
          <span className="sr-only">Tìm thành viên</span>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm thành viên..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-200 text-xs font-semibold py-2 hover:bg-cyan-500/20 transition-colors">
            Mời thêm
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 text-slate-200 text-xs font-semibold py-2 hover:bg-white/10 transition-colors">
            Quản lý vai trò
          </button>
        </div>
        
        <div>
          <div className="flex items-center text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2 px-2">
            <span>Đang hoạt động — {onlineMembers.length}</span>
          </div>
 
          <div className="space-y-1">
            {onlineMembers.map((member) => (
              <div key={member.id || member.userId} className="flex items-center hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors duration-200 group border border-transparent hover:border-cyan-400/20">
                <div className="relative shrink-0">
                  <img 
                    src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.displayName || member.username}&background=1f2937&color=fff`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-cyan-400/30 transition-colors" 
                  />
                  <div className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                  </div>
                </div>
                <div className="ml-3 flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                    {member.displayName || member.username}
                  </span>
                  <span className="text-[11px] text-emerald-300/80">Đang trực tuyến</span>
                </div>
              </div>
            ))}

            {onlineMembers.length === 0 && (
              <div className="text-xs text-slate-500 px-2 py-2">Không có thành viên online phù hợp.</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            <span>Ngoại tuyến — {offlineMembers.length}</span>
          </div>

          <div className="space-y-1">
            {offlineMembers.map((member) => (
              <div key={member.id || member.userId} className="flex items-center hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors duration-200 group opacity-80">
                <div className="relative shrink-0">
                  <img
                    src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.displayName || member.username}&background=1f2937&color=fff`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-white/10 grayscale"
                  />
                  <div className="absolute bottom-[-2px] right-[-2px] w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-3 flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-sm font-medium text-slate-300 truncate">{member.displayName || member.username}</span>
                  <span className="text-[11px] text-slate-500">Ngoại tuyến</span>
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-xs text-slate-600 px-2 py-4 text-center">
                {activeConversation || activeServer ? 'Không tìm thấy thành viên nào' : 'Chọn một hội thoại'}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RightSidebar;
