import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

interface Stats {
  globalUsers: number;
  activeClusters: number;
  trafficVolume: string;
  computeLoad: number;
}

interface Product {
  productId: number;
  name: string;
  salesCount: number;
  price: number;
  category: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);

        const productsRes = await api.get('/admin/top-products');
        setTopProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans relative">
      {/* Background Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none text-emerald-500"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      {/* Admin Sidebar */}
      <div className="w-72 bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0 z-20 animate-fade-in">
         <div className="h-20 flex justify-center flex-col px-8 border-b border-white/5 bg-slate-900/20">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                 <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" className="text-emerald-400"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>
               <div className="flex flex-col">
                 <h1 className="font-black tracking-[0.2em] text-xs uppercase text-white">QUẢN TRỊ HỆ THỐNG</h1>
                 <span className="text-[10px] text-emerald-500/60 font-mono">v4.2.0-an-toan</span>
               </div>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto py-8 px-5 space-y-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black mb-4 px-3">Hệ thống chính</div>
            <button className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 transition-all">Bảng điều khiển</button>
            <button className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all">Quản lý người dùng</button>
            <button className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all">Hạ tầng máy chủ</button>
            
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black mt-10 mb-4 px-3">Bảo mật & nhật ký</div>
            <button className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all">Nhật ký kiểm tra</button>
            <button className="w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all">Tuân thủ</button>
         </div>

         <div className="p-6 border-t border-white/5 bg-slate-900/20">
            <Link to="/admin/login" className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 transition-all">
               <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất
            </Link>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 md:p-10 z-10 font-sans">
          <div className="max-w-7xl w-full mx-auto animate-slide-up">
             <div className="flex flex-wrap items-end gap-4 justify-between mb-10 md:mb-12">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <div className="h-[1px] w-8 bg-emerald-500/40"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60">Thông tin thời gian thực</span>
                 </div>
                 <h2 className="text-4xl font-black text-white tracking-tight">Tổng quan hệ thống</h2>
                 <p className="text-xs text-slate-400 mt-3 max-w-xl">Theo dõi số liệu vận hành cốt lõi, trạng thái hạ tầng và hiệu suất xử lý theo thời gian thực.</p>
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                 TRẠNG THÁI HOẠT ĐỘNG: BÌNH THƯỜNG
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
               <button className="text-left px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-colors">
                 <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Hành động nhanh</div>
                 <div className="text-sm font-bold text-white">Thêm voucher mới</div>
               </button>
               <button className="text-left px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/30 hover:bg-emerald-500/5 transition-colors">
                 <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Hành động nhanh</div>
                 <div className="text-sm font-bold text-white">Xuất báo cáo hệ thống</div>
               </button>
               <button className="text-left px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/30 hover:bg-indigo-500/5 transition-colors">
                 <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Hành động nhanh</div>
                 <div className="text-sm font-bold text-white">Kiểm tra nhật ký bảo mật</div>
               </button>
             </div>

             {/* Stat Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                <div className="glass-panel p-7 rounded-[2rem] hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 -z-10"></div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-3 flex items-center justify-between">
                    <span>Người dùng toàn cầu</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  </div>
                  <div className="text-4xl font-black text-white mb-3">{stats?.globalUsers.toLocaleString() ?? '...'}</div>
                  <div className="flex items-end gap-2 h-10 bg-emerald-500/5 rounded-lg p-1 border border-emerald-500/10">
                    {[2, 4, 3, 5, 4, 6, 5].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/60 to-emerald-400/40 rounded-sm" style={{ height: `${h * 5}%` }}></div>
                    ))}
                  </div>
                  <div className="text-emerald-400 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest mt-2"><svg fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> +12% hiệu suất</div>
                </div>
                
                <div className="glass-panel p-7 rounded-[2rem] hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 -z-10"></div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-3 flex items-center justify-between">
                    <span>Cụm hoạt động</span>
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                  </div>
                  <div className="text-4xl font-black text-white mb-3">{stats?.activeClusters ?? '...'}</div>
                  <div className="grid grid-cols-3 gap-1 h-10 bg-cyan-500/5 rounded-lg p-1 border border-cyan-500/10">
                    {[1,1,1,1,1,1,1,1,1].map((_, i) => (
                      <div key={i} className={`rounded-sm ${i % 3 === 0 ? 'bg-cyan-500/60' : i % 2 === 0 ? 'bg-cyan-500/40' : 'bg-cyan-500/20'}`}></div>
                    ))}
                  </div>
                  <div className="text-cyan-400 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest mt-2"><svg fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> +5% tăng trưởng</div>
                </div>

                <div className="glass-panel p-7 rounded-[2rem] hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 -z-10"></div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-3 flex items-center justify-between">
                    <span>Lưu lượng</span>
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="text-4xl font-black text-white mb-3">{stats?.trafficVolume ?? '...'}</div>
                  <svg viewBox="0 0 100 40" className="w-full h-10 text-indigo-400/50 stroke-indigo-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                    <polyline points="0,30 10,20 20,25 30,10 40,15 50,5 60,18 70,12 80,22 90,8 100,15"/>
                  </svg>
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">Mã hóa đầu cuối</div>
                </div>

                <div className="glass-panel p-7 rounded-[2rem] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 -z-10"></div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-3 flex items-center justify-between">
                    <span>Tải tính toán</span>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${(stats?.computeLoad ?? 0) > 70 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`}></span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-slate-400">Nhân Oracle</span>
                      <span className={`${(stats?.computeLoad ?? 0) > 70 ? 'text-red-400' : 'text-emerald-400'}`}>{stats?.computeLoad ?? 0}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-white/5 relative">
                      <div className={`${(stats?.computeLoad ?? 0) > 70 ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-cyan-500'} h-full rounded-full transition-all duration-300`} style={{ width: `${stats?.computeLoad ?? 0}%` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Top Selling Products */}
                <div className="lg:col-span-2 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="p-7 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Top 5 sản phẩm bán chạy nhất</h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-slate-950/40 text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black">
                           <tr>
                             <th className="p-7">Mã</th>
                             <th className="p-7">Tên sản phẩm</th>
                             <th className="p-7">Danh mục</th>
                             <th className="p-7 text-right">Lượt bán</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {topProducts.map((product) => (
                             <tr key={product.productId} className="hover:bg-white/5 transition-colors group">
                               <td className="p-7 font-mono text-[10px] text-emerald-500/60 font-bold">#{product.productId.toString().padStart(4, '0')}</td>
                               <td className="p-7">
                                 <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                     {product.name.charAt(0)}
                                   </div>
                                   <div>
                                     <div className="text-xs font-black text-white">{product.name}</div>
                                     <div className="text-[9px] text-slate-500 font-mono">${product.price.toLocaleString()}</div>
                                   </div>
                                 </div>
                               </td>
                               <td className="p-7"><span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest">{product.category}</span></td>
                               <td className="p-7 text-right">
                                  <div className="text-xs font-black text-white">{product.salesCount} đơn vị</div>
                               </td>
                             </tr>
                           ))}
                           {topProducts.length === 0 && (
                             <tr>
                               <td colSpan={4} className="p-10 text-center text-slate-500 text-xs italic">Đang tải dữ liệu vận hành...</td>
                             </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
                </div>

                {/* Voucher Management */}
                <div className="glass-panel rounded-[2.5rem] flex flex-col h-[500px]">
                  <div className="p-7 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Luồng voucher</h3>
                    <button className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20 transition-all">+</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-7 space-y-6 scrollbar-thin">
                    <div className="relative pl-6 before:absolute before:left-0 before:top-1 before:bottom-[-24px] before:w-[1px] before:bg-white/5">
                      <div className="absolute left-[-3px] top-1 w-[7px] h-[7px] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2"><span>Hết hạn: 2026-04-17</span> <span>Mã: WELCOME10</span></div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">GIẢM GIÁ 10%</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed italic">Dành cho người dùng mới đăng ký trong quý 1.</div>
                    </div>
                    
                    <div className="relative pl-6 before:absolute before:left-0 before:top-1 before:bottom-[-24px] before:w-[1px] before:bg-white/5">
                      <div className="absolute left-[-3px] top-1 w-[7px] h-[7px] bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2"><span>Hết hạn: 2026-05-17</span> <span>Mã: SUMMER2026</span></div>
                      <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">GIẢM $50,000</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed italic">Khuyến mãi theo mùa đang áp dụng cho tất cả thành viên cao cấp.</div>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute left-[-3px] top-1 w-[7px] h-[7px] bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2"><span>Hết hạn: 2026-06-01</span> <span>Mã: FLASH50</span></div>
                      <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-1">GIẢM GIÁ 50%</div>
                      <div className="text-[10px] text-slate-400 leading-relaxed italic">Đang chờ phê duyệt cho sự kiện flash sale.</div>
                    </div>
                  </div>
                </div>

             </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
