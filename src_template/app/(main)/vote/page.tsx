
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VoteCard } from '@/components/vote-card';
import { PlusCircle, Loader2, Star, Zap, Flame, Gamepad2 } from 'lucide-react';
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
import type { CarOfTheWeekEntry, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, runTransaction, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { carOfTheWeekEntries as mockEntries } from '@/lib/data';

export default function VotePage() {
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);
  const [entries, setEntries] = React.useState<CarOfTheWeekEntry[]>([]);
  const [votedIds, setVotedIds] = React.useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { appUser, setAppUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const canEnterContest = appUser?.subscriptionTier === 'enthusiast' || appUser?.subscriptionTier === 'pro';
  const canVote = appUser?.subscriptionTier === 'player' || appUser?.subscriptionTier === 'enthusiast' || appUser?.subscriptionTier === 'pro';

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'carOfTheWeek'), async (snapshot) => {
        if (snapshot.empty) {
            console.log("No Car of the Week entries in Firestore, using mock data for simulation.");
            // Add user data to mock entries
            const hydratedMocks = mockEntries.map(entry => ({ ...entry, user: entry.user || null }));
            setEntries(hydratedMocks.sort((a,b) => b.votes - a.votes));
            setIsLoading(false);
            return;
        }
        const entriesData: CarOfTheWeekEntry[] = [];
        for(const entryDoc of snapshot.docs) {
            const data = entryDoc.data();
            let user: User | null = null;
            if (data.userRef) {
                const userSnap = await getDoc(data.userRef);
                if (userSnap.exists()) {
                    user = { id: userSnap.id, ...userSnap.data() } as User;
                }
            }
            if (user) {
                entriesData.push({ id: entryDoc.id, ...data, user } as CarOfTheWeekEntry);
            }
        }
        setEntries(entriesData.sort((a,b) => b.votes - a.votes));
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubscribe = (tier: 'player' | 'enthusiast' | 'pro') => {
    if(appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: tier});
    }
    setShowSubscriptionDialog(false);
    toast({
        title: 'Subscription Successful!',
        description: `You've subscribed to the ${tier} plan.`,
    });
  };

  const handleEnterCar = () => {
    if (!canEnterContest) {
      setShowSubscriptionDialog(true);
    } else {
      // In a real app, this would open a dialog to select one of the user's cars
      toast({
        title: 'Feature Unlocked!',
        description: 'You can now enter your car into the contest.',
      });
    }
  };

  const handleVote = async (entryId: string) => {
    if (!canVote) {
        setShowSubscriptionDialog(true);
        return;
    }
    if (votedIds.has(entryId)) {
        toast({ title: "Already Voted", description: "You can only vote for each car once."});
        return;
    }
    if (!appUser) {
        toast({ title: "Authentication Error", description: "You must be logged in to vote.", variant: 'destructive'});
        return;
    }

    const entryRef = doc(db, 'carOfTheWeek', entryId);
    try {
      await updateDoc(entryRef, {
        votes: increment(1)
      });

      setVotedIds(currentVotedIds => {
        const newVotedIds = new Set(currentVotedIds);
        newVotedIds.add(entryId);
        return newVotedIds;
      });

      const entry = entries.find(e => e.id === entryId);
      if(entry) {
          toast({
              title: 'Vote Cast!',
              description: `You voted for ${entry.carName}.`,
          });
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({ title: "Error", description: "Could not cast your vote. Please try again.", variant: "destructive" });
    }
  };


  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline">Car of the Week</h1>
          <Button onClick={handleEnterCar}>
            <PlusCircle className="mr-2 h-4 w-4" /> Enter Your Car
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">Vote for your favorite car to see it crowned as this week's winner. The car with the most votes at the end of the week wins!</p>
        
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length:3}).map((_, i) => (
                  <Card key={i}>
                      <CardHeader className="p-0">
                          <Skeleton className="aspect-video w-full rounded-t-lg" />
                      </CardHeader>
                      <CardContent className="p-6 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="space-y-1">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-3 w-16" />
                              </div>
                          </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-10 w-24" />
                      </CardFooter>
                  </Card>
              ))}
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
                <VoteCard 
                  key={entry.id} 
                  entry={entry}
                  onVote={() => handleVote(entry.id)}
                  hasVoted={votedIds.has(entry.id)}
                  canVote={canVote}
                />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade Your Plan</AlertDialogTitle>
            <AlertDialogDescription>
              This feature requires a subscription. Choose a plan to unlock this and other great benefits.
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
    </>
  );
}
