import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-[#0a0f1a] relative overflow-hidden font-mono">
      {/* Admin Tech Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>

      <div className="w-[420px] bg-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg shadow-2xl overflow-hidden z-10">
        
        {/* Top Bar indicating secure environment */}
        <div className="h-2 w-full bg-emerald-500/80"></div>
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-white/5 text-[10px] text-emerald-400 uppercase tracking-widest">
           <span>Chatflow SysAdmin</span>
           <span>v2.0.4 An toàn</span>
        </div>

        <div className="p-8">
           <div className="flex justify-center mb-6">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" className="text-emerald-500 mb-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           
           <h2 className="text-center text-xl font-bold text-white mb-2 uppercase tracking-wide">Truy cập quản trị</h2>
           <p className="text-center text-xs text-emerald-500/70 mb-8 border-b border-white/5 pb-4">KHÔNG ĐƯỢC PHÉP TRUY CẬP KHI CHƯA XÁC THỰC</p>

           <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">Mã quản trị</label>
                <input
                  type="text"
                  required
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="bg-black/50 border border-white/10 focus:border-emerald-500/50 rounded p-2.5 text-emerald-400 outline-none transition-colors duration-300 w-full text-sm"
                  placeholder="SYS-XXXX"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">Khóa bảo mật</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border border-white/10 focus:border-emerald-500/50 rounded p-2.5 text-emerald-400 outline-none transition-colors duration-300 w-full tracking-[0.3em] font-sans"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 font-bold tracking-widest uppercase py-3 rounded transition-all duration-300 mt-4 text-xs shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Xác thực
              </button>
           </form>
           <p className="text-center text-[11px] text-emerald-500/60 mt-6 leading-relaxed">
             Đây là cổng demo để xem UI quản trị, không kiểm tra quyền thật.
           </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
