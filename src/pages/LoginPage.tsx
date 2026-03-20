import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Se já estiver logado redireciona
  if (!loading && user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error } = await signUp(email, password, username);
      if (error) {
        setError(error);
      } else {
        setSuccess('Conta criada! Verifique seu email para confirmar o cadastro, ou entre diretamente se a confirmação estiver desabilitada.');
      }
    }

    setSubmitting(false);
  }

  function toggleMode() {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError(null);
    setSuccess(null);
  }

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      {/* Decoração de fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-100/60 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card principal */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(244,63,94,0.12)] border border-rose-100 p-8 space-y-8">
          
          {/* Logo */}
          <div className="flex flex-col items-center space-y-3">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-200"
            >
              <Heart className="text-white fill-white" size={32} />
            </motion.div>
            <div className="text-center">
              <h1 className="font-headline italic text-3xl font-bold text-rose-400">Amethyst Rose</h1>
              <p className="text-zinc-400 text-sm font-medium mt-1">
                {mode === 'login' ? 'Bem-vindo de volta 💕' : 'Crie sua conta 🌹'}
              </p>
            </div>
          </div>

          {/* Toggle modo */}
          <div className="bg-rose-50 rounded-2xl p-1 flex">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white text-rose-400 shadow-sm shadow-rose-100'
                  : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-white text-rose-400 shadow-sm shadow-rose-100'
                  : 'text-zinc-400 hover:text-rose-300'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300">
                      <User size={18} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="Seu nome / apelido"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-rose-50/80 rounded-2xl text-zinc-700 placeholder-zinc-300 text-sm font-medium outline-none border border-transparent focus:border-rose-200 focus:bg-white transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-4 bg-rose-50/80 rounded-2xl text-zinc-700 placeholder-zinc-300 text-sm font-medium outline-none border border-transparent focus:border-rose-200 focus:bg-white transition-all"
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-11 pr-12 py-4 bg-rose-50/80 rounded-2xl text-zinc-700 placeholder-zinc-300 text-sm font-medium outline-none border border-transparent focus:border-rose-200 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-rose-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Erro */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-red-500 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-emerald-600 text-sm font-medium"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : mode === 'login' ? (
                'Entrar'
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-zinc-300 text-xs font-semibold uppercase tracking-widest">
            {mode === 'login' ? (
              <>Não tem conta?{' '}
                <button onClick={toggleMode} className="text-rose-400 hover:text-rose-500 transition-colors">
                  Cadastre-se
                </button>
              </>
            ) : (
              <>Já tem conta?{' '}
                <button onClick={toggleMode} className="text-rose-400 hover:text-rose-500 transition-colors">
                  Faça login
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
