
import React from 'react';
import { TRENDING_HASHTAGS } from '../constants';
import { cn } from '../lib/utils';
import { Hash } from 'lucide-react';

interface HashtagSuggesterProps {
  query: string;
  onSelect: (tag: string) => void;
  isVisible: boolean;
}

const HashtagSuggester: React.FC<HashtagSuggesterProps> = ({ query, onSelect, isVisible }) => {
  if (!isVisible) return null;

  const filtered = TRENDING_HASHTAGS.filter(tag => 
    tag.toLowerCase().startsWith(query.toLowerCase())
  ).slice(0, 5);

  if (filtered.length === 0) return null;

  return (
    <div className="absolute z-50 mt-1 w-64 bg-[#1c1c1c] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
      <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Suggestions</span>
      </div>
      <div className="flex flex-col">
        {filtered.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className="px-4 py-3 flex items-center space-x-3 hover:bg-white/[0.05] transition-colors text-left group"
          >
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 group-hover:scale-110 transition-transform">
              <Hash className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-200">#{tag}</span>
              <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-tighter">Trending</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HashtagSuggester;
