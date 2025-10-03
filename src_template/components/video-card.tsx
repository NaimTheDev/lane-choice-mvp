
'use client';

import type { VideoPost, Comment as CommentType, User } from '@/lib/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { useAuth } from './auth-provider';

// NOTE: A more robust implementation would move Comment to its own file.
// For now, it's included here to parallel the structure of PostCard.
type CommentProps = {
  comment: CommentType;
  onReply: (replyText: string, parentCommentId: string) => void;
  isReply?: boolean;
};

const Comment = ({ comment, onReply, isReply = false }: CommentProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { appUser } = useAuth();

  const handleReplySubmit = () => {
    if (replyText.trim() && appUser) {
      onReply(replyText, comment.id);
      setReplyText('');
      setShowReplyInput(false);
    }
  };
  
  const getTimestamp = () => {
    if (comment.timestamp instanceof Date) {
      return formatDistanceToNow(comment.timestamp, { addSuffix: true });
    }
    const ts = comment.timestamp as any;
    if (ts && typeof ts.toDate === 'function') {
        return formatDistanceToNow(ts.toDate(), { addSuffix: true });
    }
    return String(comment.timestamp);
  }

  return (
    <div className="flex gap-3">
      <Avatar className={isReply ? "h-6 w-6" : "h-8 w-8"}>
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">@{comment.author.handle}</span>
          </div>
          <p className="text-sm">{comment.text}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{getTimestamp()}</span>
          <button className="font-semibold hover:underline" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</button>
        </div>

        {showReplyInput && appUser && (
            <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={appUser.avatarUrl} alt={appUser.name} />
                    <AvatarFallback>{appUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Input 
                  placeholder={`Replying to @${comment.author.handle}...`} 
                  className="h-9" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                />
                <Button size="sm" onClick={handleReplySubmit}>Reply</Button>
            </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map(reply => (
              <Comment key={reply.id} comment={reply} onReply={onReply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export function VideoCard({ post }: { post: VideoPost }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const { appUser } = useAuth();


  const getTimestamp = () => {
    const ts = post.createdAt as any;
    if (ts && typeof ts.toDate === 'function') {
      return formatDistanceToNow(ts.toDate(), { addSuffix: true });
    }
    return post.timestamp || '';
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
  }

  const handleCommentSubmit = () => {
     if (!newComment.trim() || !appUser) return;

     const comment: CommentType = {
        id: `c${Date.now()}`,
        author: appUser as User, // Cast because we know appUser is not null here
        text: newComment,
        timestamp: new Date(),
        replies: [],
     } as CommentType;

     setComments(prev => [...prev, comment]);
     setNewComment('');
  }
  
  const handleReply = (replyText: string, parentCommentId: string) => {
    // This is a simplified, non-persistent reply for demonstration.
    // A real implementation would update the database.
     if (!appUser) return;
     const newReply: CommentType = {
        id: `r${Date.now()}`,
        author: appUser as User,
        text: replyText,
        timestamp: new Date(),
        replies: []
     } as CommentType;

     setComments(prevComments => 
        prevComments.map(comment => {
            if (comment.id === parentCommentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            return comment;
        })
     );
  }

  return (
    <Card>
      <CardHeader>
         <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base">{post.title}</CardTitle>
                <CardDescription className="text-xs">
                    @{post.author.handle} &middot; {getTimestamp()}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer group"
          onClick={handleVideoClick}
        >
            <video
                src={post.videoUrl}
                poster={post.thumbnailUrl}
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                loop
            />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:opacity-100 md:opacity-0">
                    <PlayCircle className="h-16 w-16 text-white/80" />
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 pt-4 mt-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4" /> {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="h-4 w-4" /> {comments.length}
        </Button>
      </CardFooter>
      {showComments && (
          <div className="px-6 pb-4">
            <Separator className="mb-4" />
             {appUser && <div className="mt-4 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={appUser.avatarUrl} alt={appUser.name} />
                <AvatarFallback>{appUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
               <Button onClick={handleCommentSubmit}>Post</Button>
            </div>}
            <div className="space-y-4 mt-4">
              {comments.length > 0 ? (
                comments.map((comment) => <Comment key={comment.id} comment={comment} onReply={handleReply} />)
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        )}
    </Card>
  );
}
