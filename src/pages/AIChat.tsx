import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// --- Types ---
interface HistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

// --- Typewriter Hook ---
function useTypewriter(onComplete?: () => void) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const type = useCallback((fullText: string) => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;

    // Adaptive speed: longer text = slightly faster typing
    const baseSpeed = Math.max(12, Math.min(35, 2500 / fullText.length));

    const tick = () => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        timeoutRef.current = setTimeout(tick, baseSpeed);
      } else {
        setIsTyping(false);
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(tick, 200);
  }, [onComplete]);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayedText('');
    setIsTyping(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { displayedText, isTyping, type, reset };
}

// --- Blinking Cursor ---
function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ repeat: Infinity, duration: 0.5, repeatType: 'reverse' }}
      className="inline-block w-[2px] h-[1.1em] bg-cyan-400 align-middle ml-0.5"
    />
  );
}

// --- Main Component ---
export default function AIChat() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'intro-typing' | 'intro-done' | 'idle' | 'typing-response' | 'done'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [aiText, setAiText] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTypeComplete = useCallback(() => {
    setPhase((prev) => {
      if (prev === 'intro-typing') {
        if (user) {
          localStorage.setItem(`amethyst_ai_intro_seen_${user.id}`, 'true');
        }
        return 'intro-done';
      }
      return 'done';
    });
  }, [user]);

  const { displayedText, isTyping, type, reset } = useTypewriter(handleTypeComplete);

  // Verificação de primeira visita (Apresentação da IA)
  useEffect(() => {
    if (!user) return;
    const seen = localStorage.getItem(`amethyst_ai_intro_seen_${user.id}`);
    if (!seen) {
      setPhase('intro-typing');
      const introTimer = setTimeout(() => {
        type("Olá. Eu sou a Amethyst IA. Fui criada para ajudar, aprender e acompanhar você nesta jornada. Seja bem-vindo(a).");
      }, 600);
      return () => clearTimeout(introTimer);
    } else {
      setPhase('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, type]);

  // Áudio de digitação
  useEffect(() => {
    if (isTyping && audioRef.current) {
      audioRef.current.volume = 0.15; // Volume mais baixo e sutil
      audioRef.current.play().catch(console.warn);
    } else if (!isTyping && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isTyping]);

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading) return;

    setError(null);
    setIsLoading(true);
    setPhase('typing-response');
    setInput('');
    reset();

    const newHistory = [...history, { role: 'user' as const, content: message }];

    try {
      const { data, error: fnError } = await supabase.functions.invoke('groq-chat', {
        body: {
          message,
          history: history.slice(-6), // send last 6 messages as context
        },
      });

      if (fnError) throw fnError;
      if (!data?.response) throw new Error('Resposta vazia da IA.');

      const responseText: string = data.response;
      setAiText(responseText);
      setHistory([...newHistory, { role: 'assistant', content: responseText }]);
      type(responseText);
    } catch (err) {
      console.error('AI Chat error:', err);
      setError('Não consegui me conectar à IA. Verifique sua conexão e tente novamente.');
      setPhase('done');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  };

  // Focus input when done
  useEffect(() => {
    if (phase === 'done' && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, [phase]);

  const showInput = phase === 'idle' || phase === 'done' || phase === 'intro-done';
  const showResponse = displayedText.length > 0;
  const showPendingDots = phase === 'typing-response' && !displayedText;

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col relative overflow-hidden">
      {/* Background ambience */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-20 flex items-center gap-4 px-5 pt-10 pb-4">
        <Link
          to="/"
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <Sparkles size={16} className="text-cyan-400" />
          </motion.div>
          <span className="text-zinc-400 text-sm font-light tracking-[0.2em] uppercase">
            Amethyst IA
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-40 relative z-10">
        <AnimatePresence mode="wait">
          {/* Idle state: just show a subtle hint */}
          {phase === 'idle' && history.length === 0 && (
            <motion.div
              key="idle-hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-16 h-16 rounded-full border border-cyan-400/20 bg-cyan-400/5 flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles size={24} className="text-cyan-400/60" />
              </motion.div>
              <p className="text-zinc-600 text-sm tracking-widest uppercase">
                pronto para conversar
              </p>
            </motion.div>
          )}

          {/* Pending dots before text starts */}
          {showPendingDots && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-cyan-400/60"
                  animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          )}

          {/* AI response text with typewriter */}
          {showResponse && displayedText && (
            <motion.div
              key="response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-lg"
            >
              <p
                className="text-zinc-100 text-lg sm:text-xl leading-relaxed font-light tracking-wide"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {displayedText}
                {isTyping && <Cursor />}
              </p>
            </motion.div>
          )}

          {/* Error state */}
          {error && phase === 'done' && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center max-w-sm"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </main>

      {/* Input area - fixed to bottom */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            key="input-area"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-8 pt-4"
            style={{
              background:
                'linear-gradient(to top, rgba(8,12,20,1) 80%, transparent)',
            }}
          >
            <div className="max-w-lg mx-auto">
              <div className="flex items-end gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-cyan-400/40 transition-all duration-300">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResize();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Converse com a IA..."
                  rows={1}
                  className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 text-sm resize-none focus:outline-none leading-relaxed max-h-[120px]"
                  style={{ fontFamily: 'inherit' }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors"
                >
                  <Send size={15} />
                </motion.button>
              </div>
              <p className="text-zinc-700 text-[10px] text-center mt-2 tracking-widest uppercase">
                Enter para enviar · Shift+Enter para nova linha
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef} 
        src="https://qiilerbewoloaijqloem.supabase.co/storage/v1/object/public/sounds/u_jww7bj79ux-binary-code-interface-sound-effects-sci-fi-computer-ui-sounds-209403.mp3" 
        loop
      />
    </div>
  );
}
