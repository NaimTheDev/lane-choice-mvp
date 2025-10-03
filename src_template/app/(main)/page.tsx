
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PostCard } from '@/components/post-card';
import type { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trophy, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { posts as mockPosts } from '@/lib/data';

export default function ActivityFeedPage() {
  const { appUser } = useAuth();
  const [showVoteDialog, setShowVoteDialog] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const votePromptDismissed = sessionStorage.getItem('vote_prompt_dismissed');
    if (!votePromptDismissed) {
      setShowVoteDialog(true);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
        setIsLoading(true);
        // In a real app, this would use onSnapshot for real-time updates.
        // For simulation, we'll fetch once and use mock data.
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'));
        
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                // If firestore is empty, use mock data.
                console.log("No posts in Firestore, using mock data for simulation.");
                setPosts(mockPosts);
            } else {
                 const postsData: Post[] = [];
                 for (const postDoc of querySnapshot.docs) {
                    const postData = postDoc.data();
                    let authorData = null;

                    if (postData.authorRef) {
                       const authorDoc = await getDoc(postData.authorRef);
                       if (authorDoc.exists()) {
                           authorData = { id: authorDoc.id, ...authorDoc.data() };
                       }
                    }
                    
                    postsData.push({
                      id: postDoc.id,
                      ...postData,
                      author: authorData,
                      comments: postData.comments || [],
                      likes: postData.likes || 0,
                      likedBy: postData.likedBy || [],
                    } as Post);
                }
                setPosts(postsData);
            }
        } catch (error) {
            console.error("Error fetching posts, falling back to mock data:", error);
            setPosts(mockPosts);
        } finally {
            setIsLoading(false);
        }
    }

    fetchPosts();
  }, []);


  const handleDismissVoteDialog = () => {
    sessionStorage.setItem('vote_prompt_dismissed', 'true');
    setShowVoteDialog(false);
  };

  const handleVoteNow = () => {
    handleDismissVoteDialog();
    router.push('/vote');
  };

  const handleRefresh = () => {
    toast({
      title: 'Feed Refreshed',
      description: 'The latest posts have been loaded.',
    });
    // The onSnapshot listener handles real-time updates, so a manual refresh is for user feedback
  };

  return (
    <>
      <div className="space-y-6">
        {appUser && (
          <Card>
            <CardHeader className="flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src={appUser.avatarUrl} alt={appUser.name} />
                <AvatarFallback>{appUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input placeholder={`What's on your mind, @${appUser.handle}?`} className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0" readOnly onClick={() => router.push('/post/new')}/>
            </CardHeader>
            <CardContent className="flex justify-end pt-0">
              <Button asChild>
                  <Link href="/post/new">Create Post</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-headline">Activity Feed</h1>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh Feed</span>
          </Button>
        </div>

        {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="space-y-4">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-3 w-[100px]" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="aspect-video w-full rounded-lg" />
                    </CardContent>
                </Card>
            ))
        ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
        )}
      </div>

      <AlertDialog open={showVoteDialog} onOpenChange={setShowVoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
             <div className="rounded-full bg-primary/10 p-4 inline-block">
                 <Trophy className="h-10 w-10 text-primary" />
             </div>
            <AlertDialogTitle className="text-2xl mt-4">Vote for Car of the Week!</AlertDialogTitle>
            <AlertDialogDescription>
              Your vote matters! Help decide which car gets crowned this week.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:justify-center sm:space-x-0 gap-2">
            <Button onClick={handleVoteNow} className="w-full">Vote Now</Button>
            <AlertDialogCancel asChild>
                <Button variant="ghost" className="w-full" onClick={handleDismissVoteDialog}>Maybe Later</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
