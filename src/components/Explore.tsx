import React from 'react';
import { EXPLORE_TRENDS_MOCK } from '../constants';
import { Search, Settings, MoreHorizontal, Hash, Play, TrendingUp, BarChart2 } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

// Enhanced mock data for masonry grid
const MASONRY_CONTENT = [
  {
    id: 1,
    title: "Gemini 3.0",
    category: "Technology",
    stats: "2.4M posts",
    image: "https://picsum.photos/seed/ai-tech/400/500",
    description: "The next generation of multimodal AI is here, changing how we interact with the web.",
    isLive: true
  },
  {
    id: 2,
    title: "#NextJS",
    category: "Web Development",
    stats: "45K posts",
    description: "Developers are raving about the latest Server Actions improvements.",
  },
  {
    id: 3,
    title: "SpaceX Starship",
    category: "Science",
    stats: "128K posts",
    image: "https://picsum.photos/seed/rocket/400/300",
    description: "Another successful test flight completed today."
  },
  {
    id: 4,
    title: "The Last of Us S2",
    category: "Entertainment",
    stats: "890K posts",
    image: "https://picsum.photos/seed/tlou/400/600",
    description: "The new trailer just dropped and it's breaking the internet."
  },
  {
    id: 5,
    title: "Olympic Qualifiers",
    category: "Sports",
    stats: "12K posts",
    description: "Unexpected results in the swimming trials."
  },
  {
    id: 6,
    title: "Cyberpunk 2077 Sequel",
    category: "Gaming",
    stats: "56K posts",
    image: "https://picsum.photos/seed/cyber/400/400",
    description: "CD Projekt Red shares new concept art for Project Orion."
  },
  {
    id: 7,
    title: "#TailwindCSS",
    category: "Design",
    stats: "8.4K posts",
    description: "V4 is shaping up to be a game-changer for CSS performance."
  }
];

const Explore: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="sticky top-0 z-30 glass-header border-b border-white/[0.08]">
        <div className="px-4 py-4 flex items-center space-x-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-sky-500 transition-colors" />
            <input
              type="text"
              placeholder="Explore interests..."
              className="w-full bg-white/[0.05] border-none rounded-full py-2 pl-11 pr-4 focus:bg-transparent focus:ring-1 focus:ring-sky-500 transition-all placeholder-neutral-500 outline-none text-[15px] font-medium h-10"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5 text-neutral-400" />
          </Button>
        </div>
        
        <div className="flex text-center overflow-x-auto no-scrollbar scroll-smooth">
          {['For you', 'Trending', 'News', 'Sports', 'Entertainment', 'Science'].map((tab, idx) => (
            <div key={tab} className="flex-1 min-w-[90px] py-4 font-bold hover:bg-white/[0.03] transition-colors cursor-pointer relative text-[14px]">
              <span className={idx === 0 ? "text-white" : "text-neutral-500"}>{tab}</span>
              {idx === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-sky-500 rounded-full shadow-lg shadow-sky-500/50" />}
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 p-3 sm:p-4">
        {/* Main Banner */}
        <div className="relative rounded-2xl h-48 sm:h-64 w-full bg-neutral-900 overflow-hidden cursor-pointer group mb-6 shadow-2xl">
          <img 
            src="https://picsum.photos/seed/explore-hero/1200/800" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-75" 
            alt="Trending" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="bg-rose-500 text-[9px] font-black px-1.5 py-0.5 rounded-sm flex items-center">
                <Play className="w-2.5 h-2.5 fill-white mr-1" />
                LIVE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
              Human-AI Interaction
            </h2>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="text-lg font-black tracking-tight">Trending Now</h3>
          <div className="flex items-center text-sky-500 text-[10px] font-black cursor-pointer hover:underline uppercase tracking-widest">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Live Analytics
          </div>
        </div>

        {/* Masonry Grid Layout - Optimized for small screens */}
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {MASONRY_CONTENT.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden group hover:border-white/[0.2] transition-all duration-300"
            >
              {item.image && (
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  {item.isLive && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-[8px] font-black px-1 py-0.5 rounded-sm">LIVE</div>
                  )}
                </div>
              )}
              
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{item.category}</span>
                  <MoreHorizontal className="w-4 h-4 text-neutral-600 cursor-pointer hover:text-white" />
                </div>
                <h4 className="font-bold text-[14px] group-hover:text-sky-400 transition-colors tracking-tight">{item.title}</h4>
                {item.description && (
                  <p className="mt-1.5 text-xs text-neutral-400 font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-2.5 flex items-center text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">
                  <BarChart2 className="w-3 h-3 mr-1" />
                  {item.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-10 mb-6">
          <h3 className="text-lg font-black tracking-tight mb-4 px-1">Browse by Interest</h3>
          <div className="flex flex-wrap gap-2 px-1">
            {['#Coding', '#ReactJS', '#AI', '#Vibe', '#Fitness', '#Design', '#Startup', '#Travel'].map((tag) => (
              <div 
                key={tag} 
                className="flex items-center space-x-2 bg-white/[0.05] hover:bg-sky-500/10 hover:text-sky-400 transition-all rounded-full px-4 py-2 cursor-pointer border border-white/[0.08] active:scale-95"
              >
                <Hash className="w-3 h-3 text-sky-500" />
                <span className="text-xs font-bold tracking-tight">{tag.substring(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-500/10 to-transparent p-6 rounded-2xl border border-white/[0.08] mb-10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight mb-1">Personalize your feed?</h3>
            <p className="text-xs text-neutral-400 font-medium">Follow your favorite topics to stay updated.</p>
          </div>
          <Button size="sm" className="rounded-xl px-6 h-10 font-bold shadow-lg shadow-sky-500/20 whitespace-nowrap">
            Follow Topics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Explore;