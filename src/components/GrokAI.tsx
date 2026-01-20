
import React, { useState, useRef, useEffect } from 'react';
import { getGrokResponse } from '../services/geminiService';
import { Sparkles, Send, Bot, User, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types';
import { Button } from './ui/Button';
import { Avatar, AvatarFallback } from './ui/Avatar';
import { Separator } from './ui/Separator';
import { cn } from '../lib/utils';

const GrokAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'I am Grok. Ask me anything happening on X or beyond.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Fetch response with grounding metadata
    const response = await getGrokResponse(input, messages);
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: response.text,
      grounding: response.grounding 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-[#16181c] rounded-2xl border border-[#2f3336] flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b border-[#2f3336] flex items-center space-x-2">
        <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-1.5 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-lg">Grok AI</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn("max-w-[85%] flex space-x-2 items-start", m.role === 'user' && 'flex-row-reverse space-x-reverse')}>
              <Avatar className={cn("w-6 h-6 shrink-0", m.role === 'user' ? 'bg-[#1d9bf0]' : 'bg-[#2f3336]')}>
                <AvatarFallback className="text-[10px] text-white bg-transparent">
                  {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                  ? 'bg-[#1d9bf0] text-white rounded-tr-none' 
                  : 'bg-[#2f3336] text-[#e7e9ea] rounded-tl-none'
              )}>
                <div>{m.text}</div>
                
                {/* Fixed grounding display: Iterate through grounding chunks and display sources as links */}
                {m.grounding && m.grounding.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#3e4144] space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#71767b] flex items-center">
                      Sources
                    </p>
                    {m.grounding.map((chunk: any, idx: number) => {
                      const source = chunk.web || chunk.maps;
                      if (!source) return null;
                      return (
                        <a 
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-[11px] text-[#1d9bf0] hover:underline truncate"
                        >
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{source.title || source.uri}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="animate-pulse bg-[#2f3336] h-10 w-24 rounded-2xl rounded-tl-none"></div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#2f3336]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Grok..."
            className="w-full bg-[#202327] border-none rounded-full pl-4 pr-10 py-2.5 text-sm focus:ring-1 focus:ring-[#1d9bf0] placeholder-[#71767b] outline-none"
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 h-8 w-8 text-[#1d9bf0] hover:text-white hover:bg-[#1d9bf0] transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrokAI;
