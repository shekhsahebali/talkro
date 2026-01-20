'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CURRENT_USER, MOCK_USERS } from '@/lib/constants';
import {
  Heart, MessageSquare, Repeat, Share, MoreHorizontal, CheckCircle2,
  Music2, Loader2, Send, Bookmark, UserPlus, UserCheck, X, Flag,
  Ban, UserMinus, Link as LinkIcon, Copy, Check, Smile
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Comment as CommentType } from '@/types/chat';
import Image from 'next/image';

const REEL_DATA = [
  {
    id: 'r1',
    author: {
      id: 'u10',
      name: 'Cinematic AI',
      handle: '@cine_ai',
      avatar: 'https://picsum.photos/seed/cine/200',
      verified: true,
    },
    videoUrl: 'https://picsum.photos/seed/reel1/1080/1920',
    caption: 'The future of video generation is here. Generated entirely with neural networks. #AI #Future',
    likesCount: 45200,
    repliesCount: 1200,
    repostsCount: 8400,
    isLiked: false,
    isFollowing: false,
  }
];

interface ReelItemProps {
  reel: any;
  onLike: (id: string) => void;
  onFollow: (id: string) => void;
}

const ReelCommentItem: React.FC<{
  comment: CommentType;
  onReply: (parentId: string, authorName: string) => void;
  onLike: (id: string) => void;
}> = ({ comment, onReply, onLike }) => {
  return (
    <div className="flex flex-col space-y-3 group/comment animate-in fade-in slide-in-from-left-2 duration-300 max-w-full">
      <div className="flex space-x-3 items-start">
        <Avatar className="w-8 h-8 shrink-0 border border-white/5">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback className="bg-neutral-800 text-[10px] font-bold">{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-foreground hover:underline cursor-pointer">{comment.author.name}</span>
            {comment.author.verified && <CheckCircle2 className="w-3 h-3 fill-primary/50 text-black" />}
            <span className="text-[10px] text-foreground/60 font-bold uppercase tracking-tighter">{comment.timestamp}</span>
          </div>
          <p className="text-[14px] text-foreground/80 leading-snug">{comment.text}</p>
          <div className="flex items-center space-x-4 pt-1">
            <button
              onClick={() => onReply(comment.id, comment.author.name)}
              className="text-[11px] font-black text-foreground/60 hover:text-foreground uppercase tracking-widest transition-colors"
            >
              Reply
            </button>
            <button
              onClick={() => onLike(comment.id)}
              className={cn(
                "flex items-center space-x-1 text-[11px] font-black uppercase tracking-widest transition-colors",
                comment.isLiked ? "text-rose-500" : "text-foreground/60 hover:text-rose-400"
              )}
            >
              <Heart className={cn("w-3 h-3", comment.isLiked && "fill-current")} />
              <span>{comment.likes}</span>
            </button>
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-4 pt-2 border-l border-border pl-4">
          {comment.replies.map(reply => (
            <div key={reply.id} className="flex space-x-3 items-start">
              <Avatar className="w-6 h-6 shrink-0">
                <AvatarImage src={reply.author.avatar} />
                <AvatarFallback className="bg-foreground text-[8px] font-bold">{reply.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[13px] text-foreground hover:underline cursor-pointer">{reply.author.name}</span>
                  <span className="text-[9px] text-foreground/60 uppercase font-bold">{reply.timestamp}</span>
                </div>
                <p className="text-[13px] text-foreground/80 leading-snug">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReelItem: React.FC<ReelItemProps> = ({ reel, onLike, onFollow }) => {
  const [showComments, setShowComments] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [comments, setComments] = useState<CommentType[]>([
    {
      id: '1',
      author: { id: 'u2', name: 'Alex Rivera', handle: '@alex', avatar: 'https://picsum.photos/seed/alex/200', verified: true },
      text: 'This AI is getting out of hand! 😲 I can barely tell it is artificial.',
      timestamp: '2h',
      likes: 124,
      replies: [
        { id: '1-1', author: { id: 'u5', name: 'Dev Team', handle: '@dev', avatar: 'https://picsum.photos/seed/dev/200' }, text: 'Wait until you see the next update!', timestamp: '1h', likes: 10 }
      ]
    },
    {
      id: '2',
      author: { id: 'u10', name: 'Sarah Chen', handle: '@sarah', avatar: 'https://picsum.photos/seed/sarah/200' },
      text: 'The cinematic lighting is incredible. Which engine was this?',
      timestamp: '5h',
      likes: 45
    }
  ]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: CommentType = {
      id: Date.now().toString(),
      author: CURRENT_USER as any,
      text: replyTo ? `@${replyTo.name} ${commentText}` : commentText,
      timestamp: 'Just now',
      likes: 0
    };

    if (replyTo) {
      setComments(prev => prev.map(c => {
        if (c.id === replyTo.id) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        return c;
      }));
    } else {
      setComments([newComment, ...comments]);
    }

    setCommentText('');
    setReplyTo(null);
  };

  const handleLikeComment = (id: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 };
      }
      return c;
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://nexushub.com/reels/${reel.id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-full w-full snap-start relative flex flex-col lg:flex-row items-stretch justify-center overflow-hidden bg-background">
      {/* Media Content */}
      <div className="flex-1 relative bg-background flex items-center justify-center overflow-hidden">
        <div className="relative h-full aspect-[9/16] bg-background shadow-2xl max-w-full">
          <Image width={1080} height={1920} src={reel.videoUrl} alt="Reel media" className="h-full w-full object-cover" />
          <div className="lg:hidden absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/10 to-transparent pointer-events-none" />
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />

          {/* Mobile Interaction Bar */}
          <div className="lg:hidden absolute right-3 bottom-24 flex flex-col items-center space-y-6 z-20">
            <InteractionButton
              icon={<Heart className={cn("w-7 h-7", reel.isLiked && "fill-rose-500")} />}
              label={reel.likesCount >= 1000 ? (reel.likesCount / 1000).toFixed(1) + 'K' : reel.likesCount}
              active={reel.isLiked}
              onClick={() => onLike(reel.id)}
            />
            <InteractionButton
              icon={<MessageSquare className="w-7 h-7 text-white" />}
              label={comments.length}
              onClick={() => setShowComments(true)}
            />
            <InteractionButton
              icon={<Send className="w-7 h-7 text-white" />}
              label="Share"
              onClick={() => setShowShareMenu(true)}
            />
            <div
              onClick={() => setShowMoreMenu(true)}
              className="p-3 rounded-full bg-background/20 backdrop-blur-md hover:bg-foreground/10 cursor-pointer border border-border/5 active:scale-90 transition-transform shadow-xl"
            >
              <MoreHorizontal className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="md:hidden absolute bottom-6 left-4 right-16 z-20">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-10 h-10 border-2 border-white/20 ring-2 ring-black">
                <AvatarImage src={reel.author.avatar} />
                <AvatarFallback>{reel.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-white text-[15px]">{reel.author.name}</span>
                  {reel.author.verified && <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-white" />}
                </div>
                <span className="text-white/60 text-xs font-medium">{reel.author.handle}</span>
              </div>
              <Button
                onClick={() => onFollow(reel.id)}
                variant={reel.isFollowing ? "outline" : "secondary"}
                size="sm"
                className={cn("h-8 px-4 font-bold ml-2 rounded-xl", reel.isFollowing ? "bg-white/10 text-white border-white/20" : "bg-white text-black")}
              >
                {reel.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
            <p className="text-white text-[15px] mb-3 line-clamp-2 leading-snug font-medium pr-10">
              {renderCaption(reel.caption)}
            </p>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-2 border border-white/5">
                <Music2 className="w-3.5 h-3.5 animate-bounce" />
                <span className="text-xs font-bold tracking-tight">Original Audio • {reel.author.handle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[420px] bg-card border-l border-border flex-col animate-in slide-in-from-right-4 duration-500">
        <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 border border-border/10 ring-2 ring-primary/50/10">
                <AvatarImage src={reel.author.avatar} />
                <AvatarFallback>{reel.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="font-black text-foreground text-[16px]">{reel.author.name}</span>
                  {reel.author.verified && <CheckCircle2 className="w-4 h-4 fill-primary/50 text-black" />}
                </div>
                <span className="text-neutral-500 text-sm font-bold">{reel.author.handle}</span>
              </div>
            </div>
            <Button onClick={() => onFollow(reel.id)} variant={reel.isFollowing ? "outline" : "default"} className="rounded-2xl px-6 font-black h-10">{reel.isFollowing ? 'Following' : 'Follow'}</Button>
          </div>
          <Separator className="bg-white/5" />
          <p className="text-[15px] leading-relaxed text-foreground">{renderCaption(reel.caption)}</p>

          <div className="grid grid-cols-5 gap-3 pt-4">
            <SidebarInteractionButton
              icon={<Heart className={cn("w-6 h-6", reel.isLiked && "fill-rose-500")} />}
              label={reel.likesCount.toLocaleString()}
              active={reel.isLiked}
              onClick={() => onLike(reel.id)}
              colorClass="hover:text-rose-500 hover:bg-rose-500/10"
            />
            <SidebarInteractionButton
              icon={<MessageSquare className="w-6 h-6" />}
              label={comments.length.toString()}
              colorClass="hover:text-primary/50 hover:bg-primary/50/10"
            />
            <SidebarInteractionButton
              icon={<Repeat className="w-6 h-6" />}
              label={reel.repostsCount.toLocaleString()}
              colorClass="hover:text-emerald-500 hover:bg-emerald-500/10"
            />
            <SidebarInteractionButton
              icon={<Bookmark className={cn("w-6 h-6", isSaved && "fill-amber-500")} />}
              label="Save"
              active={isSaved}
              onClick={() => setIsSaved(!isSaved)}
              colorClass="hover:text-amber-500 hover:bg-amber-500/10"
            />
            {/* Functional Share Button for Desktop */}
            <SidebarInteractionButton
              icon={<Send className="w-6 h-6" />}
              label="Share"
              onClick={() => setShowShareMenu(true)}
              colorClass="hover:text-primary/50 hover:bg-primary/50/10"
            />
          </div>
          <Separator className="bg-white/5" />
          <div className="space-y-6">
            <h3 className="text-xs font-black text-foreground/85 uppercase tracking-[0.2em] px-1">Comments</h3>
            <div className="space-y-6">
              {comments.map(c => (
                <ReelCommentItem key={c.id} comment={c} onReply={(id, name) => { setReplyTo({ id, name }); setShowComments(true); }} onLike={handleLikeComment} />
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border bg-background/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3 bg-foreground/5 p-1 rounded-full border border-border pr-2 focus-within:border-primary/50/50 transition-all">
            <Avatar className="w-10 h-10 ml-0.5"><AvatarImage src={CURRENT_USER.avatar} /></Avatar>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Add comment..."}
              className="flex-1 bg-transparent border-none py-2 px-2 text-sm outline-none placeholder-foreground/60 font-medium"
            />
            <Button onClick={handleAddComment} disabled={!commentText.trim()} className="h-9 px-6 rounded-full font-black text-xs">Post</Button>
          </div>
        </div>
      </div>

      {/* MOBILE COMMENTS BOTTOM SHEET */}
      {showComments && (
        <div className="lg:hidden fixed inset-0 z-[120] bg-card/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-x-0 bottom-0 h-[75%] bg-card rounded-t-[32px] border-t border-border flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-foen text-foreground text-lg tracking-tight">Comments</h3>
                <span className="bg-foreground/10 text-foreground text-[10px] font-black px-2 py-0.5 rounded-full">{comments.length}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowComments(false)} className="rounded-full hover:bg-foreground/10">
                <X className="w-5 h-5 text-foreground/40" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
              {comments.map((c) => (
                <ReelCommentItem key={c.id} comment={c} onReply={(id, name) => setReplyTo({ id, name })} onLike={handleLikeComment} />
              ))}
            </div>
            <div className="p-4 pb-8 border-t border-border bg-card/50 backdrop-blur-sm glass-header">
              {replyTo && (
                <div className="flex items-center justify-between mb-3 px-3 py-1.5 bg-primary/50/10 rounded-xl border border-primary/50/20 animate-in slide-in-from-bottom-2">
                  <p className="text-[11px] font-bold text-primary/50 truncate">Replying to <span className="font-black">@{replyTo.name}</span></p>
                  <button onClick={() => setReplyTo(null)} className="text-primary/50"><X className="w-3 h-3" /></button>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 ring-2 ring-border"><AvatarImage src={CURRENT_USER.avatar} /></Avatar>
                <div className="flex-1 relative flex items-center">
                  <input
                    autoFocus={!!replyTo}
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder={replyTo ? "Write your reply..." : "Add a comment..."}
                    className="w-full bg-foreground/5 border border-border rounded-full py-3 pl-5 pr-14 text-sm font-medium outline-none focus:border-primary/50 transition-all shadow-inner"
                  />
                  <Button onClick={handleAddComment} disabled={!commentText.trim()} variant="ghost" size="sm" className="absolute right-2 text-primary/50 font-black uppercase tracking-widest text-[10px] hover:bg-transparent">Send</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MENU MODAL (DESKTOP & MOBILE) */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-4"
          onClick={() => setShowShareMenu(false)}
        >
          <div
            className="w-full max-w-[500px] bg-[#161616] rounded-[40px] border border-white/10 flex flex-col animate-in zoom-in-95 duration-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight">Share Reel</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowShareMenu(false)} className="rounded-full"><X className="w-5 h-5 text-neutral-400" /></Button>
            </div>

            <div className="px-6 py-4">
              <div className="relative">
                <X className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  placeholder="Send to friends..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-1 focus:ring-primary/50/50 transition-all"
                />
              </div>
            </div>

            <div className="px-6 py-4 overflow-x-auto no-scrollbar flex space-x-6">
              {MOCK_USERS.slice(0, 10).map(user => (
                <div key={user.id} className="flex flex-col items-center space-y-2 shrink-0 group cursor-pointer" onClick={() => setShowShareMenu(false)}>
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-2 ring-transparent group-active:ring-primary/50 transition-all">
                      <AvatarImage src={user.avatar} />
                    </Avatar>
                    <div className="absolute bottom-1 right-1 p-1 bg-primary/50 rounded-full border-2 border-[#161616]">
                      <Send className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-neutral-400 truncate max-w-[64px] text-center">{user.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 px-6 pb-10 border-t border-white/5 pt-8">
              <ShareAction icon={<Copy className="w-6 h-6" />} label={isCopied ? "Copied" : "Copy Link"} onClick={copyToClipboard} />
              <ShareAction icon={<Repeat className="w-6 h-6" />} label="Repost" />
              <ShareAction icon={<Share className="w-6 h-6" />} label="External" />
              <ShareAction icon={<Bookmark className="w-6 h-6" />} label="Save" />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MORE MENU */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMoreMenu(false)}>
          <div className="absolute inset-x-0 bottom-0 p-4 pb-12 bg-[#1c1c1c] rounded-t-[32px] border-t border-white/10 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-6" />
            <div className="space-y-1">
              <MoreMenuRow icon={<UserMinus className="w-5 h-5 text-rose-500" />} label={`Not interested in creator`} />
              <MoreMenuRow icon={<Ban className="w-5 h-5 text-rose-500" />} label={`Block user`} />
              <MoreMenuRow icon={<Flag className="w-5 h-5 text-rose-500" />} label="Report Content" />
            </div>
            <Button variant="ghost" onClick={() => setShowMoreMenu(false)} className="w-full h-14 mt-4 rounded-2xl font-black text-neutral-500">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ShareAction = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-2 group transition-transform active:scale-95">
    <div className="p-4 bg-white/5 rounded-[24px] border border-white/5 group-hover:bg-white/10 text-neutral-400 group-hover:text-white transition-all">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-tighter text-neutral-500 group-hover:text-white">{label}</span>
  </button>
);

const MoreMenuRow = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center space-x-4 p-5 hover:bg-white/[0.05] rounded-2xl transition-all group">
    <div className="p-2.5 bg-neutral-800 rounded-xl group-hover:bg-neutral-700 transition-colors text-neutral-400">{icon}</div>
    <span className="text-[15px] font-bold text-neutral-200">{label}</span>
  </button>
);

const InteractionButton = ({ icon, label, active, onClick }: any) => (
  <div className="flex flex-col items-center group cursor-pointer" onClick={onClick}>
    <div className={cn("p-3 rounded-full bg-black/20 backdrop-blur-md group-hover:scale-110 transition-all border border-white/5 shadow-xl", active ? "text-rose-500 border-rose-500/30" : "text-white")}>
      {icon}
    </div>
    {label && <span className="text-[11px] font-black mt-1.5 text-white uppercase tracking-tighter drop-shadow-md">{label}</span>}
  </div>
);

const SidebarInteractionButton = ({ icon, label, active, onClick, colorClass }: any) => (
  <button onClick={onClick} className={cn("flex flex-col items-center justify-center p-3 rounded-2xl transition-all space-y-1.5 group bg-white/[0.03] border border-white/5 min-w-[64px]", active ? "bg-white/10" : "", colorClass)}>
    <div className={cn("transition-transform group-active:scale-90", active ? "" : "text-neutral-500 group-hover:text-inherit")}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full", className)} />
);

const renderCaption = (text: string) => {
  return text.split(/(#\w+)/g).map((part, i) =>
    part.startsWith('#') ? <span key={i} className="text-primary/50 font-black hover:underline cursor-pointer">{part}</span> : part
  );
};

const ReelsFeed: React.FC = () => {
  const [reels, setReels] = useState(REEL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const generateMoreReels = useCallback(() => {
    return Array.from({ length: 3 }).map((_, i) => ({
      id: `r-more-${reels.length + i}-${Date.now()}`,
      author: {
        id: `u-reel-${reels.length + i}`,
        name: `Creator ${reels.length + i + 1}`,
        handle: `@creator_${reels.length + i + 1}`,
        avatar: `https://picsum.photos/seed/creator${reels.length + i}/200`,
        verified: Math.random() > 0.5,
      },
      videoUrl: `https://picsum.photos/seed/reelimg${reels.length + i}-${Date.now()}/1080/1920`,
      caption: `Discovering more seamless content! Reel #${reels.length + i + 1} automatically loaded. #InfiniteScroll #MobileUX #Nexus`,
      likesCount: Math.floor(Math.random() * 50000),
      repliesCount: Math.floor(Math.random() * 500),
      repostsCount: Math.floor(Math.random() * 1000),
      isLiked: false,
      isFollowing: false,
    }));
  }, [reels.length]);

  const handleLike = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, isLiked: !r.isLiked, likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1 } : r));
  };

  const handleFollow = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, isFollowing: !r.isFollowing } : r));
  };

  // Infinite Scroll Trigger
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '400px', // Trigger earlier to load ahead of user
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true);
        // Load more data
        setTimeout(() => {
          setReels((prev) => [...prev, ...generateMoreReels()]);
          setIsLoading(false);
        }, 500);
      }
    }, options);

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, generateMoreReels]);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} onLike={handleLike} onFollow={handleFollow} />
      ))}

      {/* 
          MODIFIED SENTINEL: 
          Removed 'snap-start' so the browser doesn't try to snap the scroll position 
          to the loader, which was causing the "automatic scroll" jump.
      */}
      <div className="w-full bg-black">
        {/* Invisible high-trigger point */}
        <div ref={sentinelRef} className="h-10 w-full" />

        {/* Visible Loading Indicator (Non-snapping) */}
        <div className="h-40 w-full flex items-center justify-center opacity-60">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary/50 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Curating more reels...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsFeed;
