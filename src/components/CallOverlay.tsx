
import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, User, Maximize2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { CallState } from '../types';

interface CallOverlayProps {
  call: CallState;
  onEndCall: () => void;
}

const CallOverlay: React.FC<CallOverlayProps> = ({ call, onEndCall }) => {
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(call.type === 'video');

  useEffect(() => {
    let interval: any;
    if (call.status === 'connected') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [call.status]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg aspect-square sm:aspect-video flex flex-col items-center justify-center">
        {isVideoOn ? (
          <div className="w-full h-full bg-neutral-800 rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
            <img src={`https://picsum.photos/seed/call${call.user.name}/1200/800`} className="w-full h-full object-cover" alt="Video" />
            <div className="absolute bottom-6 left-6 flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
               <Avatar className="w-8 h-8"><AvatarImage src={call.user.avatar} /></Avatar>
               <span className="font-bold text-white">{call.user.name}</span>
            </div>
            {/* Self view */}
            <div className="absolute top-6 right-6 w-32 aspect-[3/4] bg-neutral-900 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
               <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                 <User className="w-12 h-12 text-neutral-500" />
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8 animate-in zoom-in duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full animate-pulse" />
              <Avatar className="w-32 h-32 sm:w-48 sm:h-48 border-4 border-white/10 ring-4 ring-sky-500/20 shadow-2xl relative z-10">
                <AvatarImage src={call.user.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight">{call.user.name}</h2>
              <p className="text-sky-500 font-bold uppercase tracking-[0.2em] text-sm">
                {call.status === 'calling' ? 'Calling...' : formatTime(timer)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-12 flex items-center space-x-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMuted(!isMuted)}
          className={cn("w-14 h-14 rounded-full bg-white/10 border border-white/10", isMuted && "bg-rose-500 text-white")}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={cn("w-14 h-14 rounded-full bg-white/10 border border-white/10", !isVideoOn && "bg-neutral-700")}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          onClick={onEndCall}
          className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 shadow-2xl shadow-rose-500/20"
        >
          <PhoneOff className="w-8 h-8 text-white fill-white" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-14 h-14 rounded-full bg-white/10 border border-white/10"
        >
          <Maximize2 className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default CallOverlay;
