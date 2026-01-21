'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Story } from '@/types/post';
import { X, MoreHorizontal, Heart, Send, Music, Share2, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, MessageSquare, Plus, Pause, Play } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StoryViewerProps {
  stories: Story[];
  initialStoryId: number;
  onClose: () => void;
}

const REACTIONS = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🔥', label: 'Fire' },
];

interface Particle {
  id: number;
  emoji: string;
  left: number;
}

const StoryViewer  = ({ stories, initialStoryId, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(() => 
    stories.findIndex(s => s.id === initialStoryId)
  );
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showSentToast, setShowSentToast] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const story = stories[currentIndex];

  // Effect to pause automatically if reacting or replying
  // useEffect(() => {
  //   if (showReactions || replyText.length > 0) {
  //     setIsPaused(true);
  //   }
  // }, [showReactions, replyText]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
      setIsLiked(false);
    } else {
      setIsFinished(true);
    }
  };
  useEffect(() => {
    if (isFinished || isPaused) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleNext();
          return 100;
        }
        return prev + 1;
      });
    }, 40); 

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, isFinished]);



  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setIsLiked(false);
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setProgress(0);
    setIsFinished(false);
    setIsLiked(false);
  };

  const spawnParticles = (emoji: string) => {
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      emoji,
      left: 40 + Math.random() * 20, 
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  };

  const handleReaction = (emoji: string) => {
    spawnParticles(emoji);
    if (emoji === '❤️') setIsLiked(true);
    setTimeout(() => {
      setShowReactions(false);
      setIsPaused(false);
    }, 500);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setShowSentToast(true);
    setReplyText('');
    setIsPaused(false);
    setTimeout(() => setShowSentToast(false), 2000);
  };

 const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
  const target = e.target as HTMLElement;

  if (target.closest('button') || target.closest('input')) return;

  const clientX =
    'touches' in e
      ? e.touches[0]?.clientX
      : (e as React.MouseEvent).clientX;

  if (clientX == null) return;

  const width = window.innerWidth;

  const leftZone = width * 0.3;
  const rightZone = width * 0.7;

  if (clientX < leftZone) {
    handlePrev();
  } else if (clientX > rightZone) {
    handleNext();
  }
  // middle 40% → do nothing (no gap feeling)
};


  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(!true)
    // setIsPaused(!isPaused);
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center animate-in fade-in duration-500 backdrop-blur-3xl">
        <div className="text-center space-y-10 animate-in zoom-in-90 duration-500 max-w-sm px-6">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-full h-full bg-neutral-900 rounded-full flex items-center justify-center border-4 border-sky-500/30">
              <CheckCircle2 className="w-16 h-16 text-sky-500" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-4xl font-black text-white tracking-tighter">Caught Up!</h3>
            <p className="text-neutral-400 font-medium text-lg leading-snug">You've seen all current stories from your circle.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full">
            <Button onClick={handleReplay} className="h-16 rounded-3xl bg-white text-black hover:bg-neutral-200 font-black text-xl flex items-center justify-center space-x-3 shadow-2xl">
              <RotateCcw className="w-6 h-6" />
              <span>Watch Again</span>
            </Button>
            <Button variant="ghost" onClick={onClose} className="h-14 rounded-2xl text-neutral-500 hover:text-white font-black uppercase tracking-widest text-sm">
              Back to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center animate-in fade-in duration-300 select-none">
      <div className="absolute inset-0 opacity-40 blur-3xl scale-125 select-none pointer-events-none">
        <Image width={0} height={0} src={story.mediaUrl || `https://picsum.photos/seed/${story.id}/1200/1200`} className="w-full h-full object-cover" alt="bg" />
      </div>

      <div className="absolute top-0 inset-x-0 p-4 flex space-x-1.5 z-[100] max-w-[480px] mx-auto">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-[2.5px] bg-white/20 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full bg-white transition-all duration-[40ms] ease-linear",
                idx < currentIndex ? "w-full" : idx === currentIndex ? "" : "w-0"
              )}
              style={{ width: idx === currentIndex ? `${progress}%` : undefined }} 
            />
          </div>
        ))}
      </div>

      <div 
        className="relative w-full max-w-[480px] h-full sm:h-[92vh] sm:rounded-[40px] overflow-hidden bg-neutral-950 shadow-[0_0_120px_rgba(0,0,0,0.9)] flex flex-col group"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => { if (!showReactions && replyText.length === 0) setIsPaused(false); }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => { if (!showReactions && replyText.length === 0) setIsPaused(false); }}
        onClick={handleTap}
        onDoubleClick={togglePause}
      >
        <div className="block absolute -left-20 top-1/2 -translate-y-1/2 z-[100]">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handlePrev(); }} disabled={currentIndex === 0} className="w-14 h-14 rounded-full bg-black/40 text-white border border-white/10 disabled:opacity-20 hover:scale-110 transition-transform">
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </div>
        <div className="block absolute -right-20 top-1/2 -translate-y-1/2 z-[100]">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleNext(); }} className="w-14 h-14 rounded-full bg-black/40 text-white border border-white/10 hover:scale-110 transition-transform">
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        <div className="absolute inset-0 pointer-events-none z-[80]">
          {particles.map(p => (
            <div 
              key={p.id}
              style={{ left: `${p.left}%` }}
              className="absolute bottom-20 text-4xl animate-story-particle opacity-0"
            >
              {p.emoji}
            </div>
          ))}
        </div>

        <div className="absolute top-8 inset-x-0 p-5 flex items-center justify-between z-[90] pointer-events-none">
          <div className="flex items-center space-x-3 pointer-events-auto">
            <Avatar className="w-10 h-10 ring-2 ring-white/20 shadow-xl">
              <AvatarImage src={story.user.avatar} />
              <AvatarFallback>{story.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="flex items-center space-x-1.5">
                <p className="text-white text-[15px] font-black">{story.user.name}</p>
                <span className="text-white/60 text-[10px] font-bold">12h</span>
              </div>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">{story.music?.title || 'Original Audio'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 pointer-events-auto">
            <Button variant="ghost" size="icon" onClick={togglePause} className="text-white hover:bg-black/20 h-10 w-10 rounded-full">
              {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-black/20 h-10 w-10 rounded-full">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white hover:bg-black/20 h-10 w-10 rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
          <Image width={0} height={0} 
            src={story.mediaUrl || `https://picsum.photos/seed/${story.id}/800/1200`} 
            className="w-full h-full object-cover select-none pointer-events-none" 
            alt="Story" 
          />
          
          {story.textOverlays?.map((overlay) => (
            <div 
              key={overlay.id}
              style={{ top: `${overlay.y}%`, left: `${overlay.x}%`, color: overlay.color }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 pointer-events-none select-none"
            >
              <span className="text-4xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-nowrap">
                {overlay.text}
              </span>
            </div>
          ))}
        </div>

        {showSentToast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-white/95 text-black font-black px-6 py-2.5 rounded-full shadow-2xl animate-in slide-in-from-bottom-2">
            Reply Sent
          </div>
        )}

        <div className="relative p-6 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent z-[90] flex flex-col space-y-4">
          
          {showReactions && (
            <div 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => { if (replyText.length === 0) setIsPaused(false); }}
              className="flex items-center justify-around bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-[24px] p-3 mb-2 animate-in slide-in-from-bottom-4 duration-300 shadow-2xl"
            >
              {REACTIONS.map((r, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); handleReaction(r.emoji); }}
                  className="text-3xl hover:scale-150 active:scale-90 transition-all duration-200 p-2"
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="flex-1 relative group/input">
              <input 
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={(e) => { e.stopPropagation(); setIsPaused(true); setShowReactions(true); }}
                onBlur={() => { 
                  if (!showReactions && replyText.length === 0) setIsPaused(false); 
                  setTimeout(() => { if (replyText.length === 0) setShowReactions(false); }, 500);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
                placeholder={`Reply to ${story.user.name.split(' ')[0]}...`}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3.5 text-white text-[15px] font-medium placeholder-white/40 focus:bg-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); handleSendReply(); }}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-sky-400 hover:text-white transition-all",
                  replyText.trim() ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-1 shrink-0">
              <button 
                onClick={(e) => { e.stopPropagation(); handleReaction('❤️'); }}
                className={cn(
                  "p-3 rounded-full transition-all active:scale-75",
                  isLiked ? "text-rose-500 bg-rose-500/10" : "text-white hover:bg-white/10"
                )}
              >
                <Heart className={cn("w-7 h-7", isLiked && "fill-rose-500")} />
              </button>
              <button className="p-3 text-white hover:bg-white/10 rounded-full transition-all">
                <Share2 className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes story-particle {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-40px) scale(1.2); }
          100% { transform: translateY(-400px) scale(1); opacity: 0; }
        }
        .animate-story-particle {
          animation: story-particle 1.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StoryViewer;
