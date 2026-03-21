import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  Image as ImageIcon, 
  MessageSquare, 
  PlayCircle, 
  User, 
  GraduationCap, 
  Heart
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import FinancePage from './pages/FinancePage';
import GalleryPage from './pages/GalleryPage';
import ChatPage from './pages/ChatPage';
import ChatRoom from './pages/ChatRoom';
import VideosPage from './pages/VideosPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import IntroFlow from './pages/IntroFlow';

function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/finance', icon: Wallet, label: 'Finanças' },
    { path: '/gallery', icon: ImageIcon, label: 'Galeria' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav 
      translate="no" 
      className="notranslate fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-rose-100 px-2 py-3 z-50 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              translate="no"
              className={cn(
                "notranslate flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 flex-1 min-w-0 max-w-[20%]",
                isActive ? "text-rose-400 scale-110" : "text-zinc-400 hover:text-rose-300"
              )}
            >
              <item.icon className="flex-shrink-0" size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center overflow-hidden whitespace-nowrap leading-none">
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="w-1 h-1 bg-rose-400 rounded-full mt-0.5"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AppHeader() {
  const { profile, user } = useAuth();
  const displayName = profile?.username || user?.email?.split('@')[0] || '?';
  const avatarSeed = user?.id?.slice(0, 8) || 'default';
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}`;

  return (
    <header className="sticky top-0 z-40 bg-rose-50/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 flex-1 min-w-0 mr-4">
        <Heart className="flex-shrink-0 text-rose-400 fill-rose-400" size={24} />
        <h1 className="font-headline italic text-2xl font-bold text-rose-400 truncate">Amethyst Rose ✨</h1>
      </Link>
      <Link to="/profile" className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-rose-200 bg-rose-100">
        <img 
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      </Link>
    </header>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen pb-24 bg-rose-50">
      <AppHeader />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:userId" element={<ChatRoom />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Rota catch-all redireciona para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública: tela de login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/intro" 
            element={
              <ProtectedRoute>
                <IntroFlow />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
