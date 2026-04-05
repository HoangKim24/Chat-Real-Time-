import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import ChatArea from './components/ChatArea';
import RightSidebar from './components/RightSidebar';
import FriendsView from './components/FriendsView';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';
import { useToast } from './store/useToastStore';
import { useAuthStore } from './store/useAuthStore';

const MainApp = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'friends'>('chat');
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#030712] text-white relative">
      {/* Global Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
      
      <ServerSidebar onHomeClick={() => setCurrentView('friends')} />

      {currentView === 'chat' ? (
        <div className="flex flex-1 min-w-0 overflow-hidden">
          <ChannelSidebar onChannelClick={() => setCurrentView('chat')} />
          <div className="flex flex-1 min-w-0 overflow-hidden">
            <ChatArea />
            <RightSidebar />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-w-0 overflow-hidden">
          <FriendsView />
        </div>
      )}
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

function App() {
  const { toasts, removeToast } = useToast();
  const { initialize, isAuthenticated } = useAuthStore();

  // Initialize auth from localStorage on app load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="app-atmosphere" aria-hidden="true" />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/app" replace /> : <><Login /><ToastContainer toasts={toasts} onClose={removeToast} /></>
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/app" replace /> : <><Register /><ToastContainer toasts={toasts} onClose={removeToast} /></>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<><AdminLogin /><ToastContainer toasts={toasts} onClose={removeToast} /></>} />
        <Route path="/admin/dashboard" element={<><AdminDashboard /><ToastContainer toasts={toasts} onClose={removeToast} /></>} />

        {/* Main App Routes (Protected) */}
        <Route path="/app" element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <><Settings /><ToastContainer toasts={toasts} onClose={removeToast} /></>
          </ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/app" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
