'use client';
import React, { useState } from 'react';
import { Search, MoreHorizontal, Video } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { MOCK_USERS } from '@/lib/constants';
import { useChatStore } from '@/store/useChatStore';




const RightSidebar = ({ show = true }) => {
  
  if (!show) return null;

 

  const trends = [
    { topic: 'React 19', posts: '45.2K posts', category: 'Technology · Trending' },
    { topic: 'Gemini 3.0', posts: '128K posts', category: 'Artificial Intelligence · Trending' },
    { topic: '#WebDev', posts: '12K posts', category: 'Programming · Trending' },
    { topic: 'Tesla Bot', posts: '22.1K posts', category: 'Trending in USA' },
  ];

  // Enhanced mock contacts with online status
  const contacts = MOCK_USERS.slice(0, 8).map((u, i) => ({
    ...u,
    isOnline: i % 3 === 0,
    lastActive: i % 2 === 0 ? 'Active now' : `${i + 2}m ago`
  }));

  return (
    <aside className="sticky right-0 top-0 h-screen hidden lg:flex flex-col space-y-4 px-6 py-4 overflow-y-auto no-scrollbar border-l border-border bg-sidebar z-50 pb-20">
      {/* Search Bar */}
      <div className="sticky top-0 pt-1 pb-3 z-10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 group-focus-within:text-primary/50 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-foreground/5 border-none rounded-full py-3.5 pl-11 pr-4 focus:bg-transparent focus:ring-1 focus:ring-primary/50 transition-all placeholder-foreground/50 outline-none text-[15px] font-medium"
          />
        </div>
      </div>

      {/* Grok Widget */}
      <div className="shrink-0">
        {/* <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary/50" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary/50">Grok</p>
            <p className="text-xs text-foreground/50">Your personal assistant</p>
          </div>
        </div> */}
      </div>

      {/* Contacts / Online Section (Facebook Style) */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[13px] font-black text-foreground/50 uppercase tracking-[0.15em]">Contacts</h2>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50"><Video className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50"><Search className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="space-y-1 px-1">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => useChatStore.getState().openChat(contact.id)}
              className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-foreground/5 transition-all cursor-pointer group"
            >
              <div className="relative">
                <Avatar className="w-9 h-9 border border-border/5 shadow-sm ring-2 ring-transparent group-hover:ring-primary/50/20">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-border rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-foreground truncate leading-tight">{contact.name}</p>
                <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-tighter">{contact.isOnline ? 'Online' : contact.lastActive}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Trends Section */}
      <div className="bg-foreground/2 rounded-3xl overflow-hidden border border-border/8">
        <h2 className="p-5 text-lg font-bold tracking-tight">What happening</h2>
        <div className="space-y-0">
          {trends.map((trend, i) => (
            <div key={i} className="px-5 py-3.5 hover:bg-foreground/5 transition-colors cursor-pointer flex justify-between items-start group">
              <div>
                <p className="text-[11px] font-bold text-foreground/50 uppercase tracking-widest">{trend.category}</p>
                <p className="font-bold text-[15px] mt-0.5 group-hover:text-primary/50 transition-colors">{trend.topic}</p>
                <p className="text-[12px] font-medium text-foreground/50 mt-0.5">{trend.posts}</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-foreground/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-5 pb-10 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-bold text-foreground/60 uppercase tracking-tight">
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Cookies</a>
        <span>© 2026 TalkRo</span>
      </div>
      
    </aside>
  );
};

export default RightSidebar;
