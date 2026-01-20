

import { Comment } from '@/types/chat';
import {
CheckCircle2, Send
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';





const CommentItem: React.FC<{
    comment: Comment;
    onReply: (parentCommentId: string, text: string) => void;
    onLike: (commentId: string) => void;
    depth?: number;
  }> = ({ comment, onReply, onLike, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className={cn("group/comment relative mt-4", depth > 0 && "ml-10")}>
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8 shrink-0 ring-1 ring-white/10">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-white/5 hover:bg-white/[0.08] transition-colors rounded-[20px] px-4 py-3 inline-block max-w-full relative shadow-sm border border-white/5">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="font-bold text-[13px] text-white hover:underline cursor-pointer">{comment.author.name}</span>
              {comment.author.verified && <CheckCircle2 className="w-3 h-3 fill-sky-500 text-black shrink-0" />}
            </div>
            <p className="text-[14px] leading-relaxed text-neutral-200 whitespace-pre-wrap">{comment.text}</p>

            {comment.likes > 0 && (
              <div className="absolute -bottom-2.5 right-2 bg-neutral-800 border border-white/10 rounded-full px-2 py-0.5 flex items-center space-x-1 shadow-lg ring-1 ring-black/50">
                <span className="text-[10px]">👍</span>
                <span className="text-[10px] font-black text-neutral-300">{comment.likes}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-1.5 ml-3">
            <button
              onClick={() => onLike(comment.id)}
              className={cn(
                "text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95",
                comment.isLiked ? "text-sky-400" : "text-neutral-500 hover:text-white"
              )}
            >
              Like
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-white"
            >
              Reply
            </button>
            <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">{comment.timestamp}</span>
          </div>

          {isReplying && (
            <div className="mt-4 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300">
              <Avatar className="w-7 h-7 shrink-0 ring-1 ring-white/10"><AvatarImage src={CURRENT_USER.avatar} /></Avatar>
              <div className="flex-1 relative flex items-center">
                <input
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  placeholder={`Reply to ${comment.author.name.split(' ')[0]}...`}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-xs outline-none focus:border-sky-500/30 transition-all placeholder-neutral-600"
                />
                <button onClick={handleSendReply} className="absolute right-3 text-sky-500 hover:text-sky-400 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};