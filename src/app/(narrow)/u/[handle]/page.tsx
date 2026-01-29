'use client';
import { useState } from 'react';
import { CURRENT_USER, INITIAL_POSTS, MOCK_USERS } from '@/lib/constants';
import { MapPin, Link as LinkIcon, Calendar, Briefcase, GraduationCap, MessageSquare, Edit3, CheckCircle2, UserPlus, UserCheck, Star, Plus, Video } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Post from '@/components/post/post-card';
import { cn } from '@/lib/utils';
import { Post as PostType } from '@/types/post';
import { notFound, useParams } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import Image from 'next/image';

const Tabs = [
  'Posts',
  'Reels',
  'Following',
  'Followers',
  // 'Favorites'

]


const Profile = () => {
  const params = useParams();
  const handle = params.handle;
  const [owner, setOwner] = useState(CURRENT_USER.handle == handle)
  const [activeTab, setActiveTab] = useState(Tabs[0]);

  if (!handle) notFound();

  const user = MOCK_USERS.find(u => u.handle === handle);

  if (!user) notFound();

  const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS.filter(post => post.author.handle === handle));

  const favoritePosts = posts.filter(p => p.isFavorite);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Reels':
        return (
          <div className="divide-y divide-foreground/8 main animate-in fade-in duration-300">
            <div className="p-20 text-center w-full">
              <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
                <Video className="w-8 h-8 text-foreground/60" />
              </div>
              <h3 className="text-xl font-bold">No Favorites Yet</h3>
              <p className="text-foreground/50 text-sm max-w-xs mx-auto">When you favorite a post, it will show up here for easy access later.</p>
            </div>
          </div>

        )
      case 'Following':
      case 'Followers':
        return (
          <div className="divide-y divide-foreground/8 main animate-in fade-in duration-300">
            {MOCK_USERS.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-foreground/2 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold truncate text-[15px]">{user.name}</span>
                      {user.verified && <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-background" />}
                    </div>
                    <p className="text-foreground/50 text-sm truncate">{user.handle}</p>
                    <p className="text-foreground/50 text-sm truncate mt-0.5 line-clamp-1">{user.bio}</p>
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
      // case 'Favorites':
      //   return (
      //     <div className="flex flex-col bg-card animate-in fade-in duration-300">
      //       {posts.filter(p => p.id === user.id).length > 0 ? (
      //         posts.filter(p => p.id === user.id).map(post => (
      //           <Post 
      //             key={post.id} 
      //             post={post}
      //           />
      //         ))
      //       ) : (
      //         <div className="p-20 text-center space-y-4">
      //           <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
      //             <Star className="w-8 h-8 text-foreground/60" />
      //           </div>
      //           <h3 className="text-xl font-bold">No Favorites Yet</h3>
      //           <p className="text-foreground/50 text-sm max-w-xs mx-auto">When you favorite a post, it will show up here for easy access later.</p>
      //         </div>
      //       )}
      //     </div>
      //   );
      default:
        return (
          <div className="flex flex-col bg-card animate-in fade-in duration-300">
            {posts.filter(p => p.author.id === user.id).map(post => (

              <Post
                key={post.id}
                post={post}
              />
            ))}
            {posts.filter(p => p.author.id === user.id).length === 0 && (
              <div className="p-20 text-center text-foreground/50">No posts yet.</div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen main max-w-full">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 w-full bg-card">
        <Image priority fill src={`${user.cover}`} alt="User Cover" className="w-full h-full object-cover" />
      </div>

      {/* Profile Info Header */}
      <div className="px-4 pb-4">
        <div className="relative flex justify-between items-end">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-border ring-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex space-x-2 mb-2">

            {owner ? (
              <Button onClick={() => { }} className="rounded-full shadow-lg">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" className="rounded-full shadow-lg"
                  onClick={() => useChatStore.getState().openChat(user.id)} >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
                <Button onClick={() => { }} className="rounded-full shadow-lg">
                  <UserPlus className="w-4 h-4" />
                  Follow
                </Button>
              </>
            )}

          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold tracking-tight">{user.name}</h2>
          <p className="text-foreground/50 font-medium">{user.handle}</p>
        </div>
        <div className="mt-5 flex space-x-6">
          <div className="hover:underline cursor-pointer" onClick={() => setActiveTab('Following')}>
            <span className="font-extrabold text-foreground">{user.following}</span>
            <span className="text-foreground/50 ml-1 text-sm font-medium uppercase tracking-wider">Following</span>
          </div>
          <div className="hover:underline cursor-pointer" onClick={() => setActiveTab('Followers')}>
            <span className="font-extrabold text-foreground">{user.followers}</span>
            <span className="text-foreground/50 ml-1 text-sm font-medium uppercase tracking-wider">Followers</span>
          </div>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">{user.bio}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-foreground/50 text-[14px]">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-foreground/60" />
            <span>Works at <span className="text-foreground/90 font-bold">{user.work}</span></span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-foreground/60" />
            <span>Studied at <span className="text-foreground/90 font-bold">{user.education}</span></span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-foreground/60" />
            <span>Lives in <span className="text-foreground/90 font-bold">{user.location}</span></span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="w-4 h-4 mr-2 text-foreground/60" />
            <span className="text-primary hover:underline cursor-pointer font-medium">{user.website}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-foreground/60" />
            <span>Joined {user.joined}</span>
          </div>
        </div>


      </div>

      {/* Tabs */}
      <div className="flex border-b border-border sticky top-0 z-30 glass-header overflow-x-auto no-scrollbar">
        {Tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="flex-1 min-w-[100px] py-4 text-center hover:bg-foreground/5 transition-colors cursor-pointer relative group"
          >
            <span className={activeTab === tab ? "font-bold text-foreground" : "text-foreground/50 font-medium"}>{tab}</span>
            {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full shadow-lg shadow-primary/30" />}
          </div>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="flex flex-col flex-1 min-h-[400px] max-w-full">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
