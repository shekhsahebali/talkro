'use client';

import { CURRENT_USER } from '@/lib/constants';
import {
    Home, Search, Bell, Mail, Users, User, PlaySquare,
    Hash, Settings as SettingsIcon, BarChart3, Feather, MoreHorizontal, Plus,
    Sparkles
} from 'lucide-react';

import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
    { icon: <Home className="w-7 h-7" />, label: 'Home', id: '/' },
    { icon: <PlaySquare className="w-7 h-7" />, label: 'Reels', id: '/reels' },
    { icon: <Search className="w-7 h-7" />, label: 'Explore', id: '/explore' },
    { icon: <Users className="w-7 h-7" />, label: 'Communities', id: '/communities' },
    { icon: <Bell className="w-7 h-7" />, label: 'Notifications', id: '/notifications' },
    { icon: <Mail className="w-7 h-7" />, label: 'Messages', id: '/messages' },
    { icon: <BarChart3 className="w-7 h-7" />, label: 'Creator', id: '/creator-studio' },
    { icon: <User className="w-7 h-7" />, label: 'Profile', id: '/u' },
    { icon: <SettingsIcon className="w-7 h-7" />, label: 'Settings', id: '/settings' },
];
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import FloatingChat from '../message/FloatingChat';
import { useState } from 'react';
import { ChatState } from '@/types/chat';

const LeftSidebar = () => {

    const router = useRouter();
    const pathname = usePathname();

    const onPageChange = (page: string) => {
        router.push(`${page}`);
    };


    return (
        <aside className="sticky left-0 top-0 h-screen hidden sm:flex flex-col justify-between py-4 px-2 xl:px-8 w-20 xl:w-[280px] border-r border-border bg-sidebar z-50">
            <div className="flex flex-col items-center xl:items-start">
                {/* Logo */}
                <div
                    onClick={() => onPageChange('/')}
                    className="p-3 mb-6 w-fit hover:bg-foreground/[0.08] rounded-2xl transition-all cursor-pointer group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-8 h-8 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                        <circle cx="12" cy="12" r="1" />
                        <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
                        <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
                    </svg>

                </div>

                {/* Navigation */}
                <nav className="w-full space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className="flex items-center group cursor-pointer"
                        >
                            <div className={cn(
                                "flex items-center p-3.5 rounded-2xl transition-all w-fit xl:w-full relative",
                                pathname === item.id ? " text-foreground bg-primary" : "text-secondary-foreground hover:bg-secondary"
                            )}>
                                <span className={cn(
                                    "shrink-0 transition-transform group-hover:scale-110",
                                    pathname === item.id ? "text-background" : "",
                                    item.id === 'creator-studio' && "text-purple-500"
                                )}>
                                    {item.icon}
                                </span>
                                <span className={cn(
                                    "hidden xl:block ml-4 text-[17px] font-bold tracking-tight",
                                    pathname === item.id ? "text-foreground" : ""
                                )}>
                                    {item.label}
                                </span>
                                {item.id === 'creator-studio' && (
                                    <div className="absolute top-2 right-4 hidden xl:block">
                                        <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="pt-6 w-full px-2 xl:px-0">
                        <Button onClick={() => onPageChange('/post/create')} 
                        className="w-12 h-12 xl:w-full xl:h-14 rounded-full shadow-xl shadow-primary/10 cursor-pointer" size="lg">
                            <Feather className="xl:hidden w-6 h-6 shrink-0" />
                            <span className="hidden xl:block font-bold">Create Post</span>
                        </Button>
                    </div>
                </nav>
            </div>

            {/* User Profile Footer */}
            <div
                onClick={() => onPageChange('profile')}
                className="flex items-center p-3 hover:bg-foreground/8 rounded-2xl transition-all cursor-pointer justify-between mb-4 group border border-transparent hover:border-border mx-1"
            >
                <div className="flex items-center min-w-0">
                    <Avatar className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                        <AvatarImage src={CURRENT_USER.avatar} />
                        <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block ml-3 overflow-hidden">
                        <p className="font-bold text-[14px] truncate text-foreground tracking-tight">{CURRENT_USER.name}</p>
                        <p className="text-foreground/50 text-[12px] truncate font-medium">{CURRENT_USER.handle}</p>
                    </div>
                </div>
                <MoreHorizontal className="hidden xl:block w-4 h-4 text-foreground/50" />
            </div>
             

        </aside>
    );
};

export default LeftSidebar;


export const MobileNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const onPageChange = (page: string) => {
        router.push(`${page}`);
    };
    return (
        <nav className="bg-card sm:hidden fixed bottom-0 left-0 right-0 glass-header border-t border-border flex justify-around py-4 z-50">
            <Home className={cn("w-6 h-6", pathname === '/' ? "text-primary" : "text-foreground/50")} onClick={() => onPageChange('/')} />
            <Search className={cn("w-6 h-6", pathname === '/explore' ? "text-primary" : "text-foreground/50")} onClick={() => onPageChange('/explore')} />
            <PlaySquare className={cn("w-6 h-6", pathname === '/reels' ? "text-primary" : "text-foreground/50")} onClick={() => onPageChange('/reels')} />
            <Users className={cn("w-6 h-6", pathname === '/communities' ? "text-primary" : "text-foreground/50")} onClick={() => onPageChange('/communities')} />
            <User className={cn("w-6 h-6", pathname === '/u' ? "text-primary" : "text-foreground/50")} onClick={() => onPageChange('/profile')} />
        </nav>
    )
}