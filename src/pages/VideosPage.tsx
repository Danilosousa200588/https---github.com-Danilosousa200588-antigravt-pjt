import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, Heart, Plus, Trash2, X, Upload, Video as VideoIcon, Film } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Video {
  id: string;
  title: string;
  date: string;
  url: string;
  thumbnail: string;
  duration: string;
  isFavorite?: boolean;
}

const INITIAL_VIDEOS: Video[] = [
  { id: '1', title: 'Nossa Viagem de Verão', date: '15 Mar 2024', thumbnail: 'https://picsum.photos/seed/v1/800/450', url: '', duration: '03:45', isFavorite: true },
  { id: '2', title: 'Passeio no Parque', date: '10 Fev 2024', thumbnail: 'https://picsum.photos/seed/v2/800/450', url: '', duration: '01:20' },
  { id: '3', title: 'Nosso Jantar', date: '02 Mar 2024', thumbnail: 'https://picsum.photos/seed/v3/800/450', url: '', duration: '02:15' },
];

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('amethyst_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('amethyst_videos', JSON.stringify(videos));
  }, [videos]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoFile || !newTitle || !user) return;

    try {
      setIsUploading(true);
      
      const fileExt = newVideoFile.name.split('.').pop();
      const fileName = `videos/${user.id}_${Date.now()}.${fileExt}`;
      
      // Upload do vídeo pro diretório "videos" no bucket "gallery"
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, newVideoFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      const newVideo: Video = {
        id: Date.now().toString(),
        title: newTitle,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        url: publicUrl,
        thumbnail: 'https://picsum.photos/seed/' + Date.now() + '/800/450',
        duration: '--:--',
      };

      setVideos([newVideo, ...videos]);
      setNewTitle('');
      setNewVideoFile(null);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setIsAdding(false);
    } catch (err) {
      console.error('Erro ao fazer upload do vídeo:', err);
      alert('Houve um erro ao enviar o vídeo. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = () => {
    if (videoToDelete) {
      setVideos(videos.filter(v => v.id !== videoToDelete));
      setVideoToDelete(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8 pb-32"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-headline text-3xl font-bold text-rose-400">Nossos Vídeos</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-rose-100 text-rose-400 p-2 rounded-full hover:bg-rose-200 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {videos.map((video) => (
            <motion.div 
              key={video.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group space-y-3"
            >
              <div 
                className="relative aspect-video rounded-3xl overflow-hidden editorial-shadow cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock size={10} />
                  {video.duration}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoToDelete(video.id);
                  }}
                  className="absolute top-4 left-4 w-10 h-10 bg-rose-500/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <Trash2 size={18} />
                </button>

                {video.isFavorite && (
                  <div className="absolute top-4 right-4 text-rose-400">
                    <Heart size={20} fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="px-2 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-zinc-800 text-lg">{video.title}</h3>
                  <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">{video.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full bg-black rounded-2xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10"
              >
                <X size={24} />
              </button>
              
              {selectedVideo.url ? (
                <video 
                  src={selectedVideo.url} 
                  controls 
                  autoPlay 
                  className="w-full h-auto max-h-[80vh]"
                />
              ) : (
                <div className="aspect-video bg-zinc-900 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <Film size={64} className="animate-pulse" />
                  <p className="text-sm font-medium">Vídeo de demonstração (apenas miniatura disponível)</p>
                </div>
              )}
              
              <div className="p-6 bg-zinc-900 text-white">
                <h3 className="font-headline text-2xl font-bold">{selectedVideo.title}</h3>
                <p className="text-zinc-400 text-sm">{selectedVideo.date}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {videoToDelete && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVideoToDelete(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold text-zinc-800">Apagar vídeo?</h3>
                <p className="text-zinc-500 text-sm">Essa memória em vídeo será removida para sempre.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setVideoToDelete(null)}
                  className="flex-1 py-3 rounded-2xl font-bold text-zinc-400 hover:bg-zinc-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-2xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                >
                  Apagar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-2xl font-bold text-zinc-800">Novo Vídeo</h3>
                <button 
                  onClick={() => {
                     setIsAdding(false);
                     setNewTitle('');
                     setNewVideoFile(null);
                     if (previewUrl) {
                       URL.revokeObjectURL(previewUrl);
                       setPreviewUrl(null);
                     }
                  }}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden relative",
                    newVideoFile ? "border-rose-200 bg-rose-50/30" : "border-zinc-200 hover:border-rose-300 hover:bg-rose-50/30"
                  )}
                >
                  {newVideoFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <VideoIcon size={48} className="text-rose-400" />
                      <p className="text-xs font-bold text-zinc-600">Vídeo selecionado!</p>
                    </div>
                  ) : isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-zinc-800">Escolher Vídeo</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Toque para selecionar</p>
                      </div>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleVideoChange} 
                  accept="video/*" 
                  className="hidden" 
                />

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Título / Legenda</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Dê um nome para esse momento..."
                    className="w-full bg-zinc-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  />
                </div>

                <button 
                  onClick={handleAddVideo}
                  disabled={!newVideoFile || !newTitle || isUploading}
                  className="w-full primary-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play size={18} fill="currentColor" />
                  Guardar Vídeo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
