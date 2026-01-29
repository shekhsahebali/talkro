'use client';

import { Settings as SettingsIcon, Home, Search, PlaySquare, Mail, Users, Loader2, Plus, MessageCircleMore } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Post from '@/components/post/post-card';
import { INITIAL_POSTS, STORY_DATA } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/theme-toggle';
import { CURRENT_USER } from '@/lib/constants';
import Stories from '@/components/story/story-card';
const HomePage = () => {

  const router = useRouter();
 
  const handlemessage = () => {
    router.push('/messages');
  }

  return (
    <div className="flex flex-col main animate-in fade-in duration-500">
      <header className="top-0 m-0 z-30 bg-background border-b border-border/8 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <nav className="flex space-x-4">
            <button className="text-[20px] font-bold border-b-2 border-primary pb-1 text-foreground">For You</button>
            <button className="text-[20px] font-medium text-foreground/50">Following</button>
          </nav>
        </div>
        <div className="flex items-center space-x">
          <Button variant="ghost" size="icon" className="rounded inline-block sm:hidden" onClick={handlemessage} >
            <MessageCircleMore className="w-6 h-6 bold" />
            </Button>
          <ThemeToggle />
        </div>

      </header>

      <div className="p-4 border-b border-border flex items-center space-x-3 cursor-pointer bg-foreground/5 hover:bg-foreground/10 rounded">
        <Avatar className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 ring-2 ring-transparent hover:ring-ring transition-all">
          <AvatarImage src={CURRENT_USER.avatar} />
          <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex w-full" onClick={() => router.push('/post/create')}>

        <span className="text-foreground/50 font-medium text-lg">What happening?</span>
        <div className="ml-auto p-2 rounded-full text-foreground"><Plus className="w-5 h-5 text-foreground/50" /></div>

        </div>
      </div>

      <Stories stories={STORY_DATA} />

      <div className="flex flex-col">
        {INITIAL_POSTS.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>


    </div>
  );
};

export default HomePage;
