

import { NOTIFICATIONS_MOCK } from '@/lib/constants';
import { Heart, Repeat, UserPlus, AtSign, Settings, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const NotificationsPage  = () => {


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-30 bg-black/70 backdrop-blur-md border-b border-[#2f3336]">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Notifications</h1>
          <Settings className="w-5 h-5 text-[#e7e9ea] cursor-pointer" />
        </div>
        <div className="flex text-center">
          {['All', 'Verified', 'Mentions'].map((tab, idx) => (
            <div key={tab} className="flex-1 py-4 font-bold hover:bg-[#181818] transition-colors cursor-pointer relative">
              <span className={idx === 0 ? "text-white" : "text-[#71767b]"}>{tab}</span>
              {idx === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#1d9bf0] rounded-full" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {NOTIFICATIONS_MOCK.map((notif) => (
          <div key={notif.id} className="p-4 hover:bg-[#080808] transition-colors cursor-pointer flex space-x-3">
            <div className="pt-1">
              {notif.type === 'like' && <Heart className="w-8 h-8 fill-[#f91880] text-[#f91880]" />}
              {notif.type === 'repost' && <Repeat className="w-8 h-8 text-[#00ba7c]" />}
              {notif.type === 'follow' && <UserPlus className="w-8 h-8 fill-[#1d9bf0] text-[#1d9bf0]" />}
              {notif.type === 'mention' && <AtSign className="w-8 h-8 text-[#1d9bf0]" />}
            </div>
            <div className="flex-1">
              <Avatar className="w-8 h-8 mb-2">
                <AvatarImage src={notif.user.avatar} />
                <AvatarFallback>{notif.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-[15px]">
                <span className="font-bold mr-1">{notif.user.name}</span>
                {notif.user.verified && <CheckCircle2 className="w-4 h-4 fill-[#1d9bf0] text-black inline mx-1" />}
                <span className="text-[#e7e9ea]">{notif.content}</span>
              </div>
              <p className="text-[#71767b] text-sm mt-1">{notif.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
