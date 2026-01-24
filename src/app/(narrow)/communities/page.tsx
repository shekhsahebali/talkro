'use client';
import React, { useState } from 'react';
import { COMMUNITIES_MOCK } from '@/lib/constants';
import { Search, Settings, Users, Globe, Lock, Plus, MoreHorizontal, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Community } from '@/types/community';
import { useRouter } from 'next/navigation';


const Communities  = () => {
  const [groups, setGroups] = useState(COMMUNITIES_MOCK);
  const router = useRouter();
  const toggleJoin = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          const currentlyJoined = group.isJoined;
          let newCount = group.memberCount;
          if (newCount.endsWith('K')) {
            const num = parseFloat(newCount);
            newCount = currentlyJoined ? `${(num - 0.1).toFixed(1)}K` : `${(num + 0.1).toFixed(1)}K`;
          }

          return {
            ...group,
            isJoined: !currentlyJoined,
            memberCount: newCount
          };
        }
        return group;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 glass-header border-b border-border">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Communities</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
               <Search className="w-5 h-5 text-foreground/40" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push('/communities/create')} className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary">
               <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 flex space-x-2 overflow-x-auto no-scrollbar border-b border-border sticky top-[68px] glass-header z-20">
          <Button variant="secondary" size="sm" className="rounded-full shrink-0 h-9 px-5 font-bold">Discover</Button>
          <Button variant="outline" size="sm" className="rounded-full shrink-0 h-9 px-5 font-bold border-border text-foreground/40">Your Groups</Button>
          <Button variant="outline" size="sm" className="rounded-full shrink-0 h-9 px-5 font-bold border-border text-foreground/40">Events</Button>
        </div>

        <div className="p-4 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold tracking-tight">Suggested for you</h2>
              <span className="text-primary text-sm font-bold cursor-pointer hover:underline uppercase tracking-tighter">See all</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {groups.map((group) => (
                <div 
                  key={group.id} 
                  onClick={() => console.log(group)}
                  className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group/card hover:border-border transition-all cursor-pointer"
                >
                  <div className="h-28 w-full bg-neutral-800 relative overflow-hidden">
                    <img src={group.cover} alt="Cover" className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4 relative flex flex-col flex-1">
                    <Avatar className="w-16 h-16 border-4 border-border absolute -top-10 left-4 shadow-xl">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="mt-8 flex-1">
                      <h3 className="font-bold text-lg transition-colors tracking-tight">{group.name}</h3>
                      <p className="text-foreground/50 text-[13px] flex items-center space-x-1 mt-1 font-medium uppercase tracking-tighter">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Public · {group.memberCount} members</span>
                      </p>
                      <p className="text-[14px] mt-4 line-clamp-2 text-foreground/50 leading-relaxed font-medium">
                        {group.description}
                      </p>
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <Button 
                        onClick={(e) => toggleJoin(e, group.id)}
                        className={cn(
                          "flex-1 rounded-xl h-10 font-bold transition-all duration-300",
                          group.isJoined 
                            ? "bg-transparent border border-border text-foreground hover:bg-foreground/3 hover:text-rose-500 hover:border-rose-500/50" 
                            : "bg-foreground/7 text-foreground hover:bg-foreground/10"
                        )}
                        variant={group.isJoined ? "outline" : "default"}
                      >
                        {group.isJoined ? (
                          <span className="flex items-center">
                            <Check className="w-4 h-4 mr-2" />
                            Joined
                          </span>
                        ) : "Join Group"}
                      </Button>
                      <Button variant="outline" className="rounded-xl px-3 h-10 border-border" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-white/[0.05] to-transparent rounded-2xl p-6 border border-border flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Create a new community</h3>
                <p className="text-sm text-neutral-500 font-medium">Connect with people who share your passion.</p>
              </div>
            </div>
            <Button onClick={() => console.log("Start Group")} className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-primary/10">Start Group</Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Communities;
