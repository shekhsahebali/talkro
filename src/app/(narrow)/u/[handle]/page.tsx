'use client';
import React, { useState } from 'react';
import { CURRENT_USER, INITIAL_POSTS, MOCK_USERS } from '@/lib/constants';
import { MapPin, Link as LinkIcon, Calendar, Briefcase, GraduationCap, MessageSquare, Edit3, CheckCircle2, UserPlus, UserCheck, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Post from '@/components/post/post-card';
import { cn } from '@/lib/utils';
import { Post as PostType } from '@/types/post';
import { notFound, useParams } from 'next/navigation';



const Profile= () => {
    const params = useParams();
    const handle = params.handle;

    if (!handle) {
      notFound();
    }

    const user = MOCK_USERS.find(u => u.handle === handle);

    if (!user) {
      notFound();
    }
    const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'Posts' | 'Following' | 'Followers' | 'Favorites'>('Posts');

  const favoritePosts = posts.filter(p => p.isFavorite);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Following':
      case 'Followers':
        return (
          <div className="divide-y divide-white/[0.08] animate-in fade-in duration-300">
            {MOCK_USERS.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold truncate text-[15px]">{user.name}</span>
                      {user.verified && <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-black" />}
                    </div>
                    <p className="text-neutral-500 text-sm truncate">{user.handle}</p>
                    <p className="text-neutral-400 text-sm truncate mt-0.5 line-clamp-1">{user.bio}</p>
                  </div>
                </div>
                <Button 
                  variant={user.isFollowing ? "outline" : "secondary"} 
                  size="sm" 
                  className="rounded-full font-bold px-4"
                >
                  {user.isFollowing ? <UserCheck className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            ))}
          </div>
        );
      case 'Favorites':
        return (
          <div className="flex flex-col bg-black animate-in fade-in duration-300">
            {favoritePosts.length > 0 ? (
              favoritePosts.map(post => (
                <Post 
                  key={post.id} 
                  post={post}
                />
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-xl font-bold">No Favorites Yet</h3>
                <p className="text-neutral-500 text-sm max-w-xs mx-auto">When you favorite a post, it will show up here for easy access later.</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col bg-black animate-in fade-in duration-300">
            {posts.filter(p => p.author.id === CURRENT_USER.id).map(post => (
              <Post 
                key={post.id} 
                post={post}
              />
            ))}
            {posts.filter(p => p.author.id === CURRENT_USER.id).length === 0 && (
               <div className="p-20 text-center text-neutral-500">No posts yet.</div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 w-full bg-[#333]">
        <img src={CURRENT_USER.cover} alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Profile Info Header */}
      <div className="px-4 pb-4">
        <div className="relative flex justify-between items-end -mt-16 sm:-mt-20">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-black ring-0 shadow-2xl">
            <AvatarImage src={CURRENT_USER.avatar} />
            <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex space-x-2 mb-2">
            <Button variant="outline" className="rounded-full shadow-lg">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button onClick={() => {}} className="rounded-full shadow-lg bg-white text-black hover:bg-neutral-200">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold tracking-tight">{CURRENT_USER.name}</h2>
          <p className="text-neutral-500 font-medium">{CURRENT_USER.handle}</p>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-neutral-200">{CURRENT_USER.bio}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-neutral-500 text-[14px]">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-neutral-600" />
            <span>Works at <span className="text-neutral-300 font-bold">{CURRENT_USER.work}</span></span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-neutral-600" />
            <span>Studied at <span className="text-neutral-300 font-bold">{CURRENT_USER.education}</span></span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-neutral-600" />
            <span>Lives in <span className="text-neutral-300 font-bold">{CURRENT_USER.location}</span></span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="w-4 h-4 mr-2 text-neutral-600" />
            <span className="text-sky-500 hover:underline cursor-pointer font-medium">{CURRENT_USER.website}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-neutral-600" />
            <span>Joined {CURRENT_USER.joined}</span>
          </div>
        </div>

        <div className="mt-5 flex space-x-6 border-t border-white/[0.05] pt-5">
          <div className="hover:underline cursor-pointer" onClick={() => setActiveTab('Following')}>
            <span className="font-extrabold text-white">{CURRENT_USER.following}</span>
            <span className="text-neutral-500 ml-1 text-sm font-medium uppercase tracking-wider">Following</span>
          </div>
          <div className="hover:underline cursor-pointer" onClick={() => setActiveTab('Followers')}>
            <span className="font-extrabold text-white">{CURRENT_USER.followers}</span>
            <span className="text-neutral-500 ml-1 text-sm font-medium uppercase tracking-wider">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.08] sticky top-0 z-30 glass-header overflow-x-auto no-scrollbar">
        {['Posts', 'Following', 'Followers', 'Favorites', 'Media', 'Likes'].map((tab) => (
          <div 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className="flex-1 min-w-[100px] py-4 text-center hover:bg-white/[0.03] transition-colors cursor-pointer relative group"
          >
            <span className={activeTab === tab ? "font-bold text-white" : "text-neutral-500 font-medium"}>{tab}</span>
            {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-500 rounded-full shadow-lg shadow-sky-500/30" />}
          </div>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="flex flex-col bg-black flex-1 min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
