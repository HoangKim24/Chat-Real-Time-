import { useEffect } from 'react';
import { useConversationStore } from '../store/useConversationStore';
import { useServerStore } from '../store/useServerStore';

const RightSidebar = () => {
  const { activeConversation, members: convMembers, fetchMembers: fetchConvMembers } = useConversationStore();
  const { activeServer, members: serverMembers, fetchMembers: fetchServerMembers } = useServerStore();

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

  return (
    <div className="w-60 bg-slate-900/40 flex-col h-full shrink-0 border-l border-white/5 pb-4 hidden lg:flex">
      {/* Header */}
      <div className="h-16 flex items-center px-4 shrink-0 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white/90">Thành viên <span className="text-xs text-white/50 ml-1">({members.length})</span></h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        
        {/* Members List */}
        <div>
          <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            <span>Thành viên — {members.length}</span>
          </div>
 
          <div className="space-y-1">
            {members.map((member) => (
              <div key={member.id || member.userId} className="flex items-center hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors duration-200 group">
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
                </div>
              </div>
            ))}

            {members.length === 0 && (
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
