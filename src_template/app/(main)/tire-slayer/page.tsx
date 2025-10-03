
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Flame, Video, Upload, Loader2, Star, Zap, Gamepad2 } from 'lucide-react';
import type { VideoPost } from '@/lib/types';
import { videoPosts as mockVideoPosts } from '@/lib/data';
import { VideoCard } from '@/components/video-card';
import { useAuth } from '@/components/auth-provider';


export default function TireSlayerPage() {
  const [videoPosts, setVideoPosts] = useState<VideoPost[]>(mockVideoPosts);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { appUser, setAppUser } = useAuth();
  
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);

  const hasAccess = appUser?.subscriptionTier === 'player' || appUser?.subscriptionTier === 'enthusiast' || appUser?.subscriptionTier === 'pro';

  React.useEffect(() => {
    if (!hasAccess) {
      setShowSubscriptionDialog(true);
    }
  }, [hasAccess]);

  const handleUpload = async () => {
    if (!appUser) {
        toast({ title: 'Error', description: 'You must be logged in to upload.', variant: 'destructive'});
        return;
    }
    if (!videoFile || !title) {
        toast({ title: 'Error', description: 'Please provide a title and a video file.', variant: 'destructive'});
        return;
    }
    setIsUploading(true);
    // In a real app, you would upload the video to Firebase Storage
    // and then create a new document in the 'videoPosts' collection.
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newVideoPost: VideoPost = {
        id: `vp${Date.now()}`,
        author: appUser,
        title,
        videoUrl: URL.createObjectURL(videoFile),
        thumbnailUrl: 'https://placehold.co/600x400',
        timestamp: 'Just now',
        createdAt: new Date(),
        likes: 0,
        comments: [],
    };
    
    setVideoPosts(prev => [newVideoPost, ...prev]);

    setIsUploading(false);
    setShowUploadDialog(false);
    setVideoFile(null);
    setTitle('');
    toast({ title: 'Success!', description: 'Your video has been uploaded.' });
  }

  const handleSubscribe = (tier: 'player' | 'enthusiast' | 'pro') => {
    if (appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: tier});
    }
    setShowSubscriptionDialog(false);
    toast({
        title: 'Subscription Successful!',
        description: `You subscribed to the ${tier} plan and can now access the Tire Slayer page.`,
    });
  }

  if (!hasAccess) {
    return (
       <div className="flex items-center justify-center h-full">
        <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
          <AlertDialogContent className="max-w-4xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Flame className="text-primary" />
                Unlock the Tire Slayer Feed!
              </AlertDialogTitle>
              <AlertDialogDescription>
                The Tire Slayer video feed is a Player feature. Choose a plan to unlock this and other great benefits.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                <Card className="flex flex-col">
                  <CardHeader>
                      <Gamepad2 className="h-8 w-8 text-blue-500 mb-2" />
                      <CardTitle>Player</CardTitle>
                      <p className="text-2xl font-bold">$2.99/mo</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Play Drag Race Mini-Game</li>
                          <li>Vote for Car of the Week</li>
                          <li>Access Tire Slayer</li>
                      </ul>
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" onClick={() => handleSubscribe('player')}>Subscribe</Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <Star className="h-8 w-8 text-yellow-500 mb-2" />
                        <CardTitle>Enthusiast</CardTitle>
                        <p className="text-2xl font-bold">$5.99/mo</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>All Player features</li>
                            <li>Create Clubs</li>
                            <li>Create Events</li>
                            <li>Enter Car of the Week</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleSubscribe('enthusiast')}>Subscribe</Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col border-primary">
                    <CardHeader>
                        <Zap className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Pro Enthusiast</CardTitle>
                        <p className="text-2xl font-bold">$9.99/mo</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>All Enthusiast features</li>
                            <li>Unlimited Swipes in Speed Dating</li>
                            <li>Private Account option</li>
                            <li>Full App Theme Customization</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleSubscribe('pro')}>Go Pro</Button>
                    </CardFooter>
                </Card>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
         <Card className="max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle>Tire Slayer</CardTitle>
                <CardDescription>This is a premium feature.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Subscribe to view and upload videos!</p>
            </CardContent>
             <CardFooter>
                <Button onClick={() => setShowSubscriptionDialog(true)}>Unlock Feature</Button>
            </CardFooter>
         </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-4">
                    <Flame className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline">Tire Slayer</h1>
                </div>
                <p className="mt-2 text-muted-foreground">Show us what you've got! Upload your best burnouts, drift videos, and car launches.</p>
            </div>
            <Button onClick={() => setShowUploadDialog(true)}>
                <Video className="mr-2 h-4 w-4" />
                Upload Video
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoPosts.map(post => (
                <VideoCard key={post.id} post={post} />
            ))}
        </div>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Upload Your Clip</DialogTitle>
                <DialogDescription>
                    Share your best tire-slaying moments with the community.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g., Epic burnout in my Mustang" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Video File</Label>
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {videoFile ? videoFile.name : <span className="font-semibold">Click to upload video</span>}
                        </p>
                      </div>
                      <input
                        id="video-upload"
                        type="file"
                        className="hidden"
                        accept="video/mp4,video/quicktime,video/x-msvideo"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />
                    </label>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" onClick={handleUpload} disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Video
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
