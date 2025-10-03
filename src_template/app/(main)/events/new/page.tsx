
'use client';

import React, { useState } from 'react';
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
import { useAuth } from '@/components/auth-provider';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, Star, Zap, Gamepad2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function NewEventPage() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();
  const { user, appUser, setAppUser } = useAuth();
  const router = useRouter();

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const hasAccess = appUser?.subscriptionTier === 'enthusiast' || appUser?.subscriptionTier === 'pro';

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
    }
  };

  const handleCreateEvent = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create an event.", variant: "destructive" });
      return;
    }
    if (!eventName || !eventDate || !eventLocation || !eventDescription || !coverFile) {
        toast({ title: "Missing Information", description: "Please fill out all fields and upload a cover image.", variant: "destructive" });
        return;
    }
    if (!eventDescription.toLowerCase().includes('respect the property')) {
        toast({ title: "Community Guideline", description: "Please ensure your description includes 'respect the property'.", variant: "destructive" });
        return;
    }

    if (hasAccess) {
      setIsCreating(true);
      try {
        const storageRef = ref(storage, `event-covers/${user.uid}/${Date.now()}_${coverFile.name}`);
        await uploadBytes(storageRef, coverFile);
        const coverUrl = await getDownloadURL(storageRef);

        const eventsCollection = collection(db, 'events');
        await addDoc(eventsCollection, {
            name: eventName,
            date: eventDate,
            location: eventLocation,
            description: eventDescription,
            coverUrl: coverUrl,
            coverHint: "event cover",
            attendees: [],
            attendeeCount: 0,
            createdAt: serverTimestamp(),
        });

       toast({
        title: 'Event Created!',
        description: 'Your event has been successfully created.',
      });
      router.push('/events');

      } catch (error) {
        console.error("Error creating event:", error);
        toast({ title: "Error", description: "Failed to create event. Please try again.", variant: "destructive" });
      } finally {
        setIsCreating(false);
      }
    } else {
      setShowPaymentDialog(true);
    }
  };

  const handlePayment = (tier: 'player' | 'enthusiast' | 'pro') => {
    setShowPaymentDialog(false);
    if (appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: tier});
    }
    toast({
      title: 'Subscription Successful!',
      description: `You've subscribed to the ${tier} plan.`,
    });
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center font-headline">Create New Event</h1>
        <form onSubmit={handleCreateEvent}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Fill out the form below to create your event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input id="event-name" placeholder="e.g., Summer Meet & Greet" value={eventName} onChange={e => setEventName(e.target.value)} required/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="event-date">Date and Time</Label>
              <Input id="event-date" placeholder="e.g., Saturday, Sep 21st, 6:00 PM" value={eventDate} onChange={e => setEventDate(e.target.value)} required/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input id="event-location" placeholder="e.g., Central City Park" value={eventLocation} onChange={e => setEventLocation(e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <Label>Event Cover Image</Label>
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {coverFile ? coverFile.name : <span className="font-semibold">Click to upload cover image</span>}
                  </p>
                </div>
                <input
                  id="cover-upload"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleCoverChange}
                />
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Describe your event..."
                rows={5}
                value={eventDescription}
                onChange={e => setEventDescription(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">
              Note: All event descriptions must encourage attendees to "respect the property". Please ensure this is included in your description.
            </p>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </CardFooter>
        </Card>
        </form>
      </div>

       <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Create Events</AlertDialogTitle>
            <AlertDialogDescription>
              Creating your own event is an Enthusiast feature. Choose a plan to unlock this and other great benefits.
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
