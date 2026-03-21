import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-400 rounded-full animate-spin" />
          <p className="text-rose-300 font-semibold text-sm tracking-widest uppercase">Carregando…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile) {
    const hasSeenIntro = profile.intro_completed;
    const isIntroRoute = location.pathname === '/intro';

    if (!hasSeenIntro && !isIntroRoute) {
      return <Navigate to="/intro" replace />;
    }
    if (hasSeenIntro && isIntroRoute) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
