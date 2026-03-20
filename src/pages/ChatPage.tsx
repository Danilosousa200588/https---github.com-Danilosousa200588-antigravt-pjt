import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth, Profile } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function ChatPage() {
  const { user, onlineUsers } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadProfiles() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id) // excluir usuário atual
        .order('username');
      
      if (!error && data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    }
    loadProfiles();
  }, [user]);

  const filteredProfiles = profiles.filter(p => 
    (p.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold text-zinc-800">Conversas</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Procurar contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/70 backdrop-blur-md rounded-2xl py-3 pl-11 pr-4 text-sm outline-none border border-rose-100 focus:border-rose-300 transition-colors placeholder:text-zinc-400"
          />
        </div>
      </div>

      <div className="space-y-3 pb-20">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 rounded-full border-2 border-rose-200 border-t-rose-400 animate-spin" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center p-8">
            <MessageSquare className="mx-auto text-rose-200 mb-3" size={32} />
            <p className="text-zinc-500 text-sm">Nenhum contato encontrado.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredProfiles.map((profile) => {
              const isOnline = onlineUsers.has(profile.id);
              const avatarSeed = profile.id.slice(0, 8);
              const avatarUrl = profile.avatar_url || `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}`;
              
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link 
                    to={`/chat/${profile.id}`}
                    className="flex items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] editorial-shadow hover:bg-rose-50 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-rose-100">
                        <img src={avatarUrl} alt={profile.username || 'Usuário'} className="w-full h-full object-cover" />
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-zinc-800 truncate">
                          {profile.username || 'Usuário'}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-500 truncate">
                        {isOnline ? 'Online agora' : 'Offline'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
