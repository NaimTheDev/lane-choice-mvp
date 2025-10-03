
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, Star, Zap, Gamepad2, Flame } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

export default function NewClubPage() {
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);
  const { toast } = useToast();
  const { user, appUser, setAppUser } = useAuth();
  const router = useRouter();

  const [clubName, setClubName] = React.useState('');
  const [clubDescription, setClubDescription] = React.useState('');
  const [isInviteOnly, setIsInviteOnly] = React.useState(false);
  const [bannerFile, setBannerFile] = React.useState<File | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  const hasAccess = appUser?.subscriptionTier === 'enthusiast' || appUser?.subscriptionTier === 'pro';

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerFile(file);
    }
  };

  const handleCreateClub = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !appUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a club.", variant: "destructive" });
      return;
    }
    if (!clubName || !clubDescription || !bannerFile) {
        toast({ title: "Missing Information", description: "Please fill out all fields and upload a banner.", variant: "destructive" });
        return;
    }

    if (hasAccess) {
      setIsCreating(true);
      try {
        // 1. Upload banner image
        const storageRef = ref(storage, `club-banners/${user.uid}/${Date.now()}_${bannerFile.name}`);
        await uploadBytes(storageRef, bannerFile);
        const bannerUrl = await getDownloadURL(storageRef);

        // 2. Create club document in Firestore
        const clubsCollection = collection(db, 'clubs');
        await addDoc(clubsCollection, {
          name: clubName,
          description: clubDescription,
          bannerUrl: bannerUrl,
          bannerHint: "club banner",
          isPrivate: isInviteOnly,
          ownerRef: doc(db, 'users', user.uid),
          memberRefs: [doc(db, 'users', user.uid)],
          joinRequestRefs: [],
          memberCount: 1,
          createdAt: serverTimestamp(),
        });

        toast({
          title: 'Club Created!',
          description: 'Your new club has been successfully created.',
        });
        router.push('/clubs');

      } catch (error) {
        console.error("Error creating club:", error);
        toast({ title: "Error", description: "Failed to create club. Please try again.", variant: "destructive" });
      } finally {
        setIsCreating(false);
      }
    } else {
      setShowPaymentDialog(true);
    }
  };

  const handlePayment = (tier: 'player' | 'enthusiast' | 'pro') => {
    setShowPaymentDialog(false);
    // In a real app, this would involve a payment gateway.
    // We'll just simulate the subscription update.
    if (appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: tier});
    }
    toast({
      title: 'Subscription Successful!',
      description: `You've subscribed to the ${tier} plan.`,
    });
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center font-headline">Create a New Club</h1>
        <form onSubmit={handleCreateClub}>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Club Details</CardTitle>
              <CardDescription>Fill out the form below to create your club.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="club-name">Club Name</Label>
                <Input id="club-name" placeholder="e.g., Midnight Racers" required value={clubName} onChange={(e) => setClubName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="club-description">Description</Label>
                <Textarea
                  id="club-description"
                  placeholder="Describe your club's purpose and what makes it unique..."
                  rows={4}
                  required
                  value={clubDescription}
                  onChange={(e) => setClubDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Club Banner</Label>
                <label
                  htmlFor="banner-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {bannerFile ? bannerFile.name : <span className="font-semibold">Click to upload banner</span>}
                    </p>
                  </div>
                  <input
                    id="banner-upload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleBannerChange}
                  />
                </label>
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                <Label htmlFor="invite-only" className="flex flex-col space-y-1">
                  <span>Invite-only Club</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    If enabled, only members you invite will be able to join.
                  </span>
                </Label>
                <Switch id="invite-only" checked={isInviteOnly} onCheckedChange={setIsInviteOnly} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Club
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Create Clubs</AlertDialogTitle>
            <AlertDialogDescription>
              Creating your own car club is an Enthusiast feature. Choose a plan to unlock this and other great benefits.
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
                  <Button className="w-full" onClick={() => handlePayment('player')}>Subscribe</Button>
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
                    <Button className="w-full" onClick={() => handlePayment('enthusiast')}>Subscribe</Button>
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
                    <Button className="w-full" onClick={() => handlePayment('pro')}>Go Pro</Button>
                </CardFooter>
            </Card>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
