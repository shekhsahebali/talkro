
import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Phone, Video, MoreVertical, Send, Smile, Paperclip, Camera, Mic, Info, Maximize2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Button } from './ui/Button';
import { User, Post as PostType } from '../types';
import { cn } from '../lib/utils';
import { CURRENT_USER, INITIAL_POSTS } from '../constants';

interface FloatingChatProps {
  user: User;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onStartCall?: (type: 'audio' | 'video') => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ user, isMinimized, onClose, onMinimize, onStartCall }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', senderId: user.id, text: "Hey! Just saw your latest post, looks cool! 🚀", timestamp: '10:05 AM' },
    { id: '2', senderId: CURRENT_USER.id, text: "Thanks! Working on a new hybrid UI concept.", timestamp: '10:06 AM' },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: user.id,
        text: "That sounds awesome! Can't wait to see the final result.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  return (
    <div className={cn(
      "w-80 bg-[#16181c] rounded-t-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border-x border-t border-white/10 flex flex-col transition-all duration-300",
      isMinimized ? "h-12" : "h-[450px]"
    )}>
      <header className="p-2.5 flex items-center justify-between border-b border-white/[0.08] cursor-pointer rounded-t-2xl" onClick={onMinimize}>
        <div className="flex items-center space-x-2 min-w-0">
           <div className="relative">
             <Avatar className="w-8 h-8"><AvatarImage src={user.avatar} /></Avatar>
             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#16181c] rounded-full" />
           </div>
           <p className="text-[13px] font-black truncate text-white">{user.name}</p>
        </div>
        
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          {!isMinimized && (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-sky-500" onClick={() => onStartCall?.('audio')}><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-sky-500" onClick={() => onStartCall?.('video')}><Video className="w-4 h-4" /></Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400" onClick={onMinimize}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </Button>
          <X className="w-4 h-4 text-neutral-400 ml-1 hover:text-rose-500" onClick={onClose} />
        </div>
      </header>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4 bg-black/20">
             {messages.map((m) => (
               <div key={m.id} className={cn("flex flex-col max-w-[85%]", m.senderId === CURRENT_USER.id ? "ml-auto items-end" : "items-start")}>
                 <div className={cn("p-3 rounded-2xl text-[13px] font-medium", m.senderId === CURRENT_USER.id ? "bg-sky-500 text-white rounded-tr-none" : "bg-white/[0.08] text-neutral-200 rounded-tl-none")}>
                   {m.text}
                 </div>
               </div>
             ))}
          </div>

          <footer className="p-3 border-t border-white/[0.08]">
            <div className="flex items-center space-x-2 bg-white/[0.05] rounded-full px-3 py-1.5">
               <input 
                 type="text" 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Type message..."
                 className="w-full bg-transparent text-[13px] outline-none border-none"
               />
               <Send className="w-4 h-4 text-sky-500 cursor-pointer" onClick={handleSend} />
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default FloatingChat;
