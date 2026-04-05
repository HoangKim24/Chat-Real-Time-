import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChannelSidebar from '../components/ChannelSidebar';
import { useAuthStore } from '../store/useAuthStore';
import {
  applyAppearancePrefs,
  getDefaultAppearancePrefs,
  loadAppearancePrefs,
  saveAppearancePrefs,
  type AppearanceAccent,
  type AppearanceFontSize,
  type AppearanceTheme,
} from '../services/appearanceService';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || '');
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(user?.avatarUrl || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState({
    messages: true,
    friendRequests: true,
    desktopNotifications: false,
  });
  const [appearancePrefs, setAppearancePrefs] = useState(() => loadAppearancePrefs());

  useEffect(() => {
    applyAppearancePrefs(appearancePrefs);
    saveAppearancePrefs(appearancePrefs);
  }, [appearancePrefs]);

  const accentStyleMap: Record<AppearanceAccent, { selectedThemeCard: string; selectedButton: string }> = {
    cyan: {
      selectedThemeCard: 'border-cyan-500 bg-cyan-500/10',
      selectedButton: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    },
    violet: {
      selectedThemeCard: 'border-violet-500 bg-violet-500/10',
      selectedButton: 'bg-violet-500/20 text-violet-300 border-violet-500/50',
    },
    pink: {
      selectedThemeCard: 'border-pink-500 bg-pink-500/10',
      selectedButton: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
    },
    green: {
      selectedThemeCard: 'border-emerald-500 bg-emerald-500/10',
      selectedButton: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    },
    blue: {
      selectedThemeCard: 'border-blue-500 bg-blue-500/10',
      selectedButton: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    },
    amber: {
      selectedThemeCard: 'border-amber-500 bg-amber-500/10',
      selectedButton: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    },
  };

  const handleSaveProfile = async () => {
    if (!editDisplayName.trim()) {
      setSaveStatus('Tên hiển thị không được để trống');
      return;
    }
    const success = await updateProfile({
      displayName: editDisplayName || undefined,
      bio: editBio || undefined,
      avatarUrl: editAvatarUrl || undefined,
    });
    if (success) {
      setSaveStatus('✓ Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('✕ Không cập nhật được hồ sơ');
    }
  };

  const handleAvatarUrlChange = (url: string) => {
    setEditAvatarUrl(url);
    setPreviewAvatarUrl(url || user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'Người dùng'}&background=06b6d4&color=fff&size=128`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSaveStatus('✓ Đã sao chép!');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="theme-shell flex h-screen overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
      
      <ChannelSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent z-10 relative">
        {/* Header */}
        <div className="theme-header h-16 flex items-center px-4 md:px-8 shrink-0 border-b border-white/5 backdrop-blur-md z-10 shadow-sm">
          <h3 className="theme-text font-bold text-xl">Cài đặt</h3>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sidebar - Responsive */}
          <div className="w-56 bg-slate-900/30 border-r border-white/5 py-6 px-4 flex flex-col gap-1 overflow-hidden shrink-0 backdrop-blur-md">
             <div className="text-xs font-semibold text-white/50 uppercase tracking-widest px-3 mb-3">Cài đặt</div>
             
             {[
               { id: 'profile', label: 'Hồ sơ của tôi', icon: '👤' },
               { id: 'account', label: 'Bảo mật & Tài khoản', icon: '🔐' },
               { id: 'appearance', label: 'Giao diện', icon: '🎨' },
               { id: 'notifications', label: 'Thông báo', icon: '🔔' },
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-400/30' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
               >
                 <span>{tab.icon}</span>
                 <span>{tab.label}</span>
               </button>
             ))}
             
             <div className="h-[1px] bg-white/10 my-4 mx-2"></div>
             
             <button 
               onClick={handleLogout}
               className="text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 flex items-center gap-2"
             >
               <span>🚪</span>
               <span>Đăng xuất</span>
             </button>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            <div className="p-6 md:p-10 max-w-4xl mx-auto">
             
             {activeTab === 'profile' && (
               <div className="animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold">Hồ sơ của tôi</h2>
                   <p className="text-white/50 mt-1">Quản lý thông tin cá nhân và hình ảnh đại diện</p>
                 </div>

                 {saveStatus && (
                   <div className={`mb-6 p-4 rounded-2xl text-sm font-medium animate-slide-up border transition-all ${saveStatus.includes('✓') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                     {saveStatus}
                   </div>
                 )}
                 
                 {/* Profile Header Card */}
                 <div className="bg-gradient-to-br from-cyan-600/20 to-indigo-600/20 border border-white/10 rounded-3xl p-8 relative mb-8 overflow-hidden backdrop-blur-xl">
                   <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 blur-3xl"></div>
                   
                   <div className="relative">
                     <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                       <div className="flex items-end gap-5">
                         <div className="relative group">
                           <img 
                             src={isEditing ? previewAvatarUrl : (user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'Người dùng'}&background=06b6d4&color=fff&size=128`)} 
                             alt="Ảnh đại diện" 
                             className="w-32 h-32 rounded-2xl border-4 border-[#0F1219] bg-[#0F1219] shadow-2xl object-cover"
                           />
                           <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-[#0F1219] shadow-lg"></div>
                         </div>
                         <div className="mb-2">
                           <h3 className="text-2xl font-bold leading-tight">{user?.displayName || user?.username || 'Người dùng'}</h3>
                           <p className="text-white/50 text-sm">@{user?.username || 'nguoi-dung'}</p>
                           <p className="text-xs text-cyan-400/70 mt-2 font-medium">Trạng thái: Đang hoạt động</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => { 
                           setIsEditing(!isEditing); 
                           setEditDisplayName(user?.displayName || ''); 
                           setEditBio(user?.bio || ''); 
                           setEditAvatarUrl(user?.avatarUrl || '');
                           setPreviewAvatarUrl(user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'Người dùng'}&background=06b6d4&color=fff&size=128`);
                         }}
                         className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg ${isEditing ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'}`}
                       >
                         {isEditing ? '✕ Hủy' : '✎ Chỉnh sửa hồ sơ'}
                       </button>
                     </div>
                   </div>
                 </div>

                 {isEditing ? (
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-xl">
                     <div className="flex flex-col gap-2.5">
                       <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Tên hiển thị *</label>
                       <input 
                         type="text" 
                         value={editDisplayName} 
                         onChange={(e) => setEditDisplayName(e.target.value)} 
                         className="bg-black/40 border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/25 rounded-2xl px-4 py-3 text-white outline-none transition-all placeholder-slate-500" 
                         placeholder="Tên hiển thị của bạn" 
                       />
                       <p className="text-xs text-white/40">Tên này sẽ được hiển thị cho các người dùng khác</p>
                     </div>

                     <div className="flex flex-col gap-2.5">
                       <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Giới thiệu</label>
                       <textarea 
                         value={editBio} 
                         onChange={(e) => setEditBio(e.target.value)} 
                         className="bg-black/40 border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/25 rounded-2xl px-4 py-3 text-white outline-none resize-none h-28 transition-all placeholder-slate-500 scrollbar-thin scrollbar-thumb-white/20" 
                         placeholder="Hãy giới thiệu về bạn..." 
                       />
                       <p className="text-xs text-white/40">{editBio.length}/200 ký tự</p>
                     </div>

                     <div className="flex flex-col gap-2.5">
                       <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest">URL ảnh đại diện</label>
                       <div className="flex flex-col gap-2">
                         <input 
                           type="url" 
                           value={editAvatarUrl} 
                           onChange={(e) => handleAvatarUrlChange(e.target.value)} 
                           className="bg-black/40 border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/25 rounded-2xl px-4 py-3 text-white outline-none transition-all placeholder-slate-500 text-sm" 
                           placeholder="https://example.com/avatar.jpg" 
                         />
                         <p className="text-xs text-white/40">Dùng ảnh JPG, PNG (tối đa 5MB)</p>
                       </div>
                     </div>

                     <button 
                       onClick={handleSaveProfile} 
                       disabled={isLoading || !editDisplayName.trim()} 
                       className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                     >
                       {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                       {isLoading ? 'Đang lưu...' : '✓ Lưu thay đổi'}
                     </button>
                   </div>
                 ) : (
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl divide-y divide-white/5">
                     <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                       <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Tên hiển thị</div>
                       <div className="text-white font-medium text-lg">{user?.displayName || user?.username || 'Chưa đặt'}</div>
                     </div>
                     <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                       <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                         <span>Địa chỉ email</span>
                         <button onClick={() => copyToClipboard(user?.email || '')} className="text-cyan-400/50 hover:text-cyan-400 text-[10px] font-semibold">COPY</button>
                       </div>
                       <div className="text-white font-medium flex items-center gap-3">
                         {user?.email || 'Không có'} 
                         <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">✓ Đã xác minh</span>
                       </div>
                     </div>
                     {user?.bio && (
                       <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                         <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Giới thiệu</div>
                         <div className="text-white/80 text-sm leading-relaxed">{user.bio}</div>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'account' && (
               <div className="animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold">Bảo mật & Tài khoản</h2>
                   <p className="text-white/50 mt-1">Quản lý cài đặt bảo mật và hoạt động tài khoản</p>
                 </div>
                 
                 <div className="space-y-6">
                   {/* Account Status */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="flex items-start justify-between">
                       <div>
                         <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Trạng thái tài khoản</div>
                         <div className="text-white/80 text-sm">Tài khoản của bạn đang hoạt động bình thường</div>
                         <div className="flex items-center gap-2 mt-3">
                           <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                           <span className="text-sm text-emerald-400 font-semibold">Đang hoạt động</span>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-xs text-white/40 mb-1">Lần đăng nhập cuối</div>
                         <div className="text-sm font-medium text-white">Hôm nay lúc 10:32</div>
                       </div>
                     </div>
                   </div>

                   {/* Security Info */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl divide-y divide-white/5">
                     <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                       <div>
                         <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Mật khẩu</div>
                         <div className="text-white/80 text-sm">Thay đổi mật khẩu của bạn định kỳ</div>
                       </div>
                       <button className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-sm font-semibold border border-cyan-500/30 transition-all">
                         Thay đổi
                       </button>
                     </div>
                     <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                       <div>
                         <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Xác thực hai yếu tố</div>
                         <div className="text-white/80 text-sm">Bảo vệ tài khoản với 2FA</div>
                       </div>
                       <div className="px-4 py-2 rounded-xl bg-slate-700/30 text-slate-300 text-sm font-semibold">
                         Chưa bật
                       </div>
                     </div>
                     <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                       <div>
                         <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Thiết bị đăng nhập</div>
                         <div className="text-white/80 text-sm">Quản lý các thiết bị được phép truy cập</div>
                       </div>
                       <button className="px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm font-semibold transition-all">
                         Xem
                       </button>
                     </div>
                   </div>

                   {/* Danger Zone */}
                   <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="flex items-start justify-between">
                       <div>
                         <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">🚨 Khu vực nguy hiểm</div>
                         <div className="text-white/80 text-sm">Các hành động không thể hoàn tác</div>
                       </div>
                       <button className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold border border-red-500/30 transition-all active:scale-95">
                         Xóa tài khoản
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'appearance' && (
               <div className="animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold">Giao diện</h2>
                   <p className="text-white/50 mt-1">Tùy chỉnh hiện thị giao diện ứng dụng</p>
                 </div>
                 
                 <div className="space-y-8">
                   {/* Theme Section */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                     <div className="mb-6">
                       <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Chủ đề</div>
                       <p className="text-white/60 text-sm">Chọn giao diện phù hợp với bạn</p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[
                         { id: 'dark', label: 'Tối', icon: '🌙', colors: ['bg-slate-900', 'bg-slate-800'] },
                         { id: 'light', label: 'Sáng', icon: '☀️', colors: ['bg-white', 'bg-slate-100'] },
                       ].map(theme => (
                         <button
                           key={theme.id}
                           onClick={() => setAppearancePrefs({ ...appearancePrefs, theme: theme.id as AppearanceTheme })}
                           className={`p-6 rounded-2xl border-2 transition-all duration-200 ${appearancePrefs.theme === theme.id ? accentStyleMap[appearancePrefs.accentColor].selectedThemeCard : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                         >
                           <div className="flex items-center gap-3 mb-4">
                             <span className="text-2xl">{theme.icon}</span>
                             <span className="font-bold text-white">{theme.label}</span>
                           </div>
                           <div className="flex gap-2">
                             {theme.colors.map((color, i) => (
                               <div key={i} className={`h-8 w-full rounded-lg border border-white/20 ${color}`}></div>
                             ))}
                           </div>
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Accent Color Section */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                     <div className="mb-6">
                       <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Màu nhấn</div>
                       <p className="text-white/60 text-sm">Chọn màu chính cho giao diện</p>
                     </div>
                     <div className="flex flex-wrap gap-4">
                       {[
                         { id: 'cyan', name: 'Xanh ngọc', color: 'bg-cyan-500', accent: 'ring-cyan-400', shadow: 'shadow-cyan-500/50' },
                         { id: 'violet', name: 'Tím', color: 'bg-violet-500', accent: 'ring-violet-400', shadow: 'shadow-violet-500/50' },
                         { id: 'pink', name: 'Hồng', color: 'bg-pink-500', accent: 'ring-pink-400', shadow: 'shadow-pink-500/50' },
                         { id: 'green', name: 'Xanh lá', color: 'bg-emerald-500', accent: 'ring-emerald-400', shadow: 'shadow-emerald-500/50' },
                         { id: 'blue', name: 'Xanh dương', color: 'bg-blue-500', accent: 'ring-blue-400', shadow: 'shadow-blue-500/50' },
                         { id: 'amber', name: 'Cam', color: 'bg-amber-500', accent: 'ring-amber-400', shadow: 'shadow-amber-500/50' },
                       ].map(accent => (
                         <button
                           key={accent.id}
                           onClick={() => setAppearancePrefs({ ...appearancePrefs, accentColor: accent.id as AppearanceAccent })}
                           className={`relative group`}
                           title={accent.name}
                         >
                           <div className={`w-12 h-12 rounded-2xl ${accent.color} transition-all duration-200 ${appearancePrefs.accentColor === accent.id ? `ring-4 ${accent.accent} shadow-lg ${accent.shadow}` : 'hover:ring-2 ring-white/30'}`}></div>
                           <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{accent.name}</span>
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Font Size Section */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                     <div className="mb-6">
                       <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Kích thước văn bản</div>
                       <p className="text-white/60 text-sm">Điều chỉnh kích thước chữ</p>
                     </div>
                     <div className="flex gap-3">
                       {[
                         { id: 'small', label: 'Nhỏ', size: 'text-xs' },
                         { id: 'normal', label: 'Bình thường', size: 'text-sm' },
                         { id: 'large', label: 'Lớn', size: 'text-base' },
                       ].map(size => (
                         <button
                           key={size.id}
                           onClick={() => setAppearancePrefs({ ...appearancePrefs, fontSize: size.id as AppearanceFontSize })}
                           className={`px-6 py-2.5 rounded-xl transition-all duration-200 font-semibold border ${appearancePrefs.fontSize === size.id ? accentStyleMap[appearancePrefs.accentColor].selectedButton : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'}`}
                         >
                           <span className={size.size}>{size.label}</span>
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="flex justify-end">
                     <button
                       onClick={() => setAppearancePrefs(getDefaultAppearancePrefs())}
                       className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white/70 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                     >
                       Khôi phục mặc định
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'notifications' && (
               <div className="animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold">Cài đặt thông báo</h2>
                   <p className="text-white/50 mt-1">Quản lý cách bạn nhận được thông báo</p>
                 </div>
                 
                 <div className="space-y-6">
                   {/* Message Notifications */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <span className="text-xl">💬</span>
                           <div>
                             <div className="text-sm font-bold text-white">Thông báo tin nhắn</div>
                             <p className="text-white/60 text-xs mt-1">Nhận thông báo khi có tin nhắn mới từ bạn bè</p>
                           </div>
                         </div>
                       </div>
                       <button
                         onClick={() => setNotificationPrefs({ ...notificationPrefs, messages: !notificationPrefs.messages })}
                         className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${notificationPrefs.messages ? 'bg-cyan-500/30 border border-cyan-500/50' : 'bg-white/10 border border-white/20'}`}
                       >
                         <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${notificationPrefs.messages ? 'translate-x-6' : 'translate-x-1'}`} />
                       </button>
                     </div>
                   </div>

                   {/* Friend Request Notifications */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <span className="text-xl">👥</span>
                           <div>
                             <div className="text-sm font-bold text-white">Lời mời kết bạn</div>
                             <p className="text-white/60 text-xs mt-1">Cảnh báo khi ai đó thêm bạn vào danh sách liên hệ</p>
                           </div>
                         </div>
                       </div>
                       <button
                         onClick={() => setNotificationPrefs({ ...notificationPrefs, friendRequests: !notificationPrefs.friendRequests })}
                         className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${notificationPrefs.friendRequests ? 'bg-cyan-500/30 border border-cyan-500/50' : 'bg-white/10 border border-white/20'}`}
                       >
                         <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${notificationPrefs.friendRequests ? 'translate-x-6' : 'translate-x-1'}`} />
                       </button>
                     </div>
                   </div>

                   {/* Desktop Notifications */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <span className="text-xl">🖥️</span>
                           <div>
                             <div className="text-sm font-bold text-white">Thông báo trên desktop</div>
                             <p className="text-white/60 text-xs mt-1">Hiển thị popup thông báo trên màn hình khi app chạy nền</p>
                           </div>
                         </div>
                       </div>
                       <button
                         onClick={() => setNotificationPrefs({ ...notificationPrefs, desktopNotifications: !notificationPrefs.desktopNotifications })}
                         className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${notificationPrefs.desktopNotifications ? 'bg-cyan-500/30 border border-cyan-500/50' : 'bg-white/10 border border-white/20'}`}
                       >
                         <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${notificationPrefs.desktopNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                       </button>
                     </div>
                   </div>

                   {/* Sound Preference */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="mb-4">
                       <div className="flex items-center gap-3 mb-2">
                         <span className="text-xl">🔊</span>
                         <div>
                           <div className="text-sm font-bold text-white">Âm thanh thông báo</div>
                           <p className="text-white/60 text-xs mt-1">Phát âm thanh khi nhận thông báo</p>
                         </div>
                       </div>
                     </div>
                     <div className="flex gap-3">
                       {['Tắt', 'Yên tĩnh', 'Bình thường'].map((sound, i) => (
                         <button key={i} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${i === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'}`}>
                           {sound}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Do Not Disturb */}
                   <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex items-center gap-3">
                         <span className="text-xl">🌙</span>
                         <div>
                           <div className="text-sm font-bold text-white">Không làm phiền (DND)</div>
                           <p className="text-white/60 text-xs mt-1">Tạm dừng thông báo trong khoảng thời gian nhất định</p>
                         </div>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                       {['30 phút', '1 giờ', '2 giờ', 'Tất cả'].map((duration, i) => (
                         <button key={i} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white/70 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                           {duration}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>
             )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
