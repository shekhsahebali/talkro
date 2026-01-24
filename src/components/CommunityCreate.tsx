
import React, { useState } from 'react';
import { X, Globe, Lock, Info, Users, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface CommunityCreateProps {
  onCancel: () => void;
  onCreate: (data: any) => void;
}

const CommunityCreate: React.FC<CommunityCreateProps> = ({ onCancel, onCreate }) => {
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  return (
    <div className="flex flex-col min-h-screen bg-black animate-in slide-in-from-bottom-4 duration-300">
      <header className="sticky top-0 z-40 glass-header border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Create Community</h1>
        </div>
        <Button onClick={() => onCreate({})} size="sm" className="rounded-full px-6 font-bold">Create</Button>
      </header>

      <div className="p-4 sm:p-6 space-y-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 bg-neutral-900 border-2 border-dashed border-white/[0.1] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors group">
            <ImageIcon className="w-8 h-8 text-neutral-500 group-hover:text-sky-500 transition-colors" />
            <span className="text-[10px] uppercase font-bold text-neutral-600 mt-2">Avatar</span>
          </div>
          <p className="text-center text-sm text-neutral-500">Add a recognizable icon for your community.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[15px] font-bold">Community Name</label>
            <input 
              type="text" 
              placeholder="e.g. Modern UI Designers"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 focus:bg-transparent focus:ring-1 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-bold">About</label>
            <textarea 
              placeholder="Describe what this group is about..."
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 focus:bg-transparent focus:ring-1 focus:ring-sky-500 outline-none transition-all h-32 resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[15px] font-bold">Privacy</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => setPrivacy('public')}
                className={cn(
                  "p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4",
                  privacy === 'public' ? "border-sky-500 bg-sky-500/5" : "border-white/[0.08] hover:bg-white/[0.03]"
                )}
              >
                <div className={cn("p-2 rounded-xl", privacy === 'public' ? "bg-sky-500 text-white" : "bg-neutral-800 text-neutral-400")}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Public</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Anyone can see who's in the group and what they post.</p>
                </div>
              </div>

              <div 
                onClick={() => setPrivacy('private')}
                className={cn(
                  "p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4",
                  privacy === 'private' ? "border-sky-500 bg-sky-500/5" : "border-white/[0.08] hover:bg-white/[0.03]"
                )}
              >
                <div className={cn("p-2 rounded-xl", privacy === 'private' ? "bg-sky-500 text-white" : "bg-neutral-800 text-neutral-400")}>
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Private</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Only members can see who's in the group and what they post.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] p-4 rounded-2xl flex items-start space-x-3">
          <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-400 leading-relaxed">
            By creating a community, you agree to our Community Guidelines. Communities with high quality and consistent engagement may be featured in discovery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityCreate;
