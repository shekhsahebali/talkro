'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Check, Sparkles, Type, Smile, Music, Settings, Trash2, Globe, Users, Lock, Palette, Upload, Wand2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CURRENT_USER } from '@/lib/constants';
import { TextOverlay, Story } from '@/types/post';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



const COLORS = ['#FFFFFF', '#1d9bf0', '#f91880', '#00ba7c', '#ffd700', '#ff8c00'];
const EMOJIS = ['🔥', '✨', '❤️', '😂', '🚀', '🙌', '💯', '🌈', '🍕', '🎉'];
const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'Clarendon', class: 'brightness-110 contrast-110 saturate-110' },
  { name: 'Moon', class: 'grayscale brightness-110 contrast-110' },
  { name: 'Reyes', class: 'sepia-[0.3] brightness-110 contrast-90' },
  { name: 'Gingham', class: 'sepia-[0.1] contrast-90 brightness-105' },
];

const MOCK_TRACKS = [
  { title: 'Nightcity Dreams', artist: 'Cyberwave' },
  { title: 'Golden Hour', artist: 'Lofi Girl' },
  { title: 'Hyperpop Chaos', artist: 'NextGen' },
];

const AddStory = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [newText, setNewText] = useState('');
  const [activeColor, setActiveColor] = useState('#FFFFFF');
  const [selectedMusic, setSelectedMusic] = useState<{ title: string; artist: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  
  const [activePanel, setActivePanel] = useState<'none' | 'music' | 'emoji' | 'filters'>('none');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  

  const handleClose = () => {
    setSelectedMedia(null);
    setTextOverlays([]);
    setSelectedMusic(null);
    setActivePanel('none');
    setActiveFilter(FILTERS[0]);
    router.back();
  }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedMedia(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedMedia(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    if (newText.trim()) {
      setTextOverlays([...textOverlays, {
        id: Math.random().toString(36).substr(2, 9),
        text: newText,
        x: 50,
        y: 50,
        color: activeColor,
      }]);
      setNewText('');
      setIsAddingText(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setTextOverlays([...textOverlays, {
      id: Math.random.toString().substr(2, 9),
      text: emoji,
      x: 50,
      y: 50,
      color: '#FFFFFF',
    }]);
    setActivePanel('none');
  };

 const handlePost = async () => {
  if (!selectedMedia) return;

  await fetch("/api/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mediaUrl: selectedMedia,
      textOverlays,
      music: selectedMusic,
      privacy,
    }),
  });

  handleClose();
};


  const reset = () => {
    setSelectedMedia(null);
    setTextOverlays([]);
    setSelectedMusic(null);
    setActivePanel('none');
    setActiveFilter(FILTERS[0]);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-card sm:bg-card/15 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card sm:bg-card/95 w-full h-full sm:max-w-6xl sm:h-[90vh] sm:rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl border-border border relative">
        
        {/* CLOSE BUTTON (MOBILE ONLY - ABSOLUTE) */}
        <button onClick={handleClose} className="sm:hidden absolute top-6 left-6 z-[100] p-2 bg-background/40 rounded-full text-foreground">
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Creative Stage (Full screen on mobile) */}
        <div className="flex-1 bg-background/90 relative flex items-center justify-center overflow-hidden border-r border-border/5">
          {selectedMedia ? (
            <div className="relative w-full h-full sm:h-[90%] sm:aspect-[9/16] sm:rounded-[32px] overflow-hidden bg-background flex items-center justify-center group shadow-2xl">
              <Image width={100} height={100} 
                src={selectedMedia} 
                className={cn("w-full h-full object-cover select-none transition-all duration-500", activeFilter.class)} 
                alt="Preview" 
              />
              
              {/* Overlays */}
              {textOverlays.map((overlay) => (
                <div 
                  key={overlay.id}
                  style={{ top: `${overlay.y}%`, left: `${overlay.x}%`, color: overlay.color }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 p-2 group/item cursor-move z-10"
                >
                  <span className="text-4xl font-background drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] whitespace-nowrap">{overlay.text}</span>
                  <button 
                    onClick={() => setTextOverlays(textOverlays.filter(o => o.id !== overlay.id))}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-500 rounded-full p-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}

              {/* Mobile Immersive Tool Strip */}
              <div className="md:hidden absolute top-6 right-6 flex flex-col space-y-4 z-50">
                <MobileTool icon={<Type />} onClick={() => setIsAddingText(true)} />
                <MobileTool icon={<Smile />} onClick={() => setActivePanel(activePanel === 'emoji' ? 'none' : 'emoji')} active={activePanel === 'emoji'} />
                <MobileTool icon={<Music />} onClick={() => setActivePanel(activePanel === 'music' ? 'none' : 'music')} active={activePanel === 'music'} />
                <MobileTool icon={<Wand2 />} onClick={() => setActivePanel(activePanel === 'filters' ? 'none' : 'filters')} active={activePanel === 'filters'} />
              </div>

              {/* Music Sticker Preview */}
              {selectedMusic && (
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-background/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl flex items-center space-x-3 border border-white/20 z-10">
                  <div className="p-2 bg-primary rounded-xl animate-pulse"><Music className="w-4 h-4 text-white" /></div>
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-foreground truncate">{selectedMusic.title}</p>
                    <p className="text-[10px] text-foreground/60 truncate">{selectedMusic.artist}</p>
                  </div>
                  <button onClick={() => setSelectedMusic(null)} className="text-foreground/40 hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
              )}

              {/* Add Text Input Overlay (Immersive) */}
              {isAddingText && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-[100] p-6 backdrop-blur-md animate-in zoom-in-110 duration-200">
                  <input
                    autoFocus
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                    placeholder="Type..."
                    style={{ color: activeColor }}
                    className="bg-transparent border-none outline-none text-5xl font-background text-center w-full placeholder-white/20"
                  />
                  <div className="mt-12 flex items-center space-x-4">
                    {COLORS.map(c => (
                      <button 
                        key={c}
                        onClick={() => setActiveColor(c)}
                        className={cn("w-10 h-10 rounded-full border-2 transition-transform", activeColor === c ? "border-border scale-125" : "border-transparent shadow-xl")}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="mt-12 flex space-x-6">
                    <Button variant="ghost" onClick={() => setIsAddingText(false)} className="rounded-full text-foreground text-lg">Cancel</Button>
                    <Button onClick={handleAddText} className="rounded-full px-10 h-14 bg-background text-background hover:bg-background/20 font-background text-lg">Done</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-10 max-w-sm px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-32 h-32 bg-gradient-to-tr from-primary/20 to-purple-600/20 rounded-[40px] flex items-center justify-center mx-auto border border-border relative">
                <Wand2 className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary blur-3xl opacity-10" />
              </div>
              <div className="space-y-3">
                <h3 className="font-background text-4xl tracking-tight text-foreground">Capture the moment</h3>
                <p className="text-neutral-500 font-medium">Post photos that disappear after 24h.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 rounded-3xl bg-primary text-foreground hover:bg-primary/90 font-background text-lg flex items-center justify-center space-x-3 shadow-xl shadow-primary/10"
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload from device</span>
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                
                <div className="flex items-center space-x-2 my-4">
                   <div className="h-px flex-1 bg-background/5" />
                   <span className="text-[10px] font-background text-neutral-600 uppercase tracking-widest">Or choose a preset</span>
                   <div className="h-px flex-1 bg-background/5" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedMedia(`https://picsum.photos/seed/story${i}/800/1400`)}
                      className="aspect-[9/16] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all opacity-40 hover:opacity-100 border border-white/5"
                    >
                      <img src={`https://picsum.photos/seed/story${i}/800/1400`} className="w-full h-full object-cover" alt="Preset" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tools (Desktop) / Sliding Panels (Mobile) */}
        <div className={cn(
          "md:w-[360px] p-8 flex flex-col bg-background overflow-y-auto no-scrollbar transition-all duration-500",
          activePanel !== 'none' ? "h-fit md:h-full" : "h-0 md:h-full overflow-hidden"
        )}>
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-10">
            <h2 className="text-2xl font-background text-white">Create Story</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-white/5">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 space-y-10">
            {/* Desktop-only tool strip */}
            <div className="hidden md:grid grid-cols-2 gap-4">
               <ToolCard icon={<Type />} label="Text" onClick={() => setIsAddingText(true)} disabled={!selectedMedia} />
               <ToolCard icon={<Smile />} label="Stickers" onClick={() => setActivePanel('emoji')} disabled={!selectedMedia} active={activePanel === 'emoji'} />
               <ToolCard icon={<Music />} label="Music" onClick={() => setActivePanel('music')} disabled={!selectedMedia} active={activePanel === 'music'} />
               <ToolCard icon={<Wand2 />} label="Effects" onClick={() => setActivePanel('filters')} disabled={!selectedMedia} active={activePanel === 'filters'} />
            </div>

            {/* Dynamic Panels (Emoji/Music/Filters) */}
            {activePanel === 'emoji' && (
              <PanelWrapper title="Stickers" onClose={() => setActivePanel('none')}>
                <div className="flex flex-wrap gap-4">
                   {EMOJIS.map(e => (
                     <button key={e} onClick={() => addEmoji(e)} className="text-4xl hover:scale-125 transition-transform">{e}</button>
                   ))}
                </div>
              </PanelWrapper>
            )}

            {activePanel === 'music' && (
              <PanelWrapper title="Music" onClose={() => setActivePanel('none')}>
                 <div className="space-y-3">
                   {MOCK_TRACKS.map((t, i) => (
                     <div 
                        key={i} 
                        onClick={() => { setSelectedMusic(t); setActivePanel('none'); }}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center space-x-4 cursor-pointer transition-colors"
                      >
                       <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><Music className="w-5 h-5 text-primary" /></div>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold truncate text-white">{t.title}</p>
                         <p className="text-xs text-neutral-500 truncate uppercase font-bold tracking-widest">{t.artist}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </PanelWrapper>
            )}

            {activePanel === 'filters' && (
               <PanelWrapper title="Filters" onClose={() => setActivePanel('none')}>
                  <div className="grid grid-cols-2 gap-3">
                    {FILTERS.map((f, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveFilter(f)}
                        className={cn(
                          "p-2 rounded-2xl border transition-all cursor-pointer text-center space-y-2",
                          activeFilter.name === f.name ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10 hover:bg-white/10"
                        )}
                      >
                        <div className={cn("w-full aspect-square rounded-xl bg-neutral-800 overflow-hidden", f.class)}>
                          {selectedMedia && <img src={selectedMedia} className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-[10px] font-background uppercase tracking-tighter">{f.name}</p>
                      </div>
                    ))}
                  </div>
               </PanelWrapper>
            )}
            
            {/* Privacy Section (Desktop) */}
            <div className="hidden md:block">
              <h4 className="text-[11px] font-background text-neutral-500 uppercase tracking-[0.2em] mb-4">Sharing With</h4>
              <div className="space-y-2">
                <PrivacyRow icon={<Globe />} label="Public" selected={privacy === 'public'} onClick={() => setPrivacy('public')} />
                <PrivacyRow icon={<Users />} label="Friends" selected={privacy === 'friends'} onClick={() => setPrivacy('friends')} />
              </div>
            </div>
          </div>

          {/* Action Area (Bottom for both, but styled for fixed bottom on mobile) */}
          <div className="mt-auto pt-8 flex flex-col space-y-4">
             <Button 
               className="w-full h-16 rounded-[24px] bg-white text-background hover:bg-background/20 font-background text-xl shadow-2xl" 
               disabled={!selectedMedia}
               onClick={handlePost}
             >
               Share to Story
             </Button>
             <p className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest px-4">
               Nexus Hub Stories expire after 24 hours.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ icon, label, onClick, disabled, active }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex flex-col items-center justify-center p-6 rounded-3xl border transition-all space-y-3 active:scale-95 group disabled:opacity-30",
      active ? "bg-primary text-white border-primary" : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-400"
    )}
  >
    <div className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-neutral-500 group-hover:text-white")}>{icon}</div>
    <span className="text-[11px] font-background uppercase tracking-widest">{label}</span>
  </button>
);

// Fix: Added <any> generic type to React.ReactElement to allow passing className prop in cloneElement
const MobileTool = ({ icon, onClick, active }: any) => (
  <button onClick={onClick} className={cn("p-3 rounded-full backdrop-blur-md border transition-all", active ? "bg-primary border-primary text-white" : "bg-background/40 border-white/10 text-white")}>
    {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
  </button>
);

const PanelWrapper = ({ title, children, onClose }: any) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-2 md:slide-in-from-right-4 duration-300">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-background text-white tracking-tight">{title}</h3>
      <button onClick={onClose} className="md:hidden text-neutral-500"><X className="w-5 h-5" /></button>
    </div>
    {children}
  </div>
);

// Fix: Added <any> generic type to React.ReactElement to allow passing className prop in cloneElement
const PrivacyRow = ({ icon, label, selected, onClick }: any) => (
  <div onClick={onClick} className={cn("flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border", selected ? "bg-white/10 border-white/10" : "bg-transparent border-transparent hover:bg-white/5")}>
    <div className="flex items-center space-x-3">
      <div className={cn("p-2 rounded-xl", selected ? "bg-primary text-white" : "bg-card text-foreground/50")}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" })}
      </div>
      <span className={cn("text-sm font-bold", selected ? "text-foreground" : "text-foreground/50")}>{label}</span>
    </div>
    {selected && <Check className="w-4 h-4 text-primary" />}
  </div>
);



export default AddStory