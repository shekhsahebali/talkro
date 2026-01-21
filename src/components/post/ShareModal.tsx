
import React, { useState } from 'react';
import { X, Search, Send, Repeat, User as UserIcon, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Post } from '@/types/post';
import { MOCK_USERS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleSelectUser = (user: string) => {
    setSelectedUser(user);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
  };

  const handleShareToStory = () => {
    if (selectedUser) {
      // onShareToStory(selectedUser, post.id);
      onClose();
    }
  };

  const handleShareToMessage = () => {
    if (selectedUser) {
      // onShareToMessage(selectedUser, post.id);
      onClose();
    }
  };
  const onShareToProfile = (id: string) => {
    // onShareToProfile(id);
    onClose();
  };

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.handle.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#1c1c1c] w-full max-w-[500px] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <header className="p-4 border-b border-white/5 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-black">Share Post</h2>
          <div className="w-10" />
        </header>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl justify-start space-x-4 border-white/10 hover:bg-white/5"
              onClick={() => { onShareToProfile(post.id) }}
            >
              <div className="p-2 bg-sky-500/10 rounded-xl text-sky-500">
                <Repeat className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold">Repost to profile</p>
                <p className="text-xs text-neutral-500">Share this with your followers</p>
              </div>
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-neutral-500 uppercase tracking-widest px-1">Send as Message</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-500/50"
              />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {filteredUsers.map((u) => (
                <div 
                  key={u.id}
                  onClick={() => setSelectedUser(u.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border",
                    selectedUser === u.id ? "bg-sky-500/10 border-sky-500" : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback><UserIcon className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-neutral-500">{u.handle}</p>
                    </div>
                  </div>
                  {selectedUser === u.id && <Check className="w-5 h-5 text-sky-500" />}
                </div>
              ))}
            </div>
          </div>

          <Button 
            disabled={!selectedUser}
            onClick={handleShareToMessage}
            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-neutral-200 font-black text-lg shadow-xl"
          >
            <Send className="w-5 h-5 mr-2" />
            Send to Direct Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
