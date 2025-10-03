
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Post, Comment as CommentType } from '@/lib/types';
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
import { ThumbsUp, MessageCircle, Send, Wrench } from 'lucide-react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';


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
    // It's a Firestore Timestamp
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


export function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const { appUser } = useAuth();
  
  const hasLiked = appUser ? post.likedBy?.includes(appUser.id) : false;

  const handleLike = async () => {
    if (!appUser) return;
    const postRef = doc(db, 'posts', post.id);

    if (hasLiked) {
      await updateDoc(postRef, {
        likes: post.likes - 1,
        likedBy: arrayRemove(appUser.id)
      });
    } else {
      await updateDoc(postRef, {
        likes: post.likes + 1,
        likedBy: arrayUnion(appUser.id)
      });
      // Create notification only if not liking your own post
      if (post.author.id !== appUser.id && post.authorRef) {
          const notificationsRef = collection(db, 'notifications');
          await addDoc(notificationsRef, {
              recipientRef: post.authorRef,
              senderName: appUser.name,
              senderAvatarUrl: appUser.avatarUrl,
              type: 'like',
              postRef: doc(db, 'posts', post.id),
              read: false,
              createdAt: serverTimestamp(),
          });
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !appUser || !post.authorRef) return;
    
    const postRef = doc(db, 'posts', post.id);
    const comment: Omit<CommentType, 'id' | 'replies'> = {
        author: {
            id: appUser.id,
            name: appUser.name,
            handle: appUser.handle,
            avatarUrl: appUser.avatarUrl,
            email: appUser.email || '',
        },
        authorRef: doc(db, 'users', appUser.id),
        text: newComment,
        timestamp: new Date(),
    };

    await updateDoc(postRef, {
        comments: arrayUnion(comment)
    });
    
    // Create notification
    if (post.author.id !== appUser.id) {
        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
            recipientRef: post.authorRef,
            senderName: appUser.name,
            senderAvatarUrl: appUser.avatarUrl,
            type: 'comment',
            postRef: doc(db, 'posts', post.id),
            read: false,
            createdAt: serverTimestamp(),
        });
    }

    setNewComment('');
  };
  
  const handleReply = (replyText: string, parentCommentId: string) => {
    // Firestore does not support nested array updates easily.
    // A more complex data model (subcollection for comments) would be needed for replies.
    // For now, this is a limitation.
    console.log('Replying is a premium feature... just kidding, it requires a better data model!');
     toast({
      title: 'Replying not yet implemented',
      description: 'This feature requires a more advanced database structure.',
    });
  };

  const handleSend = () => {
    setShowShareDialog(false);
    toast({
      title: 'Post Sent!',
      description: `This post has been sent.`,
    });
  };
  
  const getTimestamp = () => {
    const ts = post.createdAt as any;
    if (ts && typeof ts.toDate === 'function') {
      return formatDistanceToNow(ts.toDate(), { addSuffix: true });
    }
    return post.timestamp || '';
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-base font-bold">{post.author.name}</CardTitle>
            <CardDescription>@{post.author.handle} · {getTimestamp()}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{post.content}</p>
          {post.imageUrl && (
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.imageUrl}
                alt="Post image"
                fill
                className="object-cover"
                data-ai-hint={post.imageHint}
              />
            </div>
          )}
          {post.car && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>{post.car}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 pt-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleLike}>
            <ThumbsUp className={cn("h-4 w-4", hasLiked && 'text-primary fill-primary')} /> {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" /> {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setShowShareDialog(true)}>
            <Send className="h-4 w-4" /> Send
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
              {post.comments.length > 0 ? (
                post.comments.map((comment, i) => <Comment key={i} comment={comment} onReply={handleReply} />)
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Post</DialogTitle>
            <DialogDescription>
              Select a friend to share this post with.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-60 overflow-y-auto">
            {/* This part still uses mock data. It would need to be updated to fetch user's friends/followers from Firestore */}
            {/* {users.filter(u => u.id !== post.author.id).map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                 <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">@{user.handle}</p>
                    </div>
                  </div>
                <Button onClick={handleSend} variant="secondary">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            ))} */}
            <p className="text-center text-sm text-muted-foreground">Feature coming soon!</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    