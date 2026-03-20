import { motion } from 'motion/react';
import { Heart, Sparkles, TrendingUp, Camera, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8"
    >
      <section className="relative rounded-3xl overflow-hidden aspect-[4/5] editorial-shadow group">
        <img 
          src="https://picsum.photos/seed/romantic-couple/800/1000" 
          alt="Couple" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="glass-card p-6 rounded-2xl">
            <p className="font-headline italic text-zinc-800 text-center text-lg leading-relaxed">
              "Em cada detalhe teu, vejo um milhão de motivos para te amar."
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Link to="/finance" className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-rose-100 transition-colors">
          <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-500">
            <TrendingUp size={24} />
          </div>
          <span className="font-semibold text-sm">Finanças</span>
        </Link>
        <Link to="/gallery" className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-rose-100 transition-colors">
          <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-500">
            <Camera size={24} />
          </div>
          <span className="font-semibold text-sm">Galeria</span>
        </Link>
        <Link to="/chat" className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-rose-100 transition-colors">
          <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-500">
            <MessageCircle size={24} />
          </div>
          <span className="font-semibold text-sm">Chat</span>
        </Link>
        <Link to="/quizzes" className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-rose-100 transition-colors">
          <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-500">
            <Sparkles size={24} />
          </div>
          <span className="font-semibold text-sm">Quizzes</span>
        </Link>
      </section>

      <section className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <Heart size={20} fill="currentColor" />
          <h3 className="font-headline font-bold text-xl">Nossa Jornada</h3>
        </div>
        <p className="text-zinc-600 text-sm leading-relaxed">
          Bem-vindos ao seu espaço seguro. Aqui guardamos nossos sonhos, nossas economias e nossas memórias mais preciosas.
        </p>
      </section>
    </motion.div>
  );
}
