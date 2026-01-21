'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Send,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Phone,
  Video,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { cn } from '@/lib/utils';
import { CURRENT_USER } from '@/lib/constants';

type MessageStatus = 'sent' | 'seen';

interface Message {
  id: string;
  senderId: string;
  text?: string;
  fileUrl?: string;
  fileType?: 'image' | 'file';
  timestamp: string;
  status: MessageStatus;
}

interface FloatingChatProps {
  user: User;
  minimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  index: number;
}

const EMOJIS = ['😀', '😂', '😍', '🔥', '👍', '🎉', '❤️', '😎'];

const FloatingChat = ({
  user,
  minimized,
  onToggleMinimize,
  onClose,
  index,
}: FloatingChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [unread, setUnread] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Auto scroll */
  useEffect(() => {
    if (!minimized && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setUnread(0);
    }
  }, [messages, minimized]);

  /* Fake seen status */
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === CURRENT_USER.id ? { ...m, status: 'seen' } : m
        )
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = (msg: Partial<Message>) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
      ...msg,
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-reply`,
          senderId: user.id,
          text: 'Nice! 👌',
          timestamp: newMsg.timestamp,
          status: 'seen',
        },
      ]);

      if (minimized) setUnread((u) => u + 1);
    }, 1200);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage({ text: message.trim() });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({
        fileUrl: reader.result as string,
        fileType: file.type.startsWith('image') ? 'image' : 'file',
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 w-80 bg-card rounded-t-2xl border border-foreground/10 shadow-xl flex flex-col transition-all',
        minimized ? 'h-12' : 'h-[480px]'
      )}
      style={{ right: 50 + index * 330 }}
    >
      {/* Header */}
      <header className="p-2.5 flex items-center justify-between border-b border-foreground/10">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold truncate">{user.name}</span>

          {minimized && unread > 0 && (
            <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </div>


        <div className="flex gap-1 items-center">
          <div>
            {!minimized && (<>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50 hover:primary" onClick={() => onStartCall?.('audio')}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50 hover:text-primary" onClick={() => onStartCall?.('video')}>
                <Video className="w-4 h-4" />
              </Button>
            </>)}
          </div>
          <Button size="icon" variant="ghost" onClick={onToggleMinimize}>
            {minimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {!minimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((m) => {
              const mine = m.senderId === CURRENT_USER.id;

              return (
                <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'rounded-2xl px-3 py-2 text-sm max-w-[80%]',
                      mine
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white/10 rounded-tl-none'
                    )}
                  >
                    {m.text && <p>{m.text}</p>}

                    {m.fileUrl && m.fileType === 'image' && (
                      <img
                        src={m.fileUrl}
                        className="mt-2 rounded-lg max-h-40"
                      />
                    )}

                    <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 mt-1">
                      {m.timestamp}
                      {mine &&
                        (m.status === 'seen' ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-20 left-3 bg-background border rounded-xl p-2 flex gap-2">
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setMessage((m) => m + e)}>
                  {e}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <footer className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
              <Smile
                className="w-4 h-4 cursor-pointer"
                onClick={() => setShowEmoji((v) => !v)}
              />

              <Paperclip
                className="w-4 h-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />

              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files[0])
                }
              />

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message"
                className="flex-1 bg-transparent outline-none text-sm"
              />

              <Send className="w-4 h-4 cursor-pointer text-primary" onClick={handleSend} />
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default FloatingChat;
