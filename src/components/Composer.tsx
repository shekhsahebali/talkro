
import React, { useState, useRef } from 'react';
import { CURRENT_USER, MOCK_USERS } from '../constants';
import { Image as ImageIcon, Smile, Calendar, MapPin, List, Film, X, Plus, UserPlus, Search, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import HashtagSuggester from './HashtagSuggester';
import { Poll, Feeling, User } from '../types';
import { cn } from '../lib/utils';

interface ComposerProps {
  onPost: (data: { 
    content: string; 
    images?: string[]; 
    gif?: string; 
    poll?: Poll; 
    feeling?: Feeling;
    location?: string;
    taggedUsers?: User[];
  }) => void;
}

const FEELINGS: Feeling[] = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Proud' },
];

const Composer: React.FC<ComposerProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mockGifs = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eXR3ejF3NHZqZnp0Znh6Znh6Znh6Znh6Znh6Znh6Znh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKSjPQC1IdLidZ6/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eXR3ejF3NHZqZnp0Znh6Znh6Znh6Znh6Znh6Znh6Znh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26ufdipLchakajNSM/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eXR3ejF3NHZqZnp0Znh6Znh6Znh6Znh6Znh6Znh6Znh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlUxcWRsqROfvg4/giphy.gif'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = val.substring(0, cursorPosition);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('#')) {
      setSuggestionQuery(lastWord.substring(1));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectTag = (tag: string) => {
    if (!textareaRef.current) return;
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    const words = textBeforeCursor.split(/\s/);
    words[words.length - 1] = `#${tag} `;
    const newContent = words.join(' ') + textAfterCursor;
    setContent(newContent);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  const handleAddImage = () => {
    const mockImage = `https://picsum.photos/seed/${Math.random()}/800/600`;
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
    if (content.trim() || selectedImages.length > 0 || selectedGif || pollOptions.length > 0) {
      let poll: Poll | undefined;
      if (pollOptions.length > 0) {
        poll = {
          options: pollOptions.map((text, i) => ({ id: i.toString(), text, votes: 0 })),
          totalVotes: 0,
          endsAt: new Date(Date.now() + 86400000)
        };
      }
      onPost({ 
        content, 
        images: selectedImages.length > 0 ? selectedImages : undefined, 
        gif: selectedGif || undefined, 
        poll,
        feeling: feeling || undefined,
        location: location || undefined,
        taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined
      });
      reset();
    }
  };

  const reset = () => {
    setContent('');
    setSelectedImages([]);
    setSelectedGif(null);
    setPollOptions([]);
    setFeeling(null);
    setLocation('');
    setTaggedUsers([]);
    setShowFeelingPicker(false);
    setShowLocationInput(false);
    setShowTagPicker(false);
    setShowGifPicker(false);
  };

  return (
    <div className="border-b border-[#2f3336] p-4 relative bg-black/40">
      <div className="flex space-x-3">
        <Avatar className="w-10 h-10 shrink-0 border border-white/10">
          <AvatarImage src={CURRENT_USER.avatar} />
          <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          <div className="flex items-center space-x-2 mb-1">
            {feeling && (
              <span className="text-[13px] text-neutral-400 font-medium">
                — feeling <span className="text-white font-bold">{feeling.emoji} {feeling.label}</span>
              </span>
            )}
            {location && (
              <span className="text-[13px] text-neutral-400 font-medium">
                at <span className="text-white font-bold">📍 {location}</span>
              </span>
            )}
          </div>
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInputChange}
            placeholder="What's on your mind?!"
            className="w-full bg-transparent border-none text-xl placeholder-[#71767b] focus:ring-0 resize-none min-h-[50px] overflow-hidden outline-none"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          {/* Multiple Image Preview */}
          {selectedImages.length > 0 && (
            <div className={cn(
              "mt-3 grid gap-2 rounded-2xl overflow-hidden border border-white/10",
              selectedImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {selectedImages.map((img, i) => (
                <div key={i} className="relative group aspect-video">
                  <img src={img} className="w-full h-full object-cover" alt="Selected" />
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1.5 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedGif && (
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-white/10 group">
              <img src={selectedGif} className="w-full max-h-[300px] object-cover" alt="Selected GIF" />
              <button onClick={() => setSelectedGif(null)} className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Location Input Field */}
          {showLocationInput && (
            <div className="mt-3 flex items-center space-x-2 bg-white/5 p-2 rounded-xl animate-in slide-in-from-top-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              <input 
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder-neutral-600"
                onKeyDown={(e) => e.key === 'Enter' && setShowLocationInput(false)}
              />
              <button onClick={() => { setLocation(''); setShowLocationInput(false); }} className="text-neutral-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tagged Users Preview */}
          {taggedUsers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {taggedUsers.map(u => (
                <div key={u.id} className="flex items-center bg-sky-500/10 border border-sky-500/20 px-2 py-1 rounded-full text-xs font-bold text-sky-500">
                  {u.name}
                  <button onClick={() => toggleTagUser(u)} className="ml-1.5 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <HashtagSuggester query={suggestionQuery} isVisible={showSuggestions} onSelect={handleSelectTag} />

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center space-x-1 relative">
              <Button variant="ghost" size="icon" onClick={handleAddImage} className="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full h-9 w-9">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowGifPicker(!showGifPicker)} className={cn("text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full h-9 w-9", showGifPicker && "bg-sky-500/10")}>
                <Film className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowFeelingPicker(!showFeelingPicker)} className={cn("text-amber-500 hover:bg-amber-500/10 rounded-full h-9 w-9", showFeelingPicker && "bg-amber-500/10")}>
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowLocationInput(!showLocationInput)} className={cn("text-rose-500 hover:bg-rose-500/10 rounded-full h-9 w-9", showLocationInput && "bg-rose-500/10")}>
                <MapPin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowTagPicker(!showTagPicker)} className={cn("text-emerald-500 hover:bg-emerald-500/10 rounded-full h-9 w-9", showTagPicker && "bg-emerald-500/10")}>
                <UserPlus className="w-5 h-5" />
              </Button>
              
              {/* Pickers */}
              {showGifPicker && (
                <div className="absolute top-12 left-0 z-50 bg-[#1c1c1c] border border-white/[0.08] rounded-2xl p-3 grid grid-cols-2 gap-2 w-64 shadow-2xl animate-in zoom-in duration-150">
                  {mockGifs.map((url, i) => (
                    <img key={i} src={url} className="w-full h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => { setSelectedGif(url); setShowGifPicker(false); setSelectedImages([]); }} />
                  ))}
                </div>
              )}

              {showFeelingPicker && (
                <div className="absolute top-12 left-0 z-50 bg-[#1c1c1c] border border-white/[0.08] rounded-2xl p-2 w-64 shadow-2xl animate-in zoom-in duration-150">
                  <div className="grid grid-cols-2 gap-1">
                    {FEELINGS.map((f, i) => (
                      <button 
                        key={i} 
                        onClick={() => { setFeeling(f); setShowFeelingPicker(false); }}
                        className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg text-sm transition-colors"
                      >
                        <span className="text-lg">{f.emoji}</span>
                        <span className="text-neutral-300 font-medium">{f.label}</span>
                      </button>
                    ))}
                    <button onClick={() => { setFeeling(null); setShowFeelingPicker(false); }} className="col-span-2 p-2 text-xs text-rose-500 hover:bg-rose-500/10 rounded-lg">Clear Feeling</button>
                  </div>
                </div>
              )}

              {showTagPicker && (
                <div className="absolute top-12 left-0 z-50 bg-[#1c1c1c] border border-white/[0.08] rounded-2xl p-2 w-64 shadow-2xl animate-in zoom-in duration-150">
                  <div className="p-2 border-b border-white/5 mb-2">
                    <div className="flex items-center bg-white/5 rounded-full px-2 py-1">
                      <Search className="w-3.5 h-3.5 text-neutral-500" />
                      <input placeholder="Search friends" className="bg-transparent border-none text-xs outline-none flex-1 ml-1.5" />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto no-scrollbar">
                    {MOCK_USERS.slice(0, 5).map(u => (
                      <button 
                        key={u.id}
                        onClick={() => toggleTagUser(u as any)}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6"><AvatarImage src={u.avatar} /></Avatar>
                          <span className="text-xs font-bold">{u.name}</span>
                        </div>
                        {taggedUsers.find(tu => tu.id === u.id) && <Check className="w-3 h-3 text-sky-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={cn(
                "text-[11px] font-bold",
                content.length > 280 ? "text-rose-500" : "text-neutral-500"
              )}>
                {content.length}/280
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() && selectedImages.length === 0 && !selectedGif}
                size="sm"
                className="px-6 rounded-full font-bold shadow-lg shadow-sky-500/10 h-9"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
