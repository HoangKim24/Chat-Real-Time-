import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChannelSidebar from '../components/ChannelSidebar';
import { useAuthStore } from '../store/useAuthStore';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      displayName: editDisplayName || undefined,
      bio: editBio || undefined,
      avatarUrl: editAvatarUrl || undefined,
    });
    if (success) {
      setSaveStatus('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('Không cập nhật được hồ sơ');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      
      <ChannelSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent z-10 relative">
        {/* Header */}
        <div className="h-16 flex items-center px-8 shrink-0 border-b border-white/5 bg-white/5 backdrop-blur-md">
           <h3 className="text-white font-bold text-xl leading-tight">Cài đặt</h3>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-56 bg-black/20 border-r border-white/5 py-6 px-4 flex flex-col gap-1">
             <div className="text-xs font-semibold text-white/50 uppercase tracking-widest px-3 mb-2">Cài đặt người dùng</div>
             
             <button 
               onClick={() => setActiveTab('profile')}
               className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
             >
               Hồ sơ của tôi
             </button>
             <button 
               onClick={() => setActiveTab('account')}
               className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
             >
               Tài khoản
             </button>
             <button 
               onClick={() => setActiveTab('appearance')}
               className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
             >
               Giao diện
             </button>
             <button 
               onClick={() => setActiveTab('notifications')}
               className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
             >
               Thông báo
             </button>
             
             <div className="h-[1px] bg-white/10 my-4 mx-2"></div>
             
             <button 
               onClick={handleLogout}
               className="text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors text-red-400 hover:bg-red-400/10"
             >
               Đăng xuất
             </button>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-white/10">
             
             {activeTab === 'profile' && (
               <div className="max-w-2xl">
                 <h2 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h2>

                 {saveStatus && (
                   <div className={`mb-4 p-3 rounded-xl text-sm text-center font-medium animate-fade-in ${saveStatus.includes('thành công') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                     {saveStatus}
                   </div>
                 )}
                 
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative mb-8 overflow-hidden">
                   <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-cyan-600 to-indigo-600"></div>
                   
                   <div className="relative mt-8 flex items-end justify-between">
                     <div className="flex items-end gap-5">
                       <div className="relative">
                         <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'Người dùng'}&background=06b6d4&color=fff&size=128`} alt="Ảnh đại diện" className="w-24 h-24 rounded-full border-4 border-[#0F1219] bg-[#0F1219]" />
                       </div>
                       <div className="mb-2">
                         <h3 className="text-xl font-bold leading-tight">{user?.displayName || user?.username || 'Người dùng'}</h3>
                         <p className="text-white/50 text-sm">@{user?.username || 'nguoi-dung'}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => { setIsEditing(!isEditing); setEditDisplayName(user?.displayName || ''); setEditBio(user?.bio || ''); setEditAvatarUrl(user?.avatarUrl || ''); }}
                       className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-cyan-500/20 mb-2"
                       >{isEditing ? 'Hủy' : 'Chỉnh sửa hồ sơ'}</button>
                   </div>
                 </div>

                 {isEditing ? (
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                     <div className="flex flex-col gap-2">
                       <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Tên hiển thị</label>
                       <input type="text" value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} className="bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-xl p-3 text-white outline-none" placeholder="Tên hiển thị" />
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Giới thiệu</label>
                       <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-xl p-3 text-white outline-none resize-none h-24" placeholder="Hãy giới thiệu về bạn..." />
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">URL ảnh đại diện</label>
                       <input type="text" value={editAvatarUrl} onChange={(e) => setEditAvatarUrl(e.target.value)} className="bg-black/30 border border-white/10 focus:border-cyan-400/50 rounded-xl p-3 text-white outline-none" placeholder="https://..." />
                     </div>
                     <button onClick={handleSaveProfile} disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
                       {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                       {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                     </button>
                   </div>
                 ) : (
                   <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                     <div className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors">
                       <div>
                         <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Tên hiển thị</div>
                         <div className="text-white">{user?.displayName || user?.username || 'Chưa đặt'}</div>
                       </div>
                     </div>
                     <div className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors">
                       <div>
                         <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Địa chỉ email</div>
                         <div className="text-white">{user?.email || 'Không có'} <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full ml-2">Đã xác minh</span></div>
                       </div>
                     </div>
                     {user?.bio && (
                       <div className="p-5 hover:bg-white/5 transition-colors">
                         <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Giới thiệu</div>
                         <div className="text-white/80 text-sm">{user.bio}</div>
                       </div>
                     )}
                   </div>
                 )}

               </div>
             )}

             {activeTab === 'account' && (
               <div className="max-w-2xl">
                 <h2 className="text-2xl font-bold mb-6">Cài đặt tài khoản</h2>
                 
                 <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                   <div className="p-5 flex justify-between items-center hover:bg-white/5 transition-colors">
                     <div>
                       <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Trạng thái tài khoản</div>
                       <div className="text-white flex items-center gap-2">Đang hoạt động <span className="w-2 h-2 bg-green-500 rounded-full"></span></div>
                     </div>
                   </div>
                    
                    <div className="p-5 flex justify-between items-center hover:bg-red-500/5 transition-colors">
                      <div>
                        <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Khu vực nguy hiểm</div>
                        <div className="text-white/70 text-sm">Xóa tài khoản vĩnh viễn</div>
                      </div>
                      <button className="text-sm bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors text-red-400 border border-red-500/20">
                        Xóa tài khoản
                      </button>
                    </div>
                 </div>
               </div>
             )}

             {activeTab === 'appearance' && (
               <div className="max-w-2xl">
                 <h2 className="text-2xl font-bold mb-6">Cài đặt giao diện</h2>
                 
                 <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                   <div className="p-5">
                     <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Giao diện</div>
                     <div className="flex gap-3">
                       <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                         <div className="w-4 h-4 bg-slate-900 rounded border border-white/30"></div>
                         Tối (hiện tại)
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
                         <div className="w-4 h-4 bg-white rounded border border-white/30"></div>
                         Sáng
                       </button>
                     </div>
                   </div>
                   
                   <div className="p-5">
                     <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Màu nhấn</div>
                     <div className="flex gap-3">
                       {[
                         { name: 'Xanh ngọc', color: 'bg-cyan-500' },
                         { name: 'Tím', color: 'bg-violet-500' },
                         { name: 'Hồng', color: 'bg-pink-500' },
                         { name: 'Xanh lá', color: 'bg-green-500' },
                       ].map(accent => (
                         <button key={accent.name} className={`w-10 h-10 rounded-lg ${accent.color} hover:ring-2 ring-white/50 transition-all`} title={accent.name}></button>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'notifications' && (
               <div className="max-w-2xl">
                 <h2 className="text-2xl font-bold mb-6">Cài đặt thông báo</h2>
                 
                 <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                   <div className="p-5 flex justify-between items-center">
                     <div>
                       <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Thông báo tin nhắn</div>
                       <div className="text-white/70 text-sm">Nhận thông báo khi có tin nhắn mới</div>
                     </div>
                     <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer accent-cyan-500" />
                   </div>
                   
                   <div className="p-5 flex justify-between items-center">
                     <div>
                       <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Lời mời kết bạn</div>
                       <div className="text-white/70 text-sm">Nhận thông báo khi có ai đó thêm bạn</div>
                     </div>
                     <input type="checkbox" defaultChecked className="w-5 h-5 rounded cursor-pointer accent-cyan-500" />
                   </div>
                   
                   <div className="p-5 flex justify-between items-center">
                     <div>
                       <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Thông báo trên máy tính</div>
                       <div className="text-white/70 text-sm">Hiển thị thông báo trên màn hình desktop</div>
                     </div>
                     <input type="checkbox" className="w-5 h-5 rounded cursor-pointer accent-cyan-500" />
                   </div>
                 </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
