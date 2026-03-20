import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Image as ImageIcon, Check, CheckCheck, Loader2, X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth, Profile } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  text_content: string | null;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
};

export default function ChatRoom() {
  const { userId: otherUserId } = useParams<{ userId: string }>();
  const { user, onlineUsers, profile: myProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [input, setInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false;

  // Carregar dados iniciais e marcar lidas
  useEffect(() => {
    if (!user || !otherUserId) return;

    // Carregar informações do outro usuário
    supabase.from('profiles').select('*').eq('id', otherUserId).single().then(({ data }) => {
      setOtherUser(data as Profile);
    });

    // Carregar mensagens históricas
    supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
        scrollToBottom();
      });

    // Marcar as mensagens recebidas como lidas
    supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', user.id)
      .eq('sender_id', otherUserId)
      .eq('is_read', false)
      .then();

    // Inscrever-se em novas mensagens / atualizações
    const channel = supabase.channel(`room_${user.id}_${otherUserId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        // Filtro local pois a sintaxe 'or' não é suportada diretamente no parâmetro filter
        const newRec = payload.new as Record<string, any>;
        const oldRec = payload.old as Record<string, any>;

        // O payload.old no DELETE traz apenas o ID por padrão, então precisamos ignorar a checagem de sender/receiver no DELETE
        const isRelated = payload.eventType === 'DELETE' || (newRec && newRec.sender_id && (
          (newRec.sender_id === user.id && newRec.receiver_id === otherUserId) ||
          (newRec.sender_id === otherUserId && newRec.receiver_id === user.id)
        )) || (oldRec && oldRec.sender_id && (
          (oldRec.sender_id === user.id && oldRec.receiver_id === otherUserId) ||
          (oldRec.sender_id === otherUserId && oldRec.receiver_id === user.id)
        ));

        if (!isRelated) return;

        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            // Previne duplicidade caso o realtime e a inserção local corram juntos
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Se sou o recebedor, marco como lido instantaneamente
          if (newMsg.receiver_id === user.id) {
            supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id).then();
          }
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as Message : m));
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        }
        scrollToBottom();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, otherUserId]);

  // Canal de Typing (Broadcast)
  useEffect(() => {
    if (!user || !otherUserId) return;
    const typingChannel = supabase.channel(`typing_${otherUserId}`);
    typingChannel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.sender_id === otherUserId) {
          setIsTyping(payload.payload.is_typing);
        }
      })
      .subscribe();

    return () => {
      typingChannel.unsubscribe();
    }
  }, [user, otherUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const notifyTyping = (typing: boolean) => {
    if (!user) return;
    supabase.channel(`typing_${user.id}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { sender_id: user.id, is_typing: typing }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Debounce typing
    notifyTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => notifyTyping(false), 2000);
  };

  const handleSendText = async () => {
    if (!input.trim() || !user || !otherUserId) return;
    const txt = input.trim();
    setInput('');
    notifyTyping(false);
    
    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      text_content: txt
    }).select().single();

    if (data) {
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, data as Message];
      });
      scrollToBottom();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !otherUserId) return;
    
    setUploadingImage(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('chat_images').getPublicUrl(filePath);
      
      const { data: dbData } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: otherUserId,
        image_url: data.publicUrl
      }).select().single();
      
      if (dbData) {
        setMessages(prev => {
          if (prev.some(m => m.id === dbData.id)) return prev;
          return [...prev, dbData as Message];
        });
        scrollToBottom();
      }
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar imagem.');
    } finally {
      setUploadingImage(false);
      // reset file input
      e.target.value = '';
    }
  };

  const handleDelete = async (msgId: string) => {
    // Optimistic delete for instant UI feedback
    setMessages(prev => prev.filter(m => m.id !== msgId));
    
    // Background delete in Supabase
    const { error } = await supabase.from('messages').delete().eq('id', msgId);
    if (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (!otherUser) return null;

  const avatarUrl = otherUser.avatar_url || `https://api.dicebear.com/9.x/adventurer/svg?seed=${otherUser.id.slice(0, 8)}`;

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] bg-rose-50 flex flex-col z-[100]">
      {/* Header Fixo */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 flex items-center px-4 py-3 shrink-0">
        <Link to="/chat" className="p-2 -ml-2 text-rose-400 hover:bg-rose-50 rounded-full transition-colors mr-2">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover bg-rose-100" />
            {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />}
          </div>
          <div>
            <h2 className="font-semibold text-zinc-800 leading-tight">{otherUser.username || 'Usuário'}</h2>
            <p className="text-xs text-zinc-500">
              {isOnline ? <span className="text-emerald-500 font-medium">Online</span> : 'Offline'}
            </p>
          </div>
        </div>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
              >
                <div className={cn(
                  "p-3 rounded-2xl relative group",
                  isMe ? "bg-rose-400 text-white rounded-tr-none" : "bg-white text-zinc-800 rounded-tl-none editorial-shadow"
                )}>
                  {msg.image_url ? (
                    <img src={msg.image_url} alt="Imagem enviada" className="rounded-xl max-w-full w-64 h-auto object-cover" />
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-[15px]">{msg.text_content}</p>
                  )}
                  
                  {isMe && (
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-zinc-400">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    msg.is_read ? (
                      <CheckCheck size={14} className="text-blue-400" />
                    ) : (
                      <Check size={14} className="text-zinc-300" />
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 items-center bg-white w-fit px-4 py-3 rounded-2xl rounded-tl-none editorial-shadow">
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </motion.div>
        )}
        <div ref={scrollRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-rose-100 p-3 pb-4 shrink-0 mt-auto">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <label className="p-3 text-zinc-400 hover:text-rose-400 hover:bg-rose-50 rounded-full transition-colors cursor-pointer shrink-0">
            {uploadingImage ? <Loader2 size={24} className="animate-spin text-rose-400" /> : <ImageIcon size={24} />}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
          <div className="flex-1 bg-rose-50/50 rounded-full">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Escreva algo carinhoso..."
              className="w-full bg-transparent px-4 py-3 text-sm outline-none text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <button 
            onClick={handleSendText}
            disabled={!input.trim()}
            className="p-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 disabled:opacity-50 disabled:bg-rose-300 transition-colors shrink-0"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
