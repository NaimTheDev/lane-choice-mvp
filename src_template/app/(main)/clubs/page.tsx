
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, PlusCircle, Lock, Send, CheckCircle, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, increment, getDocs } from 'firebase/firestore';
import type { Club } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth-provider';
import { clubs as mockClubs } from '@/lib/data';

export default function ClubsPage() {
  const { toast } = useToast();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { appUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'clubs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No clubs in Firestore, using mock data for simulation.");
        setClubs(mockClubs);
        setIsLoading(false);
        return;
      }
      const clubsData: Club[] = [];
      querySnapshot.forEach((doc) => {
        clubsData.push({ id: doc.id, ...doc.data() } as Club);
      });
      setClubs(clubsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleJoinLeave = async (club: Club) => {
    if (!appUser) {
      toast({ title: 'Not logged in', description: 'You must be logged in to join or leave a club.', variant: 'destructive' });
      return;
    }

    const clubRef = doc(db, 'clubs', club.id);
    const userRef = doc(db, 'users', appUser.id);
    const isMember = club.memberRefs?.some(ref => ref.id === appUser.id);

    try {
      if (isMember) {
        // Leave club
        await updateDoc(clubRef, {
          memberRefs: arrayRemove(userRef),
          memberCount: increment(-1),
        });
        toast({ title: 'Club Left', description: `You have left ${club.name}.`});
      } else {
        // Join public club
        await updateDoc(clubRef, {
          memberRefs: arrayUnion(userRef),
          memberCount: increment(1),
        });
        toast({ title: 'Club Joined!', description: `Welcome to ${club.name}!`});
      }
    } catch (error) {
      console.error('Error joining/leaving club:', error);
      toast({ title: 'Error', description: 'Could not update your membership. Please try again.', variant: 'destructive'});
    }
  };

  const handleRequestToJoin = async (club: Club) => {
    if (!appUser) {
      toast({ title: 'Not logged in', description: 'You must be logged in to request to join a club.', variant: 'destructive' });
      return;
    }

    const clubRef = doc(db, 'clubs', club.id);
    const userRef = doc(db, 'users', appUser.id);
    
    try {
        await updateDoc(clubRef, {
            joinRequestRefs: arrayUnion(userRef)
        });
        toast({
          title: 'Request Sent!',
          description: `Your request to join "${club.name}" has been sent to the club owner for approval.`,
        });
    } catch (error) {
      console.error('Error requesting to join club:', error);
      toast({ title: 'Error', description: 'Could not send your request. Please try again.', variant: 'destructive'});
    }
  };
  
  const renderJoinButton = (club: Club) => {
    if (!appUser) return <Button disabled>Join Club</Button>;

    const isMember = club.memberRefs?.some(ref => ref.id === appUser.id);
    const hasRequested = club.joinRequestRefs?.some(ref => ref.id === appUser.id);
    const isOwner = club.ownerRef?.id === appUser.id;

    if (isOwner) {
        return <Button variant="outline" disabled>Owner</Button>
    }

    if (isMember) {
        return (
            <Button variant="secondary" onClick={() => handleJoinLeave(club)}>
                <LogOut className="mr-2 h-4 w-4" />
                Leave Club
            </Button>
        )
    }

    if (club.isPrivate) {
        if (hasRequested) {
            return (
                <Button variant="outline" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Request Sent
                </Button>
            );
        } else {
            return (
                <Button variant="outline" onClick={() => handleRequestToJoin(club)}>
                    <Send className="mr-2 h-4 w-4" />
                    Request to Join
                </Button>
            );
        }
    }

    return (
        <Button onClick={() => handleJoinLeave(club)}>Join Club</Button>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Car Clubs</h1>
        <Button asChild>
          <Link href="/clubs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Club
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 3}).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="p-0">
                        <Skeleton className="aspect-video w-full rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-28" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            return (
              <Card key={club.id}>
                <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={club.bannerUrl}
                      alt={`${club.name} banner`}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={club.bannerHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2 flex items-center gap-2">
                    {club.name}
                    {club.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{(club.memberCount || 0).toLocaleString()} members</span>
                  </div>
                  {renderJoinButton(club)}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
