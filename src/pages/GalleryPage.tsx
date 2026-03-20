import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Plus, Heart, Trash2, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Memory {
  id: string;
  url: string;
  caption: string;
  rotate: string;
  user_id: string; // Adicionado user_id para referenciar o dono da foto
}


export default function GalleryPage() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const formatted = data.map(m => ({
        id: m.id,
        url: m.image_url,
        caption: m.caption,
        rotate: m.rotate,
        user_id: m.user_id,
      }));
      setMemories(formatted);
    }
    setIsLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = async () => {
    if (!newImageFile || !newCaption || !user) return;
    
    setIsUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = newImageFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, newImageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Save to Database
      const rotations = ['-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-1'];
      const randomRotate = rotations[Math.floor(Math.random() * rotations.length)];

      const { data: insertedMemory, error: dbError } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          caption: newCaption,
          rotate: randomRotate
        })
        .select()
        .single();
        
      if (dbError) throw dbError;

      if (insertedMemory) {
        setMemories([{
          id: insertedMemory.id,
          url: insertedMemory.image_url,
          caption: insertedMemory.caption,
          rotate: insertedMemory.rotate,
          user_id: insertedMemory.user_id,
        }, ...memories]);
      }
      
      // Cleanup UI
      setNewCaption('');
      setNewImage(null);
      setNewImageFile(null);
      setIsAdding(false);

    } catch (error) {
      console.error('Error adding memory:', error);
      alert('Erro ao guardar a memória. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (memoryToDelete && user) {
      const memory = memories.find(m => m.id === memoryToDelete);
      
      // Apenas o dono pode remover (ou conforme a RLS permitir)
      if (memory) {
        // Se quisermos remover a imagem do storage, extraímos o nome do arquivo pela URL:
        const fileMatch = memory.url.match(/gallery\/(.+)$/);
        if (fileMatch) {
          const filePath = fileMatch[1];
          await supabase.storage.from('gallery').remove([filePath]);
        }

        // Deleta do DB
        const { error } = await supabase.from('memories').delete().eq('id', memoryToDelete);
        if (!error) {
          setMemories(memories.filter(m => m.id !== memoryToDelete));
        }
      }
      setMemoryToDelete(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8 pb-32"
    >
      <div className="text-center space-y-2">
        <h2 className="font-headline text-4xl font-bold text-rose-400">Nossa Galeria</h2>
        <p className="text-zinc-500 italic">Cada foto, uma página da nossa história.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 pt-4">
        <AnimatePresence mode="popLayout">
          {memories.map((memory) => (
            <motion.div 
              key={memory.id}
              layout
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: parseInt(memory.rotate.replace(/[^0-9-]/g, '')) || 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 0 }}
              whileHover={{ scale: 1.02, rotate: 0 }}
              className={cn(
                "relative bg-white p-4 pb-12 editorial-shadow transition-all duration-500 border border-rose-100 cursor-pointer",
                memory.rotate
              )}
              onClick={() => setSelectedMemory(memory)}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMemoryToDelete(memory.id);
                }}
                className={cn(
                  "absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg transition-opacity z-10 hover:bg-rose-600",
                  memory.user_id !== user?.id && "hidden" // Oculta botão de deletar se não for o dono
                )}
              >
                <Trash2 size={16} />
              </button>
              
              <div className="aspect-square overflow-hidden mb-4 rounded-sm">
                <img 
                  src={memory.url} 
                  alt={memory.caption} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="font-headline italic text-zinc-800 text-center text-lg">{memory.caption}</p>
              <div className="absolute bottom-4 right-4 text-rose-200">
                <Heart size={16} fill="currentColor" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isLoading && memories.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-200">
            <ImageIcon size={40} />
          </div>
          <p className="font-headline text-xl text-zinc-500">Nenhuma memória ainda.</p>
          <p className="text-zinc-400 text-sm">Toque no botão abaixo para adicionar a primeira de muitas!</p>
        </div>
      )}

      {/* Add Button */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-28 right-8 w-16 h-16 primary-gradient text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40"
      >
        <Camera size={28} />
      </button>

      {/* Full Screen Preview */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMemory(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full bg-white p-2 rounded-lg shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10"
              >
                <X size={24} />
              </button>
              <img 
                src={selectedMemory.url} 
                alt={selectedMemory.caption} 
                className="w-full h-auto max-h-[80vh] object-contain rounded-sm"
                referrerPolicy="no-referrer"
              />
              <div className="p-6 text-center">
                <p className="font-headline italic text-2xl text-zinc-800">{selectedMemory.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {memoryToDelete && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMemoryToDelete(null)}
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
                <h3 className="font-headline text-xl font-bold text-zinc-800">Apagar memória?</h3>
                <p className="text-zinc-500 text-sm">Essa ação não pode ser desfeita, meu amor.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setMemoryToDelete(null)}
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
                <h3 className="font-headline text-2xl font-bold text-zinc-800">Nova Memória</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden",
                    newImage ? "border-rose-200 bg-rose-50/30" : "border-zinc-200 hover:border-rose-300 hover:bg-rose-50/30"
                  )}
                >
                  {newImage ? (
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-zinc-800">Escolher Foto</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Toque para selecionar</p>
                      </div>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Legenda</label>
                  <input 
                    type="text" 
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="O que essa foto significa?"
                    className="w-full bg-zinc-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  />
                </div>

                <button 
                  onClick={handleAddMemory}
                  disabled={!newImage || !newCaption || isUploading}
                  className="w-full primary-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Heart size={18} fill="currentColor" />}
                  {isUploading ? 'Guardando...' : 'Guardar Memória'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
