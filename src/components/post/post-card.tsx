'use client';
import React, { useRef, useState } from 'react';
import { Post as PostType } from '@/types/post';
import { Comment } from '@/types/chat';
import {
  MessageSquare, Heart, CheckCircle2,
  MoreHorizontal, ThumbsUp, Pencil, Trash2, Share2,
  Send, Smile, EyeOff, Globe, Users, Lock, MessageCircle
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '../../lib/utils';
import { CURRENT_USER, INITIAL_POSTS } from '@/lib/constants';
import ShareModal from './ShareModal';
import MediaViewer from './MediaViewer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image';
import { CommentItem } from './comment';
interface PostProps {
  post: PostType;
  hideMedia?: boolean;
}

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-400' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-rose-500' },
  { type: 'haha', emoji: '😆', label: 'Haha', color: 'text-yellow-400' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-400' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-300' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: 'text-orange-600' },
];



const Post: React.FC<PostProps> = ({
  post,
  hideMedia = false,
}) => {
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [forceShowMedia, setForceShowMedia] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)
  const [showEditingDialog, setEditingDialog] = useState(false);
  const [showDeleteDialog, setDeleteDialog] = useState(false);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: { id: 'u2', name: 'Alice Rivera', handle: '@alice', avatar: 'https://picsum.photos/seed/alice/200', verified: true },
      text: 'The modern aesthetic is absolutely stunning. Great work on the interface transitions! 🚀',
      timestamp: '12m',
      likes: 8,
      replies: [
        {
          id: 'c1-r1',
          author: { id: 'u10', name: 'Mark Chen', handle: '@mark_c', avatar: 'https://picsum.photos/seed/mark/200' },
          text: 'Completely agree. The glassmorphism elements are so subtle but effective.',
          timestamp: '5m',
          likes: 2
        }
      ]
    }
  ]);
  const handleUpdatePost = (postId: string, newContent: string) => {
    return;
  };

  const handleDeletePost = (postId: string) => {
    return;
  };

  const handleToggleFavorite = (postId: string) => {
    return;
  };
  const handleReaction = (type: string | null) => {
    if (currentReaction === type) {
      setCurrentReaction(null);
      setLikeCount(prev => prev - 1);
    } else {
      if (!currentReaction) setLikeCount(prev => prev + 1);
      setCurrentReaction(type);
    }
    setShowReactions(false);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: CURRENT_USER as any,
      text: commentText,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleReplyToComment = (parentId: string, text: string) => {
    const newReply: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: CURRENT_USER as any,
      text,
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };
    const addReplyRecursive = (items: Comment[]): Comment[] => {
      return items.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies) {
          return { ...c, replies: addReplyRecursive(c.replies) };
        }
        return c;
      });
    };
    setComments(addReplyRecursive(comments));
  };

  const handleLikeComment = (commentId: string) => {
    const toggleLikeRecursive = (items: Comment[]): Comment[] => {
      return items.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1
          };
        }
        if (c.replies) {
          return { ...c, replies: toggleLikeRecursive(c.replies) };
        }
        return c;
      });
    };
    setComments(toggleLikeRecursive(comments));
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(#\w+|\s+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={i}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   onHashtagClick?.(part.substring(1));
            // }}
            className="text-primary/90 hover:text-primary hover:underline cursor-pointer font-black"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const mediaList = post.images || (post.image ? [post.image] : post.gif ? [post.gif] : []);
  const originalPost = post.sharedPostId ? INITIAL_POSTS.find(p => p.id === post.sharedPostId) : null;


  const activeReaction = REACTIONS.find(r => r.type === currentReaction);

  return (
    <div className="bg-card rounded sm:rounded-2xl mb-5 border border-border/5 overflow-hidden shadow-2xl animate-in fade-in duration-700 hover:border-border/10 transition-all group/post">
      {/* HEADER SECTION */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="relative">
            <Avatar className="w-11 h-11 border border-border/10 ring-2 ring-transparent group-hover/post:ring-primary/10 transition-all cursor-pointer shadow-lg hover:ring-ring">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full shadow-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-[16px] text-foreground hover:text-primary transition-colors cursor-pointer truncate">{post.author.name}</span>
              {post.author.verified && <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-primary-foreground shrink-0" />}
            </div>
            <div className="flex items-center space-x-2 text-primary-foreground-500 text-[11px] font-black uppercase tracking-widest text-foreground/70">
              <span className="transition-colors">1h ago</span>
              <span className="">•</span>
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span className="transition-colors">Public</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setEditingDialog(true)}>
                  <Pencil className="w-4 h-4 text-primary-foreground" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={showEditingDialog} onOpenChange={setEditingDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit post</DialogTitle>
                <DialogDescription>
                  Edit your post
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-3">
                <Field>
                  <FieldLabel htmlFor="content">Content</FieldLabel>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write something..."
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showDeleteDialog} onOpenChange={setDeleteDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Warning</DialogTitle>
                <DialogDescription>
                  Anyone with the link will be able to view this file.
                </DialogDescription>
              </DialogHeader>
              <div className="pb-3">


              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-5 pb-4">
        <p className="text-[16px] leading-[1.6] text-foreground font-medium foregroundspace-pre-wrap selection:bg-primary/40">{renderContent(post.content)}</p>
      </div>

      {/* SHARED POST NESTED BOX */}
      {originalPost && (
        <div className="mx-5 mb-5 rounded-[20px] border border-border overflow-hidden p-5 hover:bg-background/10 cursor-pointer transition-all bg-foreground/1 shadow-inner group/nested">
          <div className="flex items-center space-x-2.5 mb-3">
            <Avatar className="w-6 h-6 shrink-0 ring-1 ring-foreground/10"><AvatarImage src={originalPost.author.avatar} /></Avatar>
            <span className="font-black text-[13px] group-hover/nested:text-primary/40 transition-colors">{originalPost.author.name}</span>
          </div>
          <p className="text-[14px] text-foreground/40 line-clamp-3 leading-relaxed">{originalPost.content}</p>
          {originalPost.image && (
            <div className="mt-4 rounded-xl overflow-hidden shadow-lg border border-border/5">
              <Image width={500} height={500} src={originalPost.image} className="w-full h-48 object-cover group-hover/nested:scale-105 transition-transform duration-1000" alt="nested-media" />
            </div>
          )}
        </div>
      )}

      {/* MEDIA SECTION */}
      {mediaList.length > 0 && (
        <div className="relative border-y border-border/3">
          {hideMedia && !forceShowMedia ? (
            <div
              className="bg-background/60 backdrop-blur-3xl h-72 flex flex-col items-center justify-center space-y-5 p-10 text-center cursor-pointer group/reveal"
              onClick={() => setForceShowMedia(true)}
            >
              <div className="p-5 bg-foreground/5 rounded-full ring-1 ring-foreground/10 group-hover/reveal:scale-110 transition-transform shadow-xl"><EyeOff className="w-8 h-8 text-foreground/70 group-hover/reveal:text-foreground transition-colors" /></div>
              <div className="space-y-1">
                <p className="text-base font-black text-foreground">Sensitive Content</p>
                <p className="text-xs text-foreground/70 font-bold uppercase tracking-widest">Tap to reveal media</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full px-8 h-10 font-black uppercase tracking-widest text-[10px] border-border/10 hover:border-border hover:text-foreground transition-all">Show Media</Button>
            </div>
          ) : (
            <div className={cn("grid gap-0.5 cursor-pointer", mediaList.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
              {mediaList.map((img, i) => (
                <div key={i} onClick={() => {setForceShowMedia(true)}} className="relative overflow-hidden aspect-[16/10] group/media">
                  <Image width={500} height={500} src={img} alt={`Post media ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover/media:opacity-10 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STATS BAR */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-foreground/10 mx-2">
        <div className="flex items-center space-x-2.5 cursor-pointer hover:underline decoration-foreground/50 group/stat">
          <div className="flex -space-x-1.5 items-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-primary/40 flex items-center justify-center border-2 border-border z-20 shadow-md">
              <ThumbsUp className="w-2 h-2 text-white fill-white" />
            </div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-600 to-pink-400 flex items-center justify-center border-2 border-border z-10 shadow-md">
              <Heart className="w-2 h-2 text-white fill-white" />
            </div>
          </div>
          <span className="text-[13px] text-foreground/70 font-black tracking-tight group-hover/stat:text-foreground transition-colors">
            {likeCount.toLocaleString()} <span className="font-bold text-foreground/60 ml-0.5">Reactions</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[13px] text-foreground/70 font-black tracking-tight uppercase tracking-tighter">
          <span className="hover:text-foreground cursor-pointer transition-colors">{post.replies} <span className="text-[10px] text-foreground/70">Comments</span></span>
          <span className="hover:text-foreground cursor-pointer transition-colors">{post.retweets} <span className="text-[10px] text-foreground/70">Shares</span></span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="px-4 py-1.5 flex relative">
        {showReactions && (
          <div
            className="absolute -top-10 left-4 bg-card/60 backdrop-blur-2xl border border-border rounded-full flex items-center shadow-[0_10px_40px_-5px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 z-50 ring-1 ring-ring"
            onMouseLeave={() => setShowReactions(false)}
          >
            {REACTIONS.map((r) => (
              <button
                key={r.type}
                onClick={() => handleReaction(r.type)}
                className="text-3xl hover:scale-[1.65] transition-all p-1.5 duration-300 active:scale-90 hover:-translate-y-2"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        <button
          className="flex-1 flex items-center justify-center space-x-3 py-3 rounded-xl hover:bg-foreground/4 active:bg-foreground/8 transition-all group/action"
          onMouseEnter={() => {
            hoverTimeout.current = setTimeout(() => {
              setShowReactions(true)
            }, 300)
          }}
          onMouseLeave={() => {
            if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
          }}
          onClick={() => handleReaction(currentReaction ? null : 'like')}
        >
          {currentReaction ? (
            <span className={cn("text-[14px] font-black tracking-widest animate-in zoom-in duration-300", activeReaction?.color)}>
              {activeReaction?.emoji} {activeReaction?.label}
            </span>
          ) : (
            <>
              <ThumbsUp className="w-5 h-5 text-foreground/70 group-hover/action:text-primary/40 group-hover/action:scale-110 transition-all" />
              <span className="text-[13px] font-black text-foreground/70 group-hover/action:text-foreground tracking-[0.1em] transition-colors">Like</span>
            </>
          )}
        </button>

        <button
          className="flex-1 flex items-center justify-center space-x-3 py-3 rounded-xl hover:bg-foreground/4 active:bg-foreground/8 transition-all group/action"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-5 h-5 text-foreground/70 group-hover/action:text-primery/50 group-hover/action:scale-110 transition-all" />
          <span className="text-[13px] font-black text-foreground/70 group-hover/action:text-foreground tracking-[0.1em] transition-colors">Comment</span>
        </button>

        <button
          className="flex-1 flex items-center justify-center space-x-3 py-3 rounded-xl hover:bg-foreground/4 active:bg-foreground/8 transition-all group/action"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 className="w-5 h-5 text-foreground/70 group-hover/action:text-primery/50 group-hover/action:scale-110 transition-all" />
          <span className="text-[13px] font-black text-foreground/70 group-hover/action:text-foreground tracking-[0.1em] transition-colors">Share</span>
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="px-5 py-5 space-y-5 border-t border-border animate-in slide-in-from-top-4 duration-300 bg-foreground/4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-9 h-9 shrink-0 ring-1 ring-ring"><AvatarImage src={CURRENT_USER.avatar} /></Avatar>
            <div className="flex-1 relative flex items-center group/input">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="w-full bg-foreground/8 hover:bg-foreground/10 border border-border rounded-full py-2.5 pl-5 pr-14 text-[14px] outline-none text-foreground placeholder-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
              />
              <div className="absolute right-2 flex items-center space-x-1 opacity-60 group-focus-within/input:opacity-100 transition-opacity">
                <button className="p-1.5 text-foreground/70 hover:text-yellow-400 transition-all"><Smile className="w-4.5 h-4.5" /></button>
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="p-1.5 text-primary hover:text-primary/40 transition-all disabled:opacity-1 disabled:scale-75"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={CURRENT_USER}
                onLike={handleLikeComment}
                onReply={handleReplyToComment}
              />

            ))}
          </div>
        </div>
      )}

      {isShareModalOpen && (
        
        <ShareModal
          post={post}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
      {forceShowMedia && (
        <MediaViewer
          images={post.image ? [post.image] : post.images || []}
          startIndex={0}
          onClose={() => setForceShowMedia(false)}
        />
      )}
    </div>
  );
};

export default Post;
