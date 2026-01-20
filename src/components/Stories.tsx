
import React from 'react';
import { Story } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Plus, Play, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { CURRENT_USER } from '../constants';

interface StoriesProps {
  stories: Story[];
  onAddStory: () => void;
  onViewStory: (story: Story) => void;
}

const Stories: React.FC<StoriesProps> = ({ stories, onAddStory, onViewStory }) => {
  return (
    <div className="border-b border-white/[0.08] overflow-x-auto no-scrollbar py-6 px-4 flex items-center space-x-4 bg-black/40">
      {/* Create Story Card - FB/IG Style */}
      <div 
        onClick={onAddStory}
        className="relative group w-32 h-52 sm:w-36 sm:h-60 shrink-0 rounded-[24px] overflow-hidden cursor-pointer border border-white/[0.08] hover:border-sky-500/50 transition-all shadow-2xl bg-neutral-900"
      >
        <div className="h-[70%] overflow-hidden">
          <img 
            src={CURRENT_USER.avatar} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
            alt="Create Story" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[30%] bg-neutral-800 flex flex-col items-center justify-center p-2">
          <div className="absolute -top-6 bg-sky-500 rounded-full p-2 border-[5px] border-neutral-900 shadow-xl group-hover:scale-110 transition-transform ring-4 ring-sky-500/20">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-[12px] font-black text-white mt-4 tracking-tight">Create Story</span>
        </div>
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
           <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
        </div>
      </div>

      {/* User Stories */}
      {stories.map((story) => (
        <div 
          key={story.id} 
          onClick={() => onViewStory(story)}
          className="relative group w-32 h-52 sm:w-36 sm:h-60 shrink-0 rounded-[24px] overflow-hidden cursor-pointer border border-white/[0.08] hover:border-white/20 transition-all shadow-2xl shadow-black/50"
        >
          <img 
            src={story.mediaUrl || `https://picsum.photos/seed/${story.id}/800/1200`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100" 
            alt={story.user.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
          
          {/* User Avatar Circle */}
          <div className={cn(
            "absolute top-4 left-4 p-0.5 rounded-full ring-[3px] ring-offset-2 ring-offset-black/50 transition-all",
            story.hasUnseen ? "ring-sky-500 shadow-lg shadow-sky-500/20" : "ring-neutral-600"
          )}>
            <Avatar className="w-10 h-10 border-2 border-black">
              <AvatarImage src={story.user.avatar} />
              <AvatarFallback>{story.user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
             <span className="text-[12px] font-black text-white truncate drop-shadow-lg block leading-tight">
               {story.user.name.split(' ')[0]}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stories;
