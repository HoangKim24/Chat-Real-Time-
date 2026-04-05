import { Outlet, Navigate } from 'react-router-dom';
import ServerSidebar from '../components/ServerSidebar';
import ChannelSidebar from '../components/ChannelSidebar';

const AppLayout = () => {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen p-4 gap-4 overflow-hidden bg-[#020617] relative">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      
      {/* Sidebar Servers */}
      <ServerSidebar />
      
      {/* Main Glass Workspace */}
      <div className="flex-1 flex glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative animate-fade-in">
        {/* Sidebar Channels */}
        <ChannelSidebar />
        
        {/* Main Content Area (Chat Area) */}
        <div className="flex-1 flex flex-col h-full bg-slate-950/20 backdrop-blur-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
