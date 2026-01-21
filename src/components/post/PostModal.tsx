'use client';
import React, { useState, useRef } from 'react';
import { CURRENT_USER, MOCK_USERS } from '@/lib/constants';
import { X, Globe, Users, Lock, ChevronDown, ImageIcon, UserPlus, Smile, MapPin, MoreHorizontal, Check, Search, Film } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Feeling } from '@/types/post';
import { User } from '@/types/user';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



const FEELINGS: Feeling[] = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Proud' },
];

const PostModal= () => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');

  const router = useRouter();

  const onClose = () => {
    reset();
    router.back();
  };

  const handleAddImage = () => {
    const mockImage = `https://picsum.photos/seed/${Math.random()}/1200/800`;
    setSelectedImages([...selectedImages, mockImage]);
    setSelectedGif(null);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const toggleTagUser = (user: User) => {
    if (taggedUsers.find(u => u.id === user.id)) {
      setTaggedUsers(taggedUsers.filter(u => u.id !== user.id));
    } else {
      setTaggedUsers([...taggedUsers, user]);
    }
  };

  const handleSubmit = () => {
    if (content.trim() || selectedImages.length > 0 || selectedGif) {
      // onPost({ 
      //   content, 
      //   images: selectedImages.length > 0 ? selectedImages : undefined, 
      //   gif: selectedGif || undefined,
      //   feeling: feeling || undefined,
      //   location: location || undefined,
      //   taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined
      // });
      reset();
      onClose();
    }
  };

  const reset = () => {
    setContent('');
    setSelectedImages([]);
    setSelectedGif(null);
    setFeeling(null);
    setLocation('');
    setTaggedUsers([]);
    setShowFeelingPicker(false);
    setShowLocationInput(false);
    setShowTagPicker(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/4 backdrop-blur p-4 animate-in fade-in duration-200">
      <div 
        className="bg-card w-full max-w-[550px] rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] border border-border/8 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-border/8 flex items-center justify-between bg-background/50">
          <div className="w-8" /> 
          <h2 className="text-lg font-black tracking-tight">Create post</h2>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-foreground/10" onClick={onClose}>
            <X className="w-5 h-5 text-foreground" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-11 h-11 border border-white/10">
              <AvatarImage src={CURRENT_USER.avatar} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-base">{CURRENT_USER.name}</p>
                {feeling && (
                  <span className="text-[13px] text-foreground/50 font-medium">
                    is feeling <span className="text-foreground/30 font-bold">{feeling.emoji} {feeling.label}</span>
                  </span>
                )}
              </div>
              <button className="flex items-center space-x-1 bg-foreground/7 hover:bg-foreground/10 rounded-lg px-2 py-1 mt-1 transition-colors w-fit border border-white/5">
                {privacy === 'public' ? <Globe className="w-3.5 h-3.5 text-foreground/50" /> : privacy === 'friends' ? <Users className="w-3.5 h-3.5 text-foreground/40" /> : <Lock className="w-3.5 h-3.5 text-foreground/40" />}
                <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60">
                  {privacy}
                </span>
                <ChevronDown className="w-3 h-3 text-foreground/60" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${CURRENT_USER.name.split(' ')[0]}?`}
              className="w-full bg-transparent border-none text-xl sm:text-2xl placeholder-muted-foreground focus:ring-0 resize-none min-h-[120px] outline-none leading-relaxed"
            />

            {location && (
              <div className="flex items-center space-x-2 text-primary text-sm font-bold bg-primary/10 w-fit px-3 py-1.5 rounded-full border border-primary/20">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
                <button onClick={() => setLocation('')} className="ml-1 hover:text-foreground"><X className="w-3 h-3" /></button>
              </div>
            )}

            {taggedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map(u => (
                  <div key={u.id} className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full text-xs font-bold text-emerald-500">
                    {u.name}
                    <button onClick={() => toggleTagUser(u)} className="ml-1.5 hover:text-foreground"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Media Grid Preview */}
          {selectedImages.length > 0 && (
            <div className={cn(
              "rounded-2xl border border-foreground/10 overflow-hidden grid gap-1",
              selectedImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {selectedImages.map((img, i) => (
                <div key={i} className="relative group aspect-video">
                  <Image priority fill src={img} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-background/50 border-t border-border space-y-4">
          <div className="flex items-center justify-between border border-border/10 rounded-2xl p-3 px-4 bg-white/5">
            <span className="text-sm font-black tracking-tight text-foreground/35">Add to your post</span>
            <div className="flex items-center space-x-2">
              <ToolIconButton icon={<ImageIcon className="w-5 h-5 text-emerald-500" />} onClick={handleAddImage} />
              <ToolIconButton icon={<UserPlus className="w-5 h-5 text-sky-500" />} onClick={() => setShowTagPicker(!showTagPicker)} active={showTagPicker} />
              <ToolIconButton icon={<Smile className="w-5 h-5 text-amber-500" />} onClick={() => setShowFeelingPicker(!showFeelingPicker)} active={showFeelingPicker} />
              <ToolIconButton icon={<MapPin className="w-5 h-5 text-rose-500" />} onClick={() => setShowLocationInput(!showLocationInput)} active={showLocationInput} />
            </div>
          </div>

          {/* Sub-panels */}
          {showLocationInput && (
            <div className="flex items-center space-x-2 bg-foreground/5 p-2 rounded-xl animate-in slide-in-from-bottom-2">
              <MapPin className="w-4 h-4 text-rose-500 ml-2" />
              <input 
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder-foreground/60"
                onKeyDown={(e) => e.key === 'Enter' && setShowLocationInput(false)}
              />
            </div>
          )}

          {showFeelingPicker && (
            <div className="grid grid-cols-4 gap-2 bg-foreground/5 p-3 rounded-2xl animate-in slide-in-from-bottom-2">
              {FEELINGS.map(f => (
                <button 
                  key={f.label} 
                  onClick={() => { setFeeling(f); setShowFeelingPicker(false); }}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-foreground/10 rounded-xl transition-all"
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-tighter">{f.label}</span>
                </button>
              ))}
            </div>
          )}

          {showTagPicker && (
            <div className="bg-white/5 p-3 rounded-2xl animate-in slide-in-from-bottom-2 space-y-2">
              <div className="flex items-center space-x-2 bg-background/40 px-3 py-1.5 rounded-full mb-2">
                <Search className="w-3.5 h-3.5 text-foreground/50" />
                <input placeholder="Search friends..." className="bg-transparent border-none outline-none text-xs flex-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                {MOCK_USERS.slice(0, 6).map(u => (
                  <button 
                    key={u.id}
                    onClick={() => toggleTagUser(u as any)}
                    className={cn(
                      "flex items-center space-x-2 p-1.5 rounded-full transition-all border",
                      taggedUsers.find(tu => tu.id === u.id) 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                        : "bg-foreground/20 border-foreground/5 text-neutral-400 hover:border-border/20"
                    )}
                  >
                    <Avatar className="w-5 h-5"><AvatarImage src={u.avatar} /></Avatar>
                    <span className="text-[10px] font-bold pr-1">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full rounded-xl h-12 font-black text-lg shadow-xl shadow-sky-500/20 disabled:opacity-50"
            disabled={!content.trim() && selectedImages.length === 0 && !selectedGif}
            onClick={handleSubmit}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

const ToolIconButton = ({ icon, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "p-2.5 rounded-full transition-all",
      active ? "bg-foreground/10" : "hover:bg-foreground/10"
    )}
  >
    {icon}
  </button>
);

export default PostModal;
