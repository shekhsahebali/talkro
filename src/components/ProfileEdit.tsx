
import React, { useState } from 'react';
import { CURRENT_USER } from '../constants';
import { Camera, X, Check, MapPin, Link as LinkIcon, Briefcase, GraduationCap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Button } from './ui/Button';

interface ProfileEditProps {
  onSave: () => void;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...CURRENT_USER });

  return (
    <div className="flex flex-col min-h-screen bg-black animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 glass-header border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
        </div>
        <Button onClick={onSave} size="sm" className="rounded-full px-6 font-bold">Save</Button>
      </header>

      <div className="flex flex-col">
        {/* Edit Cover */}
        <div className="relative h-48 sm:h-64 bg-neutral-800 group cursor-pointer">
          <img src={formData.cover} className="w-full h-full object-cover opacity-60" alt="Cover" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/40 p-3 rounded-full backdrop-blur-md">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Edit Avatar */}
        <div className="px-4 relative">
          <div className="relative -mt-16 inline-block group cursor-pointer">
            <Avatar className="w-32 h-32 border-4 border-black ring-0 opacity-80">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/40 p-3 rounded-full backdrop-blur-md">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-4 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-500 ml-1">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-500 ml-1">Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all resize-none h-24"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-500 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-neutral-500 ml-1">Website</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-500 ml-1">Professional Experience</label>
            <div className="space-y-3">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Where do you work?"
                  value={formData.work}
                  onChange={(e) => setFormData({...formData, work: e.target.value})}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 focus:border-sky-500 outline-none"
                />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Where did you study?"
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
