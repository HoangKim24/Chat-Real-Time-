import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError, setError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }
    
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setError(null);
    const success = await login({ email, password });
    if (success) {
      navigate('/app');
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Login Card (High-End Glassmorphism) */}
      <div className="glass-panel p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] w-[90%] sm:w-[480px] z-10 flex flex-col relative overflow-hidden animate-slide-up">
        {/* Reflective Top Edge */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="flex flex-col items-center justify-center mb-12">
           {/* Logo Icon */}
           <div className="relative w-20 h-20 mb-6 group cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity animate-pulse"></div>
             <div className="relative w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40" className="text-cyan-400 group-hover:rotate-12 transition-transform"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /><circle cx="8" cy="11.5" r="1.5" fill="currentColor"/><circle cx="12" cy="11.5" r="1.5" fill="currentColor"/><circle cx="16" cy="11.5" r="1.5" fill="currentColor"/></svg>
             </div>
           </div>
           
           {/* Logo Text */}
           <div className="flex flex-col items-center">
             <h1 className="text-4xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-300 uppercase leading-none">CHATFLOW</h1>
             <div className="flex items-center gap-3 mt-4 opacity-40">
               <div className="h-[1px] w-8 bg-white"></div>
               <span className="text-[10px] uppercase tracking-[0.3em] text-white font-black whitespace-nowrap">Real-Time Messaging</span>
               <div className="h-[1px] w-8 bg-white"></div>
             </div>
           </div>
        </div>

        {/* Server Error */}
        {authError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm text-center font-medium animate-fade-in">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="group flex flex-col gap-2.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1 group-focus-within:text-cyan-400 transition-colors">
              Địa chỉ email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                className={`bg-slate-950/40 border focus:bg-slate-950/60 rounded-2xl p-4 text-white outline-none transition-all duration-500 w-full placeholder-slate-600 font-medium ${
                  errors.email ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/5 focus:border-cyan-500/40'
                }`}
                placeholder="ban@congty.com"
              />
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity ${
                errors.email ? 'bg-red-500/5' : 'bg-cyan-500/5'
              }`}></div>
            </div>
            {errors.email && <span className="text-xs text-red-400 pl-1 font-medium">{errors.email}</span>}
          </div>

          <div className="group flex flex-col gap-2.5">
            <div className="flex justify-between items-center pr-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1 group-focus-within:text-cyan-400 transition-colors">
                Mật khẩu
              </label>
              <Link to="#" className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                className={`bg-slate-950/40 border focus:bg-slate-950/60 rounded-2xl p-4 pr-12 text-white outline-none transition-all duration-500 w-full placeholder-slate-600 font-medium ${
                  errors.password ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/5 focus:border-cyan-500/40'
                }`}
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {isPasswordVisible ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.26 3.64m-5.88-2.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </button>
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity ${
                errors.password ? 'bg-red-500/5' : 'bg-cyan-500/5'
              }`}></div>
            </div>
            {errors.password && <span className="text-xs text-red-400 pl-1 font-medium">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative group/btn bg-gradient-to-br from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.15em] text-xs py-4 px-6 rounded-2xl transition-all duration-500 transform active:scale-95 disabled:active:scale-100 mt-6 shadow-2xl shadow-indigo-500/20 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs font-bold mt-10 tracking-wide">
          Chưa có tài khoản? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-black transition-colors ml-1 uppercase">Đăng ký tại đây</Link>
        </p>
        <p className="text-center text-[11px] text-slate-500 mt-3 leading-relaxed px-2">
          Tài khoản đăng nhập: demo@chatflow.vn / Demo@123456
        </p>
        
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <Link to="/admin/login" className="text-[9px] text-white/20 hover:text-emerald-400 transition-colors font-black uppercase tracking-[0.3em] block">
            Truy cập quản trị hệ thống
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
