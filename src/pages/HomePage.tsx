import { motion } from 'motion/react';
import { Heart, Sparkles, TrendingUp, Camera, MessageCircle, Edit2, Loader2, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useState, useRef } from 'react';

export default function HomePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `home_${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `home_featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ home_image_url: publicUrl })
        .eq('id', user.id);

      if (dbError) throw dbError;

      await refreshProfile();
    } catch (err) {
      console.error('Error uploading home image:', err);
      alert('Erro ao carregar a imagem. Verifique se o bucket "gallery" permite uploads.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8"
    >
      <section className="relative rounded-3xl overflow-hidden aspect-[4/5] editorial-shadow group">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/30 shadow-lg"
          >
            {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Edit2 size={20} />}
          </button>
        </div>

        <img 
          src={profile?.home_image_url || "/home_cover.png"} 
          alt="Home Featured" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        <a 
          href="https://poki.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="glass-card p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-rose-100 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-500">
            <Gamepad2 size={24} />
          </div>
          <span className="font-semibold text-sm">Jogos</span>
        </a>
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
