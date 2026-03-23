import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, CheckSquare, ArrowRight, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const TypewriterText = ({ text, delay = 0, onComplete, className }: { text: string, delay?: number, onComplete?: () => void, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let i = 0;
    
    const startTyping = () => {
      // Usar a referência global de áudio se disponível pelo pai, ou criar uma aqui se necessário
      // Mas para otimizar, o som de digitação pode ser controlado globalmente. 
      // Por enquanto, apenas otimizamos o ciclo de vida:
      const typingAudio = new Audio('https://qiilerbewoloaijqloem.supabase.co/storage/v1/object/public/sounds/u_jww7bj79ux-binary-code-interface-sound-effects-sci-fi-computer-ui-sounds-209403.mp3');
      typingAudio.loop = true;
      typingAudio.volume = 0.4;

      typingAudio.play().catch(() => {});
      interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          typingAudio.pause();
          if (onComplete) onComplete();
        }
      }, 90);

      return typingAudio;
    };

    let audio: HTMLAudioElement | undefined;
    const timeout = setTimeout(() => {
      audio = startTyping();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [text, delay, onComplete]);

  return <span className={className || "block text-zinc-300 font-medium text-lg leading-relaxed will-change-contents"}>{displayedText}</span>;
};

const questions = [
  { step: 2, text: 'Você gosta de passar tempo comigo? 😊' },
  { step: 3, text: 'Eu consigo te fazer sorrir?' },
  { step: 4, text: 'Você se sente feliz quando estamos juntos?' },
  { step: 5, text: 'Você quer continuar criando memórias comigo?' },
];

export default function IntroFlow() {
  const [step, setStep] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const [titlePhase, setTitlePhase] = useState<'typing' | 'done'>('typing');

  // State for the reason input flow
  const [simClickedStep, setSimClickedStep] = useState<number | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [isSavingReason, setIsSavingReason] = useState(false);
  const [savedReasons, setSavedReasons] = useState<Record<number, string>>({});

  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTypingComplete = useCallback(() => {
    setTypingComplete(true);
  }, []);

  useEffect(() => {
    const music = audioRef.current;
    if (music) {
      music.volume = 0.8;
      music.play().catch(() => {
        const startOnInteraction = () => {
          music.play();
          document.removeEventListener('click', startOnInteraction);
          document.removeEventListener('touchstart', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
      });
    }
  }, []);

  // Focus textarea when reason input appears
  useEffect(() => {
    if (simClickedStep !== null && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [simClickedStep]);

  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickAudioRef.current = new Audio('https://qiilerbewoloaijqloem.supabase.co/storage/v1/object/public/sounds/click.mp3.mp3');
    if (clickAudioRef.current) clickAudioRef.current.preload = 'auto';

    loadingAudioRef.current = new Audio('https://qiilerbewoloaijqloem.supabase.co/storage/v1/object/public/sounds/u_jww7bj79ux-binary-code-interface-sound-effects-sci-fi-computer-ui-sounds-209403.mp3');
    if (loadingAudioRef.current) {
      loadingAudioRef.current.loop = true;
      loadingAudioRef.current.volume = 0.4;
      loadingAudioRef.current.preload = 'auto';
    }
  }, []);

  const playClick = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  const stopMusicSmooth = () => {
    return new Promise<void>((resolve) => {
      const music = audioRef.current;
      if (!music) {
        resolve();
        return;
      }
      
      let volume = music.volume;
      const fade = setInterval(() => {
        if (volume > 0.05) {
          volume -= 0.05;
          music.volume = volume;
        } else {
          music.pause();
          clearInterval(fade);
          resolve();
        }
      }, 60);
    });
  };

  const handleNextStep = async () => {
    playClick();
    if (step < 7) {
      setStep(prev => prev + 1);
    } else {
      setIsFinishing(true);
      await stopMusicSmooth();
      await finishIntro();
    }
  };

  const showLoading = (nextStep: number, phrase: string) => {
    playClick();
    setLoadingText(phrase);
    setTypingComplete(false);
    setStep(-1);

    if (loadingAudioRef.current) {
      loadingAudioRef.current.currentTime = 0;
      loadingAudioRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      if (loadingAudioRef.current) {
        loadingAudioRef.current.pause();
      }
      setStep(nextStep);
    }, 6000);
  };

  const finishIntro = async () => {
    if (user) {
      setIsFinishing(true);
      try {
        const { error } = await supabase.from('profiles').update({ intro_completed: true }).eq('id', user.id);
        if (error) throw error;
        await refreshProfile();
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Erro ao finalizar intro:', err);
        alert('Erro ao salvar progresso. Tente novamente.');
      } finally {
        setIsFinishing(false);
      }
    } else {
      navigate('/login', { replace: true });
    }
  };

  // Called when user clicks "Sim ❤️"
  const handleSimClick = (currentStep: number) => {
    playClick();
    setSimClickedStep(currentStep);
    setReasonText('');
  };

  // Save the reason to DB and advance
  const handleReasonSubmit = async (currentStep: number) => {
    playClick();
    setIsSavingReason(true);
    const questionObj = questions.find(q => q.step === currentStep);

    try {
      if (user && questionObj) {
        await supabase.from('intro_answers').insert({
          user_id: user.id,
          question_step: currentStep,
          question_text: questionObj.text,
          answer_reason: reasonText.trim() || null,
        });
      }
    } catch (err) {
      console.error('Erro ao salvar resposta:', err);
    } finally {
      setSavedReasons(prev => ({ ...prev, [currentStep]: reasonText }));
      setSimClickedStep(null);
      setReasonText('');
      setIsSavingReason(false);

      // Advance to next step
      if (currentStep === 5) {
        showLoading(6, 'Preparando o contrato...');
      } else {
        setStep(currentStep + 1);
      }
    }
  };

  // Skip reason (user didn't want to write)
  const handleSkipReason = (currentStep: number) => {
    playClick();
    setSimClickedStep(null);
    setReasonText('');
    if (currentStep === 5) {
      showLoading(6, 'Preparando o contrato...');
    } else {
      setStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#130B1C] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Música de fundo invisível */}
      <audio id="introMusic" ref={audioRef} preload="auto" loop className="hidden">
        <source src="https://qiilerbewoloaijqloem.supabase.co/storage/v1/object/public/assets/intro_music.mp3" type="audio/mpeg" />
      </audio>

      {/* Neon background grid and orb effects - Optimized with CSS animation for mobile/desktop */}
      <style>{`
        @keyframes moveGrid {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
        @keyframes pulseOrb {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        .neon-grid {
          animation: moveGrid 10s linear infinite, pulseOpacity 6s ease-in-out infinite;
          will-change: background-position, opacity;
        }
        .neon-orb {
          animation: pulseOrb 8s ease-in-out infinite;
          background: radial-gradient(circle at 50% 50%, rgba(236,72,153,0.25), transparent 60%);
          will-change: transform, opacity;
        }
        .neon-card {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          will-change: transform, opacity;
        }
        :root {
          --heart-filter-1: drop-shadow(0 0 15px #ec4899);
          --heart-filter-2: drop-shadow(0 0 35px #f4a5a5);
          --btn-shadow: 0 0 20px #ec4899;
          --txt-shadow: 0 0 10px #ec4899;
        }
        /* Mobile Specific Optimizations */
        @media (max-width: 640px) {
          :root {
            --heart-filter-1: none;
            --heart-filter-2: none;
            --btn-shadow: 0 0 5px rgba(236, 72, 153, 0.3);
            --txt-shadow: none;
          }
          .neon-grid {
            animation: moveGrid 20s linear infinite; /* Slower animation on mobile */
            opacity: 0.15 !important;
          }
          .neon-card {
             backdrop-filter: none !important; /* Disables heavy backdrop-blur on mobile */
             -webkit-backdrop-filter: none !important;
             background-color: rgba(30, 13, 48, 0.98) !important; /* More solid background for readability */
             box-shadow: 0 0 15px rgba(236, 72, 153, 0.2) !important; /* Lighter shadow */
             border-width: 1px !important;
          }
          .neon-text-main {
             text-shadow: 0 0 8px #ec4899 !important; /* Lighter text-shadow */
          }
          .neon-orb {
             animation: none !important; /* Disable background pulse on mobile */
             opacity: 0.15 !important;
             transform: scale(1) !important;
          }
          /* Optimization for motion components on mobile */
          .mobile-no-filter {
            filter: none !important;
            -webkit-filter: none !important;
          }
        }
      `}</style>
      <div
        className="absolute inset-0 z-0 pointer-events-none neon-grid"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(236, 72, 153, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.2) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      />
      
      {/* Huge Neon Orb glow in the background - Now in CSS */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen neon-orb" />

      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center z-10 text-center"
          >
            <motion.div 
              className="will-change-[transform,filter]"
              animate={{ 
                scale: [1, 1.2, 1], 
                rotate: [0, 5, -5, 0], 
                filter: ['var(--heart-filter-1)', 'var(--heart-filter-2)', 'var(--heart-filter-1)'] 
              }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="text-pink-400 fill-pink-400 w-12 h-12 mb-6" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-zinc-400 text-sm tracking-widest uppercase font-semibold"
            >
              The Celestial Narrative © 2024
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-zinc-200 text-lg mt-2 font-serif"
            >
              {loadingText}
            </motion.p>
            <div className="flex gap-2 mt-4">
              <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md bg-purple-950/20 rounded-3xl p-8 sm:p-12 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3),inset_0_0_20px_rgba(236,72,153,0.2)] flex flex-col items-center text-center z-10 min-h-[440px] will-change-transform neon-card"
          >
            {titlePhase === 'typing' ? (
              <div className="flex-1 flex items-center justify-center w-full">
                <motion.h2 layoutId="title_amor" className="text-4xl sm:text-5xl font-serif text-pink-50 font-medium tracking-wider neon-text-main [text-shadow:0_0_15px_#ec4899,0_0_30px_#f4a5a5,0_0_15px_#ec4899]">
                  <TypewriterText text="Oi meu amor ❤️" delay={800} onComplete={() => setTimeout(() => setTitlePhase('done'), 1500)} className="inline" />
                </motion.h2>
              </div>
            ) : (
              <>
                <motion.div 
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1, boxShadow: ["0 0 10px #ec4899", "0 0 30px #ec4899", "0 0 10px #ec4899"] }}
                  transition={{ scale: { delay: 0.4, type: "spring", stiffness: 200 }, rotate: { delay: 0.4, type: "spring" }, opacity: { delay: 0.4 }, boxShadow: { repeat: Infinity, duration: 2 } }}
                  className="w-16 h-16 bg-[#2B1045] rounded-full flex items-center justify-center mb-8"
                >
                  <motion.div animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 8px #f4a5a5)', 'drop-shadow(0 0 16px #f4a5a5)', 'drop-shadow(0 0 8px #f4a5a5)'] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Heart className="text-pink-300 fill-pink-300 w-8 h-8" />
                  </motion.div>
                </motion.div>
                
                <motion.h2 
                  layoutId="title_amor"
                  className="text-3xl font-serif text-pink-50 mb-6 font-medium tracking-wider neon-text-main [text-shadow:0_0_10px_#ec4899,0_0_20px_#f4a5a5,0_0_10px_#ec4899]"
                >
                  Oi meu amor ❤️
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="min-h-[240px] sm:min-h-[160px] mb-8 max-w-xs text-left w-full flex-grow"
                >
                  <TypewriterText text="Eu fiz esse lugar pensando em você... Cada detalhe aqui tem um pedacinho do meu coração. Porque você faz minha vida mais bonita. Bem-vinda ao nosso cantinho especial." onComplete={handleTypingComplete} delay={1000} />
                </motion.div>
                
                <motion.button
                  initial={{ opacity: 0, boxShadow: "0 0 0px #ec4899" }}
                  animate={{ opacity: typingComplete ? 1 : 0, boxShadow: typingComplete ? ["0 0 15px rgba(236,72,153,0.6)", "0 0 35px rgba(236,72,153,0.8)", "0 0 15px rgba(236,72,153,0.6)"] : "0 0 0px #ec4899" }}
                  transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
                  disabled={!typingComplete}
                  onClick={() => showLoading(1, 'Sinta a magia...')}
                  className="w-full sm:w-auto px-8 py-3 bg-pink-600/20 hover:bg-pink-500 text-pink-50 rounded-full font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 border border-pink-400 hover:border-pink-300 disabled:cursor-default disabled:border-pink-500/30 disabled:bg-[#2B1045]"
                >
                  Próximo ❤️ <ArrowRight size={16} />
                </motion.button>
                <p className="text-zinc-500 text-[10px] italic tracking-widest uppercase mt-12 mb-0">The Celestial Narrative - 1/2</p>
              </>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md bg-purple-950/20 rounded-3xl p-8 sm:p-12 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3),inset_0_0_20px_rgba(236,72,153,0.2)] flex flex-col items-center text-center z-10 neon-card"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0, boxShadow: ["0 0 10px #ec4899", "0 0 30px #ec4899", "0 0 10px #ec4899"] }}
              transition={{ scale: { delay: 0.2, type: "spring", stiffness: 200 }, rotate: { delay: 0.2, type: "spring" }, boxShadow: { repeat: Infinity, duration: 2 } }}
              className="w-16 h-16 bg-[#2B1045] rounded-full flex items-center justify-center mb-8"
            >
              <motion.div animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 8px #f4a5a5)', 'drop-shadow(0 0 16px #f4a5a5)', 'drop-shadow(0 0 8px #f4a5a5)'] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Heart className="text-pink-300 fill-pink-300 w-8 h-8" />
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="min-h-[160px] mb-8 max-w-xs text-center w-full flex-grow flex items-center justify-center font-serif"
            >
              <TypewriterText text="Te amo mais do que consigo explicar ❤️" onComplete={handleTypingComplete} delay={300} />
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, boxShadow: "0 0 0px #ec4899" }}
              animate={{ opacity: typingComplete ? 1 : 0, boxShadow: typingComplete ? ["0 0 15px rgba(236,72,153,0.6)", "0 0 35px rgba(236,72,153,0.8)", "0 0 15px rgba(236,72,153,0.6)"] : "0 0 0px #ec4899" }}
              transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
              disabled={!typingComplete}
              onClick={() => showLoading(2, 'Preparando as perguntas...')}
              className="w-full sm:w-auto px-8 py-3 bg-pink-600/20 hover:bg-pink-500 text-pink-50 rounded-full font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 border border-pink-400 hover:border-pink-300 disabled:cursor-default disabled:border-pink-500/30 disabled:bg-[#2B1045]"
            >
              Próximo ❤️ <ArrowRight size={16} />
            </motion.button>
            <p className="text-zinc-500 text-[10px] italic tracking-widest uppercase mt-12 mb-0">The Celestial Narrative - 2/2</p>
          </motion.div>
        )}

        {[2, 3, 4, 5].includes(step) && (
          <motion.div
            key={`question${step}`}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            className="w-full max-w-md bg-purple-950/20 rounded-3xl p-8 sm:p-12 border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3),inset_0_0_20px_rgba(236,72,153,0.2)] flex flex-col items-center text-center z-10 will-change-transform neon-card"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 10px #ec4899)', 'drop-shadow(0 0 25px #f4a5a5)', 'drop-shadow(0 0 10px #ec4899)'] }}
              transition={{ rotate: { repeat: Infinity, duration: 8, ease: "linear" }, scale: { repeat: Infinity, duration: 2 }, filter: { repeat: Infinity, duration: 2 } }}
            >
              <Sparkles className="text-pink-300 w-10 h-10 mb-8" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, textShadow: ['0 0 10px #ec4899', '0 0 20px #f4a5a5', '0 0 10px #ec4899'] }}
              transition={{ opacity: { delay: 0.3 }, y: { delay: 0.3 }, textShadow: { repeat: Infinity, duration: 2.5 } }}
              className="text-2xl font-serif text-pink-50 mb-10 leading-snug tracking-wide"
            >
              {step === 2 && "Você gosta de passar tempo comigo? 😊"}
              {step === 3 && "Eu consigo te fazer sorrir?"}
              {step === 4 && "Você se sente feliz quando estamos juntos?"}
              {step === 5 && "Você quer continuar criando memórias comigo?"}
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full space-y-4"
            >
              {/* Botão SIM */}
              <motion.button
                onClick={() => handleSimClick(step)}
                animate={{ 
                  boxShadow: simClickedStep === step 
                    ? "0 0 30px #f4a5a5" 
                    : ["0 0 15px rgba(236,72,153,0.5)", "0 0 25px rgba(236,72,153,0.8)", "0 0 15px rgba(236,72,153,0.5)"] 
                }}
                transition={{ boxShadow: { repeat: Infinity, duration: 1.5 } }}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border",
                  simClickedStep === step
                    ? "bg-pink-400 text-white border-pink-300 scale-95"
                    : "bg-pink-500/20 hover:bg-pink-500 hover:text-white text-pink-100 border-pink-500"
                )}
              >
                <CheckSquare size={18} /> Sim ❤️
              </motion.button>

              {/* Área de razão — aparece quando clicou em Sim */}
              <AnimatePresence>
                {simClickedStep === step ? (
                  <motion.div
                    key="reason-input"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#1e0d30]/70 border border-pink-500/30 rounded-2xl p-4 flex flex-col gap-3">
                      <p className="text-pink-200 text-sm font-medium text-left">
                        💬 Me conta por que... ✨
                      </p>
                      <textarea
                        ref={textareaRef}
                        value={reasonText}
                        onChange={e => setReasonText(e.target.value)}
                        placeholder="Escreva aqui o que sentir no coração 💕"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-zinc-200 text-sm placeholder-zinc-600 resize-none focus:outline-none focus:border-pink-400/50 transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSkipReason(step)}
                          className="flex-1 py-2.5 rounded-xl text-zinc-400 text-sm font-medium border border-white/10 hover:border-white/20 hover:text-zinc-300 transition-all"
                        >
                          Pular
                        </button>
                        <button
                          onClick={() => handleReasonSubmit(step)}
                          disabled={isSavingReason}
                          className="flex-1 py-2.5 rounded-xl bg-pink-400/80 hover:bg-pink-400 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSavingReason ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <><Send size={14} /> Enviar</>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Botão "Claro que sim" só aparece se Sim não foi clicado */
                  <motion.button
                    key="claro-btn"
                    initial={{ opacity: 0, boxShadow: "0 0 0px #ec4899" }}
                    animate={{ opacity: 1, boxShadow: ["0 0 10px rgba(236,72,153,0.4)", "0 0 20px rgba(236,72,153,0.6)", "0 0 10px rgba(236,72,153,0.4)"] }}
                    transition={{ boxShadow: { repeat: Infinity, duration: 2.2 } }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleSimClick(step)}
                    className="w-full py-4 bg-purple-900/40 hover:bg-pink-500/40 border border-pink-500/50 text-pink-100 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} className="text-yellow-400 drop-shadow-[0_0_5px_#fde047]" /> Claro que sim 😄
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-2 mt-8 opacity-40">
              {[2, 3, 4, 5].map((i) => (
                 <div key={i} className={cn("h-1.5 rounded-full", step === i ? "w-6 bg-pink-300" : "w-1.5 bg-zinc-500")} />
              ))}
            </div>
            <p className="text-zinc-600 text-[10px] tracking-widest uppercase mt-4">The Celestial Narrative • Page 0{step}</p>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="contract"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="w-full max-w-md bg-purple-950/20 rounded-3xl p-6 sm:p-10 border border-pink-500/50 shadow-[0_0_40px_rgba(236,72,153,0.4),inset_0_0_20px_rgba(236,72,153,0.2)] flex flex-col z-10 relative overflow-hidden neon-card"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-purple-500/20 will-change-opacity"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="flex flex-col items-center mb-8 relative z-10">
              <motion.div 
                className="will-change-[transform,filter]"
                animate={{ 
                  scale: [1, 1.2, 1], 
                  filter: ['var(--heart-filter-1)', 'var(--heart-filter-2)', 'var(--heart-filter-1)'] 
                }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart className="text-pink-300 fill-pink-300 w-12 h-12 mb-4" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0, textShadow: ['var(--txt-shadow)', '0 0 25px #f4a5a5', 'var(--txt-shadow)'] }} 
                transition={{ opacity: { delay: 0.3 }, y: { delay: 0.3 }, textShadow: { repeat: Infinity, duration: 2.5 } }} 
                className="text-2xl font-serif text-pink-50 tracking-wide"
              >
                ❤️ Termo Oficial de Amor
              </motion.h2>
            </div>
            <ul className="space-y-6 text-zinc-300 text-sm font-medium mb-10 text-left relative z-10">
              {[
                "Receber carinho ilimitado",
                "Compartilhar risadas diariamente",
                "Criar memórias especiais juntos",
                "Ser minha parceira nas aventuras da vida",
                "Continuar essa linda história comigo"
              ].map((text, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.2 }}
                  className="flex items-start gap-3"
                >
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.2 + 0.2, type: "spring" }}
                    className="w-2 h-2 mt-1.5 rounded-full bg-pink-400 shrink-0 shadow-[0_0_8px_rgba(244,114,182,0.8)]"
                  />
                  {text}
                </motion.li>
              ))}
            </ul>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center font-serif text-pink-200 italic mb-8 border-t border-white/10 pt-6 relative z-10"
            >
              "Prometo zelar por cada detalhe do nosso laço, hoje e sempre."
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20, boxShadow: "0 0 0px #ec4899" }}
              animate={{ opacity: 1, y: 0, boxShadow: ["var(--btn-shadow)", "0 0 40px #f4a5a5", "var(--btn-shadow)"] }}
              transition={{ opacity: { delay: 2.2 }, y: { delay: 2.2 }, boxShadow: { repeat: Infinity, duration: 2 } }}
              onClick={() => showLoading(7, 'Selando o nosso amor...')} 
              className="w-full py-4 bg-pink-500 border border-pink-300 text-white rounded-[2rem] font-bold tracking-widest text-sm transition-all relative z-10 hover:scale-105 hover:bg-pink-400"
            >
              ACEITO ESSE AMOR ❤️
            </motion.button>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center justify-center text-center z-10 w-full max-w-md px-6"
          >
            <motion.div 
              className="will-change-[transform,filter]"
              animate={{ 
                scale: [1, 1.3, 1], 
                rotate: [0, 5, -5, 0], 
                filter: ['drop-shadow(0 0 20px #ec4899)', 'var(--heart-filter-2)', 'drop-shadow(0 0 20px #ec4899)'] 
              }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart className="text-pink-400 fill-pink-400 w-24 h-24 mb-6" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, textShadow: ['0 0 15px #ec4899', '0 0 30px #f4a5a5', '0 0 15px #ec4899'] }}
              transition={{ opacity: { delay: 0.4 }, y: { delay: 0.4 }, textShadow: { repeat: Infinity, duration: 2.5 } }}
              className="text-4xl font-serif text-pink-50 mb-4 tracking-widest uppercase font-bold"
            >
              Agora é oficial...
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, textShadow: ['0 0 5px #ec4899', '0 0 15px #ec4899', '0 0 5px #ec4899'] }}
              transition={{ opacity: { delay: 0.8 }, textShadow: { repeat: Infinity, duration: 3 } }}
              className="text-pink-200 text-xl font-medium mb-12"
            >
              Você faz parte do meu mundo ❤️
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="w-full will-change-[opacity,transform]"
            >
              <motion.button 
                animate={{ boxShadow: ["var(--btn-shadow)", "0 0 50px #ec4899", "var(--btn-shadow)"] }}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={handleNextStep} 
                disabled={isFinishing}
                className="w-full max-w-[280px] py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold border-2 border-pink-400 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:hover:scale-100"
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Entrando...
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} /> Entrar no aplicativo ❤️
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
