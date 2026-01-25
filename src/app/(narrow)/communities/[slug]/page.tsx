'use client';
import React, { useState } from 'react';
import { Community} from '@/types/community';
import {Poll, Feeling, Post as PostType } from '@/types/post';
import { User} from '@/types/user';
import { Globe, Lock, Users, Share2, MoreHorizontal, MessageSquare, Plus, Check, Settings, Pin, ShieldCheck, Info, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Post from '@/components/post/post-card';
// import Composer from '../Composer';
import { INITIAL_POSTS, CURRENT_USER, COMMUNITIES_MOCK } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';


const CommunityProfile  = () => {
    const {slug} = useParams();
    const community = COMMUNITIES_MOCK.find((c) => c.id === slug) || COMMUNITIES_MOCK[0];
  const [isJoined, setIsJoined] = useState(community.isJoined || false);
  const [memberCount, setMemberCount] = useState(community.memberCount);
  const [activeTab, setActiveTab] = useState('Discussion');

  const toggleJoin = () => {
    setIsJoined(!isJoined);
    if (memberCount.endsWith('K')) {
      const num = parseFloat(memberCount);
      setMemberCount(isJoined ? `${(num - 0.1).toFixed(1)}K` : `${(num + 0.1).toFixed(1)}K`);
    }
  };

  const pinnedPost: PostType = {
    ...INITIAL_POSTS[0],
    id: 'pinned-1',
    content: "📌 ANNOUNCEMENT: Welcome to the community! Please read the rules before posting. We're building a supportive space for all developers. #Welcome #CommunityFirst",
  };

  const mockRules = community.rules || [
    { id: '1', title: 'Be Respectful', description: 'No harassment or hate speech allowed.' },
    { id: '2', title: 'No Spam', description: 'Self-promotion should be kept to designated threads.' },
    { id: '3', title: 'Quality Content', description: 'Ensure your posts add value to the community discussion.' }
  ];

  const mockTopics = community.topics || ['Development', 'Technology', 'Career'];

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 glass-header border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate tracking-tight">{community.name}</h1>
            <p className="text-foreground/50 text-[11px] font-black uppercase tracking-widest">{memberCount} Members</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="w-5 h-5 text-foreground/50" /></Button>
           <Button variant="ghost" size="icon" onClick={() => console.log('Settings')} className="rounded-full text-foreground/50 hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-col">
        <div className="h-48 sm:h-64 bg-neutral-800 relative group overflow-hidden">
          <img src={community.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="px-4 pb-6">
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-black ring-0 shadow-2xl">
                <AvatarImage src={community.avatar} />
                <AvatarFallback>{community.name[0]}</AvatarFallback>
              </Avatar>
              {community.userRole === 'admin' && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 border-4 border-black">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 mb-2">
              <Button 
                onClick={toggleJoin}
                className={cn(
                  "rounded-2xl px-8 font-black shadow-xl transition-all h-11",
                  isJoined ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" : "bg-white text-black hover:bg-neutral-200"
                )}
              >
                {isJoined ? 'Joined' : 'Join Community'}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-black tracking-tighter">{community.name}</h2>
            {community.privacyType === 'restricted' && <Lock className="w-4 h-4 text-foreground/50" />}
          </div>
          <p className="text-foreground/50 font-bold text-sm mt-1">@{community.handle}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {mockTopics.map(topic => (
              <span key={topic} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-black text-foreground/50 uppercase tracking-widest hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                {topic}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-foreground/50 font-medium">
            {community.description}
          </p>

          <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-foreground font-black text-lg">{memberCount}</span>
              <span className="text-foreground/50 text-[10px] font-black uppercase tracking-widest">Members</span>
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-black text-lg">1.2K</span>
              <span className="text-foreground/50 text-[10px] font-black uppercase tracking-widest">Posts / Day</span>
            </div>
            <div className="flex items-center -space-x-3 ml-auto">
               {[1,2,3,4].map(i => (
                 <Avatar key={i} className="w-8 h-8 border-2 border-black">
                   <AvatarImage src={`https://picsum.photos/seed/mem${i}/200`} />
                 </Avatar>
               ))}
               <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-foreground/50">+12</div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-border sticky top-[68px] glass-header z-30 overflow-x-auto no-scrollbar">
          {['Discussion', 'Media', 'Members', 'Events', 'Rules'].map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className="flex-1 min-w-[100px] py-4 text-center hover:bg-foreground/3 transition-colors cursor-pointer relative group"
            >
              <span className={cn(
                "text-sm font-black uppercase tracking-widest transition-colors",
                activeTab === tab ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/30"
              )}>{tab}</span>
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(14,165,233,0.3)]" />}
            </div>
          ))}
        </div>

        <div className="bg-card flex flex-col md:flex-row">
          <div className="flex-1 border-r border-border">
            {activeTab === 'Discussion' && (
              <>
                {isJoined && (
                  <div className="bg-foreground/2 border-b border-border">
                    {/* <Composer onPost={onNewPost || (() => {})} /> */}
                  </div>
                )}

                {/* Pinned Post Section */}
                <div className="p-3 bg-primary/5 border-b border-border flex items-center space-x-3">
                   <div className="p-2 bg-primary/10 rounded-full"><Pin className="w-3.5 h-3.5 text-primary" /></div>
                   <span className="text-[11px] font-black text-primary uppercase tracking-widest">Pinned by Moderator</span>
                </div>
                <Post post={pinnedPost} />

                {/* Regular Feed */}
                <div className="divide-y divide-white/[0.08]">
                  {INITIAL_POSTS.map(post => (
                    <Post key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}

            {activeTab === 'Rules' && (
              <div className="p-6 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-primary/10 rounded-2xl"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Community Rules</h3>
                    <p className="text-foreground/50 text-sm">Rules set by the @{community.handle} moderators.</p>
                  </div>
                </div>
                {mockRules.map((rule, idx) => (
                  <div key={rule.id} className="p-5 bg-white/[0.03] border border-border rounded-[24px] hover:border-white/20 transition-all group">
                    <div className="flex items-start space-x-4">
                       <span className="text-2xl font-black text-primary/30 group-hover:text-primary transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                       <div>
                         <h4 className="font-bold text-lg text-neutral-200">{rule.title}</h4>
                         <p className="text-foreground/50 mt-1 text-sm leading-relaxed">{rule.description}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Members' && (
              <div className="divide-y divide-white/5">
                <div className="p-4 bg-white/[0.02] flex items-center justify-between">
                   <h3 className="text-[11px] font-black text-foreground/50 uppercase tracking-widest">Administrators</h3>
                   <span className="text-primary text-xs font-bold hover:underline cursor-pointer">View all</span>
                </div>
                <div className="p-4 flex items-center space-x-3">
                   <Avatar className="w-10 h-10 border border-white/10"><AvatarImage src="https://picsum.photos/seed/admin/200" /></Avatar>
                   <div className="flex-1">
                     <p className="text-sm font-bold">Admin User <ShieldCheck className="w-3 h-3 text-primary inline ml-1" /></p>
                     <p className="text-xs text-foreground/50">Founder</p>
                   </div>
                   <Button variant="outline" size="sm" className="rounded-xl h-8 text-[11px] font-black uppercase tracking-tighter">Follow</Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Info Cards (Desktop Only) */}
          <div className="hidden lg:flex flex-col w-[300px] p-4 space-y-6 shrink-0">
             <div className="bg-white/[0.03] border border-border rounded-3xl p-5 space-y-4 shadow-xl">
                <h3 className="font-black text-sm uppercase tracking-widest text-foreground/50">About Community</h3>
                <p className="text-sm text-foreground/50 leading-relaxed font-medium">
                  {community.description}
                </p>
                <div className="space-y-3 pt-2">
                   <div className="flex items-center text-xs text-foreground/50">
                     <Globe className="w-4 h-4 mr-3 text-neutral-600" /> Public Community
                   </div>
                   <div className="flex items-center text-xs text-foreground/50">
                     <Info className="w-4 h-4 mr-3 text-neutral-600" /> Created Jan 2024
                   </div>
                </div>
             </div>

             <div className="bg-white/[0.03] border border-border rounded-3xl p-5 space-y-4">
                <h3 className="font-black text-sm uppercase tracking-widest text-foreground/50">Moderators</h3>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <Avatar key={i} className="w-9 h-9 border-2 border-black ring-2 ring-white/5">
                        <AvatarImage src={`https://picsum.photos/seed/mod${i}/200`} />
                     </Avatar>
                   ))}
                </div>
                <Button variant="ghost" className="w-full text-xs font-black text-primary hover:bg-primary/10 rounded-xl py-2">
                   View Moderators
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;
