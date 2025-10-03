
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
import { Calendar, MapPin, PlusCircle, Users, CheckCircle } from 'lucide-react';
import type { Event, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, orderBy, updateDoc, arrayUnion, arrayRemove, getDoc, increment } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { events as mockEvents } from '@/lib/data';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { appUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("No events in Firestore, using mock data for simulation.");
        setEvents(mockEvents);
        // Simulate RSVP status for mock data
        if (appUser) {
            const userRsvps = new Set<string>();
            mockEvents.forEach(event => {
                if (event.attendeeRefs?.some(ref => ref.id === appUser.id)) {
                    userRsvps.add(event.id);
                }
            });
            setRsvps(userRsvps);
        }
        setIsLoading(false);
        return;
      }

      const eventsData: Event[] = [];
      const userRsvps = new Set<string>();
      
      for (const eventDoc of querySnapshot.docs) {
        const eventData = { id: eventDoc.id, ...eventDoc.data() } as Event;
        
        // Fetch full user objects for attendees
        if (eventData.attendeeRefs && eventData.attendeeRefs.length > 0) {
            const attendeePromises = eventData.attendeeRefs.map(ref => getDoc(ref));
            const attendeeDocs = await Promise.all(attendeePromises);
            eventData.attendees = attendeeDocs.map(doc => doc.data() as User).filter(Boolean);
        } else {
            eventData.attendees = [];
        }
        
        if (appUser && eventData.attendeeRefs?.some(ref => ref.id === appUser.id)) {
            userRsvps.add(eventData.id);
        }
        eventsData.push(eventData);
      }
      
      setEvents(eventsData);
      setRsvps(userRsvps);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [appUser]);

  const handleRsvpToggle = async (eventId: string) => {
    if (!appUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to RSVP.", variant: "destructive" });
      return;
    }
    
    const eventRef = doc(db, 'events', eventId);
    const userRef = doc(db, 'users', appUser.id);
    const eventName = events.find(e => e.id === eventId)?.name || 'the event';

    if (rsvps.has(eventId)) {
      await updateDoc(eventRef, {
        attendeeRefs: arrayRemove(userRef),
        attendeeCount: increment(-1)
      });
      toast({
        title: 'RSVP Removed',
        description: `You are no longer attending ${eventName}.`,
      });
    } else {
      await updateDoc(eventRef, {
        attendeeRefs: arrayUnion(userRef),
        attendeeCount: increment(1)
      });
      toast({
        title: 'RSVP Successful!',
        description: `You are now attending ${eventName}.`,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold font-headline">Upcoming Events</h1>
         <Button asChild>
            <Link href="/events/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
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
                    <CardContent className="p-6 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
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
          {events.map((event) => {
            const isAttending = rsvps.has(event.id);
            const attendees = event.attendees || [];
            const displayAttendees = attendees.slice(0, 5);
            const remainingCount = attendees.length > 5 ? attendees.length - 5 : 0;
            const attendeeCount = event.attendeeCount || 0;

            return (
              <Card key={event.id}>
                <CardHeader className="p-0">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={event.coverUrl}
                      alt={`${event.name} cover`}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={event.coverHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  <CardDescription>{event.description}</CardDescription>
                  <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Attendees ({attendees.length})</h4>
                      <div className="flex items-center -space-x-2">
                          {displayAttendees.map(user => (
                              <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                          ))}
                          {remainingCount > 0 && (
                               <Avatar className="h-8 w-8 border-2 border-background">
                                  <AvatarFallback>+{remainingCount}</AvatarFallback>
                              </Avatar>
                          )}
                          {attendees.length === 0 && (
                              <p className="text-xs text-muted-foreground">Be the first to RSVP!</p>
                          )}
                      </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{attendeeCount.toLocaleString() || 0} attending</span>
                  </div>
                  <Button 
                    className="w-28" 
                    onClick={() => handleRsvpToggle(event.id)}
                    variant={isAttending ? 'secondary' : 'default'}
                    disabled={!appUser}
                  >
                    {isAttending ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Attending
                      </>
                    ) : (
                      'RSVP'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
