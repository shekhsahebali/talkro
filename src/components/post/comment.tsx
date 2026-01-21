'use client';

import { useState } from 'react';
import { Comment as CommentType } from '@/types/chat';
import { CheckCircle2, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentType;
  depth?: number;
  currentUser: {
    name: string;
    avatar?: string;
  };
  onLike: (id: string) => void;
  onReply: (parentId: string, text: string) => void;
}

export const CommentItem = ({
  comment,
  depth = 0,
  currentUser,
  onLike,
  onReply,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText.trim());
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className={cn('max-h-[500px] flex flex-col space-y-0 overflow-auto group/comment relative mt-4', depth > 0 && 'ml-10')}>
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8 shrink-0 ring-1 ring-ring">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-card transition-colors rounded-[20px] px-4 py-3 inline-block max-w-full relative shadow-sm border border-border">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="font-bold text-[13px] text-foreground hover:underline cursor-pointer">
                {comment.author.name}
              </span>
              {comment.author.verified && (
                <CheckCircle2 className="w-3 h-3 fill-primary text-white shrink-0" />
              )}
            </div>

            <p className="text-[14px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {comment.text}
            </p>

            {comment.likes > 0 && (
              <div className="absolute -bottom-2.5 right-2 bg-card border border-border rounded-full px-2 py-0.5 flex items-center space-x-1 shadow-lg">
                <span className="text-[10px]">👍</span>
                <span className="text-[10px] font-black text-foreground">
                  {comment.likes}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-1.5 ml-3">
            <button
              onClick={() => onLike(comment.id)}
              className={cn(
                'text-[11px] font-black uppercase tracking-widest transition-all',
                comment.isLiked
                  ? 'text-primary hover:text-primary/80'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              Like
            </button>

            <button
              onClick={() => setIsReplying((v) => !v)}
              className="text-[11px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground"
            >
              Reply
            </button>

            <span className="text-[10px] text-foreground/60 font-bold uppercase tracking-widest">
              {comment.timestamp}
            </span>
          </div>

          {isReplying && (
            <div className="mt-4 flex items-center space-x-2">
              <Avatar className="w-7 h-7 shrink-0 ring-1 ring-ring">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 relative">
                <input
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSendReply()
                  }
                  placeholder={`Reply to ${comment.author.name.split(' ')[0]}...`}
                  className="w-full bg-foreground/20 border border-border rounded-full py-2 pl-4 pr-10 text-xs outline-none focus:border-primary/30 placeholder-foreground/50"
                />

                <button
                  onClick={handleSendReply}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentUser={currentUser}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
