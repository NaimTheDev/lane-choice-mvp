
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, X, Flag, LocateFixed, Zap, Car, Edit, BadgeCheck, Star, Gamepad2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EditRaceCardDialog } from '@/components/edit-race-card-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { users as mockUsers } from '@/lib/data';

export default function RacesPage() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [range, setRange] = React.useState(10);
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);
  const [showMatchDialog, setShowMatchDialog] = React.useState(false);
  const [matchedUser, setMatchedUser] = React.useState<User | null>(null);
  const [swipeCount, setSwipeCount] = React.useState(0);
  const [showSwipeLimitDialog, setShowSwipeLimitDialog] = React.useState(false);
  const [consecutiveDucks, setConsecutiveDucks] = React.useState(0);
  const [showDuckingDialog, setShowDuckingDialog] = React.useState(false);
  const [showEditCardDialog, setShowEditCardDialog] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { appUser: currentUser, setAppUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isProSubscriber = currentUser?.subscriptionTier === 'pro';
  const isEnthusiastSubscriber = currentUser?.subscriptionTier === 'enthusiast';
  
  const getSwipeLimit = () => {
    if (isProSubscriber) return Infinity;
    if (isEnthusiastSubscriber) return 25;
    return 10;
  }
  const DAILY_SWIPE_LIMIT = getSwipeLimit();

  const CONSECUTIVE_DUCK_LIMIT = 5;
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      if (!currentUser) {
          // If no user is logged in, use mock data for simulation
          setUsers(mockUsers);
          setIsLoading(false);
          return;
      }
      try {
        // In a real-world scenario, you'd have more complex location-based querying.
        // For now, we fetch a limited number of users excluding the current user.
        const usersQuery = query(
          collection(db, 'users'),
          where('id', '!=', currentUser.id),
          limit(20)
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => doc.data() as User);
        setUsers(usersData.length > 0 ? usersData : mockUsers.filter(u => u.id !== currentUser.id));
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({ title: "Error", description: "Could not fetch profiles.", variant: "destructive" });
        setUsers(mockUsers.filter(u => !currentUser || u.id !== currentUser.id));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser, toast]);


  const handleSubscribe = (tier: 'player' | 'enthusiast' | 'pro') => {
    if (currentUser && setAppUser) {
        setAppUser({...currentUser, subscriptionTier: tier});
    }
    setShowSubscriptionDialog(false);
    setShowSwipeLimitDialog(false);
    toast({
        title: 'Subscription Successful!',
        description: 'You now have access to all Pro features.',
    });
  };

  const handleFilterToggle = (filter: string) => {
    if (!isProSubscriber) {
      setShowSubscriptionDialog(true);
      return;
    }
    // This filtering logic is now client-side after fetching.
    // For a large-scale app, this filtering would be part of the Firestore query.
    setRaceFilters(prevFilters => {
      const newFilters = new Set(prevFilters);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };
  
  const [raceFilters, setRaceFilters] = React.useState<Set<string>>(new Set());

  const otherUsers = users
    .filter(u => {
      if (raceFilters.size === 0) return true;
      return u.raceTypes?.some(type => raceFilters.has(type));
    });


  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError('Enable location services to find nearby racers.');
          } else {
             setLocationError('Could not determine your location.');
          }
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleRangeChange = (value: number[]) => {
    const newRange = value[0];
    if (newRange > 10 && !isProSubscriber) {
      setShowSubscriptionDialog(true);
      setRange(10);
    } else {
      setRange(newRange);
    }
  };

  const handleSwipeAction = async (action: 'duck' | 'lockIn', user?: User) => {
    if (!currentUser) return;
    if (swipeCount >= DAILY_SWIPE_LIMIT) {
      setShowSwipeLimitDialog(true);
      return;
    }

    setSwipeCount(swipeCount + 1);

    if (action === 'lockIn' && user) {
      setConsecutiveDucks(0);
      
      try {
        // Create conversation
        const currentUserRef = doc(db, 'users', currentUser.id);
        const otherUserRef = doc(db, 'users', user.id);
        const conversationsRef = collection(db, 'conversations');
        
        await addDoc(conversationsRef, {
            participantRefs: [currentUserRef, otherUserRef],
            lastMessage: {
                text: `You matched with ${user.name}!`,
                createdAt: serverTimestamp(),
                senderId: '', // System message
            }
        });

        // Create notification for the matched user
        const notificationsRef = collection(db, 'notifications');
        await addDoc(notificationsRef, {
            recipientRef: otherUserRef,
            senderName: currentUser.name,
            senderAvatarUrl: currentUser.avatarUrl,
            senderRef: currentUserRef,
            type: 'new_match',
            read: false,
            createdAt: serverTimestamp(),
        });
        
        setMatchedUser(user);
        setShowMatchDialog(true);
        
      } catch (error) {
        console.error("Error creating match:", error);
        toast({ title: 'Match Error', description: 'Could not create the match. Please try again.', variant: 'destructive'});
      }
    } else {
      const newDuckCount = consecutiveDucks + 1;
      setConsecutiveDucks(newDuckCount);
      if (newDuckCount >= CONSECUTIVE_DUCK_LIMIT) {
        setShowDuckingDialog(true);
        setConsecutiveDucks(0);
      }
      api?.scrollNext();
    }
  };
  
  const handleStartChatting = () => {
    setShowMatchDialog(false);
    router.push('/messages');
  };

  const handleKeepSwiping = () => {
    setShowMatchDialog(false);
    api?.scrollNext();
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-4 sm:p-0">
        <div className="w-full max-w-xs sm:max-w-sm px-4 space-y-6 mb-6">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <div className="space-y-4">
              <div className="flex justify-between items-end">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/4" />
              </div>
              <Skeleton className="h-5 w-full" />
          </div>
           <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-10 w-16" />
          </div>
           <Skeleton className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="w-full max-w-xs sm:max-w-sm">
          <Card className="overflow-hidden shadow-lg aspect-[3/4] flex flex-col items-center justify-center bg-muted">
            <Skeleton className="w-full h-full" />
          </Card>
        </div>
      </div>
    )
  }

  const hasReachedSwipeLimit = swipeCount >= DAILY_SWIPE_LIMIT;

  const renderCarouselContent = () => {
    if (otherUsers.length === 0) {
      return (
        <CarouselItem>
          <Card className="overflow-hidden shadow-lg aspect-[3/4] flex flex-col items-center justify-center bg-muted">
            <CardContent className="text-center p-6">
              <p className="text-lg font-semibold text-muted-foreground">No matching profiles</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        </CarouselItem>
      );
    }
    
    return (
      <>
        {otherUsers.map((user) => {
            const images = user.raceCardImageUrls && user.raceCardImageUrls.length > 0 ? user.raceCardImageUrls : ['https://placehold.co/600x800'];
            return (
                <CarouselItem key={user.id}>
                    <Card className="overflow-hidden shadow-lg">
                    <div className="relative aspect-[3/4] w-full bg-muted">
                        <Carousel className="w-full h-full">
                            <CarouselContent>
                                {images.map((imgSrc, index) => (
                                    <CarouselItem key={index}>
                                        <Image
                                        src={imgSrc}
                                        alt={`${user.name} cover ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="person driving car"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {images.length > 1 && (
                                <>
                                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                                </>
                            )}
                        </Carousel>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                            <Avatar className="w-24 h-24 border-4 border-white mb-4">
                            <AvatarImage src={user.avatarUrl} alt={user.name}/>
                            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                {user.isVerified && <BadgeCheck className="h-6 w-6 text-blue-400" />}
                            </div>
                            <p className="text-sm text-white/80">@{user.handle}</p>
                        </div>
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Car className="h-4 w-4" />
                            <span>{user.raceCarName || 'Not specified'}</span>
                        </div>
                        <p className="text-sm text-foreground pt-1">{user.raceCardDescription || 'No description provided.'}</p>
                            {user.raceTypes && user.raceTypes.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {user.raceTypes.map(type => (
                                <Badge key={type} variant="secondary">{type}</Badge>
                                ))}
                            </div>
                            )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-around gap-4 mt-2">
                            <Button variant="outline" size="lg" className="rounded-full w-24 h-24 flex flex-col items-center justify-center border-4 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleSwipeAction('duck')}>
                                <X className="h-10 w-10" />
                                <span className="mt-1 font-bold">Duck</span>
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full w-24 h-24 flex flex-col items-center justify-center border-4 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-500" onClick={() => handleSwipeAction('lockIn', user)}>
                                <Flag className="h-10 w-10" />
                                <span className="mt-1 font-bold">Lock In</span>
                            </Button>
                        </div>
                    </CardContent>
                    </Card>
                </CarouselItem>
            )
        })}
         <CarouselItem>
            <Card className="overflow-hidden shadow-lg aspect-[3/4] flex flex-col items-center justify-center bg-muted">
              <CardContent className="text-center p-6">
                 {hasReachedSwipeLimit ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">Out of Swipes!</h3>
                    <p className="text-muted-foreground mb-4">
                      Upgrade to Enthusiast or Pro for more swipes and connections.
                    </p>
                    <Button onClick={() => setShowSwipeLimitDialog(true)}>Upgrade Plan</Button>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-muted-foreground">No more profiles</p>
                    <p className="text-sm text-muted-foreground">Check back later for more!</p>
                  </>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
      </>
    );
  };


  return (
    <>
      <div className="flex flex-col items-center p-4 sm:p-0">
        <div className="w-full max-w-xs space-y-3 mb-4">
          <h1 className="text-3xl font-bold text-center font-headline">Speed Dating</h1>
          <div className="space-y-2">
              <div className="flex justify-between items-end">
                  <label htmlFor="range" className="text-sm font-medium flex items-center gap-2">
                      Range
                      {!isProSubscriber && <Badge variant="outline" className="text-primary border-primary flex items-center gap-1"><Zap className="h-3 w-3" /> Pro</Badge>}
                  </label>
                  <span className="text-sm text-muted-foreground">{range} miles</span>
              </div>
              <Slider
                  id="range"
                  min={5}
                  max={200}
                  step={5}
                  value={[range]}
                  onValueChange={handleRangeChange}
              />
          </div>
          <div className="flex items-center justify-between pt-1">
              <Label htmlFor="availability-toggle" className="text-sm font-medium">
                  Available for races
              </Label>
              <Switch
                  id="availability-toggle"
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
              />
          </div>
          <div className="flex justify-center pt-2">
             <Button variant="outline" onClick={() => setShowEditCardDialog(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit My Card
             </Button>
          </div>
          <div className="space-y-2 pt-1">
            <Label className="text-sm font-medium flex items-center gap-2">
                Race Type Filters
                {!isProSubscriber && <Badge variant="outline" className="text-primary border-primary flex items-center gap-1"><Zap className="h-3 w-3" /> Pro</Badge>}
            </Label>
            <div className="flex justify-center gap-2 flex-wrap">
                <Button
                    variant={raceFilters.has('1/8 mile') ? 'secondary' : 'outline'}
                    onClick={() => handleFilterToggle('1/8 mile')}
                    size="sm"
                >
                    1/8 Mile
                </Button>
                <Button
                    variant={raceFilters.has('1/4 mile') ? 'secondary' : 'outline'}
                    onClick={() => handleFilterToggle('1/4 mile')}
                    size="sm"
                >
                    1/4 Mile
                </Button>
                <Button
                    variant={raceFilters.has('Roll Race') ? 'secondary' : 'outline'}
                    onClick={() => handleFilterToggle('Roll Race')}
                    size="sm"
                >
                    Roll Race
                </Button>
                 <Button
                    variant={raceFilters.has('Drift') ? 'secondary' : 'outline'}
                    onClick={() => handleFilterToggle('Drift')}
                    size="sm"
                >
                    Drift
                </Button>
            </div>
          </div>
          {DAILY_SWIPE_LIMIT !== Infinity && (
            <div className="text-center text-xs text-muted-foreground pt-1">
              Swipes remaining today: {Math.max(0, DAILY_SWIPE_LIMIT - swipeCount)}
            </div>
          )}
          {locationError && (
              <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 rounded-lg">
                  <LocateFixed className="h-4 w-4" />
                  <span>{locationError}</span>
              </div>
          )}
        </div>

        <div className="w-full max-w-xs sm:max-w-sm">
          <Carousel setApi={setApi} className="w-full" opts={{
            watchDrag: !hasReachedSwipeLimit,
          }}>
            <CarouselContent>
              {renderCarouselContent()}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <EditRaceCardDialog open={showEditCardDialog} onOpenChange={setShowEditCardDialog} />

      <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro Enthusiast</AlertDialogTitle>
            <AlertDialogDescription>
              Advanced filters, an extended search range, and unlimited swipes are Pro features. Upgrade to find your perfect match.
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

      <AlertDialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
             <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={matchedUser?.avatarUrl} alt={matchedUser?.name} />
                    <AvatarFallback>{matchedUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <AlertDialogTitle className="text-2xl mt-4">It's a Match!</AlertDialogTitle>
            <AlertDialogDescription>
              You and {matchedUser?.name} have locked in. Start a conversation now!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <Button onClick={handleStartChatting} className="w-full">Start Chatting</Button>
            <Button variant="ghost" onClick={handleKeepSwiping} className="w-full">Keep Swiping</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSwipeLimitDialog} onOpenChange={setShowSwipeLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You've Reached Your Daily Limit</AlertDialogTitle>
            <AlertDialogDescription>
              Upgrade to Enthusiast for more swipes, or go Pro for unlimited!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubscribe('pro')}>Go Pro</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDuckingDialog} onOpenChange={setShowDuckingDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Ducking!</AlertDialogTitle>
            <AlertDialogDescription>
              Get out there and meet someone!! You might miss a great time
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDuckingDialog(false)}>Keep Swiping</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
