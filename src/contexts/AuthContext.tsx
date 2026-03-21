import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  online_status: boolean;
  last_seen: string;
  intro_completed: boolean;
  home_image_url: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  onlineUsers: Set<string>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as Profile);
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setOnlineUsers(new Set());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Presence Effect
  useEffect(() => {
    if (!user) return;

    // Atualiza BD ao logar
    supabase.from('profiles')
      .update({ online_status: true, last_seen: new Date().toISOString() })
      .eq('id', user.id).then();

    const channel = supabase.channel('global_presence', {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlines = new Set<string>();
        for (const userId in state) {
          onlines.add(userId);
        }
        setOnlineUsers(onlines);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    const markOffline = () => {
      supabase.from('profiles')
        .update({ online_status: false, last_seen: new Date().toISOString() })
        .eq('id', user.id).then();
    };

    window.addEventListener('beforeunload', markOffline);

    return () => {
      window.removeEventListener('beforeunload', markOffline);
      markOffline();
      channel.unsubscribe();
    };
  }, [user]);

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error.message) };
    return { error: null };
  }

  async function signUp(email: string, password: string, username?: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username || email.split('@')[0] } }
    });
    if (error) return { error: translateError(error.message) };
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  function translateError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos.';
    if (msg.includes('Email not confirmed')) return 'Confirme seu email antes de entrar.';
    if (msg.includes('User already registered')) return 'Este email já está cadastrado.';
    if (msg.includes('Password should be at least')) return 'A senha deve ter no mínimo 6 caracteres.';
    if (msg.includes('Unable to validate email')) return 'Email inválido.';
    return msg;
  }

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-sm space-y-6">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-800">Ué, faltou o Supabase!</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            As chaves de conexão não foram encontradas. Se você estiver na Vercel, adicione 
            <code className="bg-rose-50 px-1 rounded text-rose-500 mx-1">VITE_SUPABASE_URL</code> e 
            <code className="bg-rose-50 px-1 rounded text-rose-500 mx-1">VITE_SUPABASE_ANON_KEY</code> no painel de Environment Variables!
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-rose-400 text-white rounded-full font-bold shadow-lg shadow-rose-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, onlineUsers, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
