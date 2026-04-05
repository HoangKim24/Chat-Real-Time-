import { useEffect, useState } from 'react';
import { useFriendStore } from '../store/useFriendStore';

const FriendsView = () => {
  const { friends, friendRequests, fetchFriends, fetchFriendRequests, sendFriendRequest, acceptFriendRequest, isLoading } = useFriendStore();
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending'>('online');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [addStatus, setAddStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, [fetchFriends, fetchFriendRequests]);

  const onlineFriends = friends.filter(f => f.status === 'online' || f.status === 'idle' || f.status === 'dnd');
  const displayFriends = activeTab === 'online' ? onlineFriends : friends;

  const handleSendRequest = async () => {
    const id = parseInt(friendIdInput);
    if (isNaN(id)) {
      setAddStatus('Vui lòng nhập ID người dùng hợp lệ');
      return;
    }
    const success = await sendFriendRequest(id);
    if (success) {
      setAddStatus('Đã gửi lời mời kết bạn!');
      setFriendIdInput('');
      setTimeout(() => { setAddStatus(null); setShowAddFriend(false); }, 2000);
    } else {
      setAddStatus('Không gửi được lời mời');
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    await acceptFriendRequest(requestId);
    fetchFriends();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500 shadow-[0_0_5px_#22c55e]';
      case 'idle': return 'bg-yellow-500 shadow-[0_0_5px_#eab308]';
      case 'dnd': return 'bg-red-500 shadow-[0_0_5px_#ef4444]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080B12] text-white h-full relative z-10">
      
      {/* Header */}
      <div className="min-h-16 flex flex-wrap items-center gap-3 px-4 pl-14 md:px-6 py-2 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3 shrink-0">
            <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" className="text-cyan-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5c-1.2 0-2.3.5-3.1 1.4A4 4 0 0 0 1 19v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            <h2 className="font-bold text-lg tracking-wide">Bạn bè</h2>
         </div>
        <div className="flex items-center gap-2 md:gap-4 text-sm font-medium md:border-l border-white/10 md:pl-4 md:ml-2 overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('online')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'online' ? 'text-white bg-white/10 hover:bg-white/20' : 'text-white/50 hover:text-white/80'}`}
            >Trực tuyến</button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'all' ? 'text-white bg-white/10 hover:bg-white/20' : 'text-white/50 hover:text-white/80'}`}
            >Tất cả</button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex gap-2 items-center transition-colors ${activeTab === 'pending' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              Đang chờ {friendRequests.length > 0 && <div className="w-5 h-5 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">{friendRequests.length}</div>}
            </button>
         </div>
         
         <button 
           onClick={() => setShowAddFriend(!showAddFriend)}
           className="md:ml-auto bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-4 py-1.5 rounded-md shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all"
         >Thêm bạn bè</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
         <div className="max-w-4xl mx-auto w-full">
            
            {/* Add Friend Form */}
            {showAddFriend && (
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Thêm bạn bè theo ID người dùng</h3>
                <div className="flex gap-3">
                  <input 
                    type="text"
                    value={friendIdInput}
                    onChange={(e) => setFriendIdInput(e.target.value)}
                    placeholder="Nhập ID người dùng..."
                    className="flex-1 bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-xl p-3 text-white outline-none text-sm placeholder-white/30"
                  />
                  <button 
                    onClick={handleSendRequest}
                    className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 rounded-xl transition-all text-sm"
                  >Gửi lời mời</button>
                </div>
                {addStatus && (
                  <p className={`mt-2 text-sm ${addStatus.startsWith('Đã gửi') ? 'text-emerald-400' : 'text-red-400'}`}>{addStatus}</p>
                )}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-400 text-sm">Đang tải...</span>
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
              <>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Lời mời đang chờ — {friendRequests.length}</h3>
                
                {friendRequests.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">Không có lời mời kết bạn nào đang chờ</div>
                )}

                {friendRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 px-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl mb-3 group transition-colors">
                     <div className="flex items-center gap-3">
                       <img src={req.senderAvatar || `https://ui-avatars.com/api/?name=${req.senderName}&background=ef4444&color=fff`} alt="Avatar" className="w-9 h-9 rounded-full" />
                       <div>
                         <div className="font-semibold text-white/90 text-sm">{req.senderName} <span className="text-xs text-white/40 font-normal ml-1">Lời mời đến</span></div>
                         <div className="text-xs text-white/50 mt-0.5">Muốn kết bạn với bạn.</div>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 shrink-0">
                       <button 
                         onClick={() => handleAcceptRequest(req.id)}
                         className="w-8 h-8 bg-green-500/10 hover:bg-green-500/25 text-green-400 rounded-lg border border-green-500/20 transition-colors flex items-center justify-center" title="Chấp nhận"
                       >
                         <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                       </button>
                       <button className="w-8 h-8 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/20 transition-colors flex items-center justify-center" title="Từ chối">
                         <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                       </button>
                     </div>
                  </div>
                ))}
              </>
            )}

            {/* Friends List (Online / All) */}
            {(activeTab === 'online' || activeTab === 'all') && (
              <>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  {activeTab === 'online' ? `Bạn bè trực tuyến — ${onlineFriends.length}` : `Tất cả bạn bè — ${friends.length}`}
                </h3>

                {displayFriends.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    {activeTab === 'online' ? 'Hiện chưa có bạn bè nào trực tuyến' : 'Chưa có bạn bè nào. Hãy thêm một vài người!'}
                  </div>
                )}
                
                <div className="space-y-2">
                   {displayFriends.map(friend => (
                     <div key={friend.id} className="flex items-center justify-between p-3 px-4 hover:bg-white/5 rounded-xl group transition-colors cursor-pointer border border-transparent hover:border-white/5">
                       <div className="flex items-center gap-4">
                         <div className="relative">
                           <img src={friend.avatarUrl || `https://ui-avatars.com/api/?name=${friend.displayName || friend.username}&background=10b981&color=fff`} alt="Ảnh đại diện" className="w-10 h-10 rounded-full group-hover:shadow-lg transition-all" />
                           <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center">
                              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(friend.status)}`}></div>
                           </div>
                         </div>
                         <div>
                           <div className="font-semibold text-white/90 text-sm group-hover:text-cyan-400 transition-colors">{friend.displayName || friend.username}</div>
                           {friend.activity && <div className="text-xs text-cyan-400/80 mt-0.5">{friend.activity}</div>}
                         </div>
                       </div>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="w-8 h-8 bg-black/40 hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/5 transition-colors flex items-center justify-center" title="Nhắn tin">
                           <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                         </button>
                         <button className="w-8 h-8 bg-black/40 hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/5 transition-colors flex items-center justify-center" title="Thêm">
                           <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                         </button>
                       </div>
                     </div>
                   ))}
                </div>
              </>
            )}

         </div>
      </div>
    </div>
  );
};

export default FriendsView;
