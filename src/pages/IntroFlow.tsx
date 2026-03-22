import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, CheckSquare, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const TypewriterText = ({ text, delay = 0, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <p className="text-zinc-300 font-medium text-lg leading-relaxed">{displayedText}</p>;
};

export default function IntroFlow() {
  const [step, setStep] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

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
    if (step < 6) {
      setStep(prev => prev + 1);
    } else {
      setIsFinishing(true);
      await stopMusicSmooth();
      await finishIntro();
    }
  };

  const showLoading = (nextStep: number, phrase: string) => {
    setLoadingText(phrase);
    setStep(-1);
    setTimeout(() => {
      setStep(nextStep);
    }, 2000);
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

  return (
    <div className="min-h-screen bg-[#130B1C] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Música de fundo invisível */}
      <audio id="introMusic" ref={audioRef} preload="auto" loop className="hidden">
        <source src="https://qiilerbewoloaijqloem.supabase.co/storage/v1/object/public/assets/intro_music.mp3" type="audio/mpeg" />
      </audio>

      {/* Background stars effect */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <AnimatePresence mode="wait">
        {step === -1 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center z-10 text-center"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Heart className="text-pink-300 fill-pink-300 w-12 h-12 mb-6 shadow-pink-500/50 drop-shadow-2xl" />
            </motion.div>
            <p className="text-zinc-400 text-sm tracking-widest uppercase font-semibold">The Celestial Narrative © 2024</p>
            <p className="text-zinc-200 text-lg mt-2 font-serif">{loadingText}</p>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 flex flex-col items-center text-center z-10"
          >
            <div className="w-16 h-16 bg-[#2B1045] rounded-full flex items-center justify-center mb-8 shadow-inner shadow-pink-500/20">
              <Heart className="text-pink-300 fill-pink-300 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-6 font-medium">Oi meu amor ❤️</h2>
            <div className="h-40 mb-8 max-w-xs text-left">
              <TypewriterText text="Eu fiz esse lugar pensando em você... Cada detalhe aqui tem um pedacinho do meu coração. Porque você faz minha vida mais bonita. Bem-vinda ao nosso cantinho especial." onComplete={handleTypingComplete} />
            </div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: typingComplete ? 1 : 0 }}
              disabled={!typingComplete}
              onClick={() => showLoading(1, 'Sinta a magia...')}
              className="w-full sm:w-auto px-8 py-3 bg-[#2B1045] hover:bg-[#3d1763] text-pink-100 rounded-full font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 border border-pink-500/30 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:cursor-default"
            >
              Próximo ❤️ <ArrowRight size={16} />
            </motion.button>
            <p className="text-zinc-500 text-[10px] italic tracking-widest uppercase mt-12 mb-0">The Celestial Narrative</p>
          </motion.div>
        )}

        {[1, 2, 3, 4].includes(step) && (
          <motion.div
            key={`question${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 flex flex-col items-center text-center z-10"
          >
            <Sparkles className="text-pink-300 w-10 h-10 mb-8" />
            <h2 className="text-2xl font-serif text-white mb-10 leading-snug">
              {step === 1 && "Você gosta de passar tempo comigo? 😊"}
              {step === 2 && "Eu consigo te fazer sorrir?"}
              {step === 3 && "Você se sente feliz quando estamos juntos?"}
              {step === 4 && "Você quer continuar criando memórias comigo?"}
            </h2>
            <div className="w-full space-y-4">
              <button onClick={() => step === 4 ? showLoading(5, 'Preparando o contrato...') : setStep(step + 1)} className="w-full py-4 bg-pink-200 hover:bg-pink-300 text-pink-900 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,165,165,0.2)]">
                <CheckSquare size={18} /> Sim ❤️
              </button>
              <button onClick={() => step === 4 ? showLoading(5, 'Preparando o contrato...') : setStep(step + 1)} className="w-full py-4 bg-[#2B1045]/50 hover:bg-[#3d1763]/80 border border-white/10 text-pink-100 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-yellow-400" /> Claro que sim 😄
              </button>
            </div>
            <div className="flex gap-2 mt-8 opacity-40">
              {[1, 2, 3, 4].map((i) => (
                 <div key={i} className={cn("h-1.5 rounded-full", step === i ? "w-6 bg-pink-300" : "w-1.5 bg-zinc-500")} />
              ))}
            </div>
            <p className="text-zinc-600 text-[10px] tracking-widest uppercase mt-4">The Celestial Narrative • Page 0{step}</p>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="contract"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 flex flex-col z-10"
          >
            <div className="flex flex-col items-center mb-8">
              <Heart className="text-pink-300 fill-pink-300 w-12 h-12 mb-4 drop-shadow-lg" />
              <h2 className="text-xl font-serif text-pink-200">❤️ Termo Oficial de Amor</h2>
            </div>
            <ul className="space-y-6 text-zinc-300 text-sm font-medium mb-10 text-left">
              <li className="flex items-start gap-3"><span className="w-2 h-2 mt-1.5 rounded-full bg-pink-400 shrink-0"/>Receber carinho ilimitado</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 mt-1.5 rounded-full bg-pink-400 shrink-0"/>Compartilhar risadas diariamente</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 mt-1.5 rounded-full bg-pink-400 shrink-0"/>Criar memórias especiais juntos</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 mt-1.5 rounded-full bg-pink-400 shrink-0"/>Ser minha parceira nas aventuras da vida</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 mt-1.5 rounded-full bg-pink-400 shrink-0"/>Continuar essa linda história comigo</li>
            </ul>
            <p className="text-center font-serif text-pink-200 italic mb-8 border-t border-white/10 pt-6">"Prometo zelar por cada detalhe do nosso laço, hoje e sempre."</p>
            <button onClick={() => showLoading(6, 'Selando o nosso amor...')} className="w-full py-4 bg-pink-200 hover:bg-pink-300 text-pink-900 rounded-[2rem] font-bold tracking-widest text-sm shadow-[0_0_30px_rgba(244,165,165,0.3)] transition-all">
              ACEITO ESSE AMOR ❤️
            </button>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center z-10 w-full max-w-md px-6"
          >
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Heart className="text-pink-400 fill-pink-400 w-24 h-24 mb-6 filter drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
            </motion.div>
            <h1 className="text-3xl font-serif text-white mb-4">Agora é oficial...</h1>
            <p className="text-zinc-300 text-lg mb-12">Você faz parte do meu mundo ❤️</p>
            <button 
              onClick={handleNextStep} 
              disabled={isFinishing}
              className="w-full max-w-[280px] py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full font-bold shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
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
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
