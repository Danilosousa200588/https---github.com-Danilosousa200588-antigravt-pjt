import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Settings, Bell, Shield, LogOut, Camera, Mail, Edit2, Check, Loader2, PlayCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(profile?.username || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const displayName = profile?.username || user?.email?.split('@')[0] || 'Usuário';
  const avatarSeed = user?.id?.slice(0, 8) || 'default';
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}`;

  async function handleLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  async function saveName() {
    if (!user) return;
    setIsEditingName(false);
    if (editName.trim() === profile?.username) return;
    
    await supabase.from('profiles').update({ username: editName.trim() }).eq('id', user.id);
    await refreshProfile();
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
      await refreshProfile();
    } catch (error) {
      console.error('Erro no upload de avatar:', error);
      alert('Erro ao atualizar foto de perfil.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8 pb-32"
    >
      <section className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-rose-100">
            {uploadingAvatar ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-rose-400" />
              </div>
            ) : (
              <img 
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <label className={cn(
            "absolute -bottom-2 -right-2 bg-rose-400 text-white p-2.5 rounded-full shadow-lg transition-all cursor-pointer hover:bg-rose-500",
            uploadingAvatar && "opacity-50 pointer-events-none"
          )}>
            <Camera size={20} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
          </label>
        </div>
        
        <div className="text-center space-y-1 w-full flex flex-col items-center">
          {isEditingName ? (
            <div className="flex items-center gap-2 max-w-[200px]">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={saveName}
                onKeyPress={e => e.key === 'Enter' && saveName()}
                className="w-full bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-center font-headline text-xl font-bold outline-none focus:border-rose-400"
                autoFocus
              />
              <button onMouseDown={e => e.preventDefault()} onClick={saveName} className="p-1.5 bg-rose-100 text-rose-500 rounded-lg">
                <Check size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 max-w-[200px] justify-center ml-6">
              <h2 className="font-headline text-2xl font-bold text-zinc-800 truncate">{displayName}</h2>
              <button onClick={() => { setEditName(displayName); setIsEditingName(true); }} className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
          )}

          <p className="text-zinc-400 text-sm font-medium flex items-center justify-center gap-1.5 mt-1">
            <Mail size={13} />
            {user?.email}
          </p>
        </div>
      </section>

      <section className="bg-white/70 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-rose-100">
        <div className="p-4 space-y-1">
          <Link to="/videos" className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-400">
                <PlayCircle size={20} />
              </div>
              <span className="font-semibold text-zinc-700">Vídeos do Casal</span>
            </div>
            <Settings size={18} className="text-zinc-300 group-hover:text-rose-300 transition-colors" />
          </Link>

          <Link to="/quizzes" className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-400">
                <GraduationCap size={20} />
              </div>
              <span className="font-semibold text-zinc-700">Quizzes & Desafios</span>
            </div>
            <Settings size={18} className="text-zinc-300 group-hover:text-rose-300 transition-colors" />
          </Link>

          <button className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-400">
                <Heart size={20} />
              </div>
              <span className="font-semibold text-zinc-700">Nossa História</span>
            </div>
            <Settings size={18} className="text-zinc-300 group-hover:text-rose-300 transition-colors" />
          </button>


          <button className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-400">
                <Bell size={20} />
              </div>
              <span className="font-semibold text-zinc-700">Notificações</span>
            </div>
            <Settings size={18} className="text-zinc-300 group-hover:text-rose-300 transition-colors" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-400">
                <Shield size={20} />
              </div>
              <span className="font-semibold text-zinc-700">Privacidade</span>
            </div>
            <Settings size={18} className="text-zinc-300 group-hover:text-rose-300 transition-colors" />
          </button>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-5 text-rose-400 font-bold hover:bg-rose-100 rounded-3xl transition-colors"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>
    </motion.div>
  );
}
