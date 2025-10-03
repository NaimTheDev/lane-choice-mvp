
'use client';

import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/post-card';
import { Car, MapPin, UserPlus, PlusCircle, Camera, Calendar, Trophy, Lock, BadgeCheck, Edit, UserCheck } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/components/auth-provider';
import { doc, updateDoc, onSnapshot, collection, query, where, orderBy, getDoc, increment, arrayUnion, arrayRemove, addDoc, serverTimestamp, runTransaction, DocumentReference, DocumentSnapshot, Firestore } from 'firebase/firestore';
import type { Post, Event, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
)

export default function ProfilePage() {
  const { appUser, user: authUser } = useAuth();
  const [userPosts, setUserPosts] = React.useState<Post[]>([]);
  const [pastEvents, setPastEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [subscriptionDialogContent, setSubscriptionDialogContent] = React.useState({
    title: '',
    description: '',
  });
  const { toast } = useToast();
  
  // State for editable profile fields
  const [name, setName] = React.useState(appUser?.name || '');
  const [bio, setBio] = React.useState(appUser?.bio || "");
  const [location, setLocation] = React.useState(appUser?.location || "");
  const [profilePicFile, setProfilePicFile] = React.useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = React.useState<File | null>(null);
  const [garagePhotoFiles, setGaragePhotoFiles] = React.useState<FileList | null>(null);

  // In a real app, this would be determined by checking the user's subscription status in your backend
  const [isSubscribed, setIsSubscribed] = React.useState(true); 
  const isPrivate = appUser?.isPrivate || false;
  const isOwnProfile = true; 
  
  const [isFollowing, setIsFollowing] = React.useState(false);
  
  React.useEffect(() => {
    if (appUser && authUser) {
        setIsFollowing(appUser.followerRefs?.some(ref => ref.id === authUser.uid) || false);
    }
  }, [appUser, authUser]);


  React.useEffect(() => {
    if (appUser) {
        setName(appUser.name);
        setBio(appUser.bio || "No bio available.");
        setLocation(appUser.location || "Location not set.");
    }
  }, [appUser]);

  React.useEffect(() => {
    if (!appUser) {
        setIsLoading(false);
        return;
    };

    setIsLoading(true);

    const postsQuery = query(collection(db, 'posts'), where('authorRef', '==', doc(db, 'users', appUser.id)), orderBy('createdAt', 'desc'));
    const eventsQuery = query(collection(db, 'events'), where('attendeeRefs', 'array-contains', doc(db, 'users', appUser.id)), orderBy('createdAt', 'desc'));

    const unsubscribePosts = onSnapshot(postsQuery, async (snapshot) => {
        const fetchedPosts: Post[] = [];
         for (const postDoc of snapshot.docs) {
            const postData = postDoc.data();
            let authorData: User | null = null;
            if (postData.authorRef) {
                const authorSnap = await getDoc(postData.authorRef);
                if (authorSnap.exists()) {
                    authorData = { id: authorSnap.id, ...authorSnap.data() } as User;
                }
            }
            fetchedPosts.push({ id: postDoc.id, author: authorData!, ...postData } as Post);
        }
        setUserPosts(fetchedPosts);
    });

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
        const fetchedEvents: Event[] = [];
        snapshot.forEach(doc => {
            fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
        });
        setPastEvents(fetchedEvents);
    });
    
    setIsLoading(false);

    return () => {
        unsubscribePosts();
        unsubscribeEvents();
    }
  }, [appUser]);

  const getFollowerStatus = async (
    targetUserRef: DocumentReference,
    currentUserId: string
  ): Promise<boolean> => {
    const targetUserSnap = await getDoc(targetUserRef);
    if (!targetUserSnap.exists()) return false;
    const targetUserData = targetUserSnap.data() as User;
    return targetUserData.followerRefs?.some((ref: DocumentReference) => ref.id === currentUserId) || false;
  };

 const handleFollowToggle = async () => {
    if (!authUser || !appUser || !appUser.id) {
        toast({ title: "Not Authenticated", description: "You must be logged in to follow users.", variant: "destructive"});
        return;
    }

    const currentUserRef = doc(db, 'users', authUser.uid);
    const targetUserRef = doc(db, 'users', appUser.id);
    
    try {
      await runTransaction(db, async (transaction) => {
        const targetUserDoc = await transaction.get(targetUserRef);
        if (!targetUserDoc.exists()) {
          throw "User does not exist!";
        }
        const isCurrentlyFollowing = targetUserDoc.data()?.followerRefs?.some((ref: any) => ref.id === authUser.uid) || false;

        if (isCurrentlyFollowing) {
          // --- Unfollow Logic ---
          transaction.update(currentUserRef, {
            followingCount: increment(-1),
            followingRefs: arrayRemove(targetUserRef)
          });
          transaction.update(targetUserRef, {
            followerCount: increment(-1),
            followerRefs: arrayRemove(currentUserRef)
          });
        } else {
          // --- Follow Logic ---
          transaction.update(currentUserRef, {
            followingCount: increment(1),
            followingRefs: arrayUnion(targetUserRef)
          });
          transaction.update(targetUserRef, {
            followerCount: increment(1),
            followerRefs: arrayUnion(currentUserRef)
          });
          
          // Create notification within the transaction
          const notificationsRef = doc(collection(db, 'notifications'));
          transaction.set(notificationsRef, {
            recipientRef: targetUserRef,
            senderRef: currentUserRef,
            type: 'follow',
            read: false,
            createdAt: serverTimestamp(),
          });
        }
      });
      
      const isNowFollowing = await getFollowerStatus(targetUserRef, authUser.uid);
      setIsFollowing(isNowFollowing);
      toast({ 
        title: isNowFollowing ? "Followed" : "Unfollowed", 
        description: isNowFollowing ? `You are now following ${appUser.name}.` : `You are no longer following ${appUser.name}.`
      });

    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    }
  };


  const handleSubscribe = () => {
    setIsSubscribed(true);
    setShowSubscriptionDialog(false);
    toast({
        title: 'Subscription Successful!',
        description: 'You now have access to all premium features.',
    });
  }

  const handleAddCar = () => {
    if (!isSubscribed) {
      setSubscriptionDialogContent({
        title: 'Add Another Car',
        description: 'Subscribe to Lane Choice Premium for $4.99/month to add multiple cars to your garage.',
      });
      setShowSubscriptionDialog(true);
    } else {
      toast({ title: "Feature unlocked!", description: "You can now add more cars." });
    }
  };

  const handleAddPhotos = () => {
     if (!authUser) return;
     const fileInput = document.createElement('input');
     fileInput.type = 'file';
     fileInput.multiple = true;
     fileInput.accept = "image/png, image/jpeg, image/webp";
     fileInput.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;
        
        if (!isSubscribed && files.length > 4) {
             setSubscriptionDialogContent({
                title: 'Add More Photos',
                description: 'Subscribe to Lane Choice Premium for $4.99/month to add more than 4 photos per car.',
             });
             setShowSubscriptionDialog(true);
             return;
        }

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const storageRef = ref(storage, `garage-photos/${authUser.uid}/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            });
            const photoUrls = await Promise.all(uploadPromises);
            
            const userDocRef = doc(db, 'users', authUser.uid);
            await updateDoc(userDocRef, {
                garagePhotos: arrayUnion(...photoUrls)
            });
            
            toast({ title: "Photos Uploaded", description: "Your new garage photos have been added." });

        } catch (error) {
            console.error("Error uploading garage photos:", error);
            toast({ title: "Upload Failed", description: "Could not upload your photos.", variant: "destructive" });
        }
     }
     fileInput.click();
  };

  const handleSaveChanges = async () => {
    if (!authUser || !appUser) {
        toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive"});
        return;
    }

    try {
        const userDocRef = doc(db, 'users', authUser.uid);
        let profilePicUrl = appUser.avatarUrl;
        let coverPhotoUrl = appUser.coverUrl;

        if (profilePicFile) {
            const storageRef = ref(storage, `profile-pictures/${authUser.uid}`);
            await uploadBytes(storageRef, profilePicFile);
            profilePicUrl = await getDownloadURL(storageRef);
        }
        if (coverPhotoFile) {
            const storageRef = ref(storage, `cover-photos/${authUser.uid}`);
            await uploadBytes(storageRef, coverPhotoFile);
            coverPhotoUrl = await getDownloadURL(storageRef);
        }

        await updateDoc(userDocRef, {
            name: name,
            bio: bio,
            location: location,
            avatarUrl: profilePicUrl,
            coverUrl: coverPhotoUrl,
        });

        setShowEditDialog(false);
        toast({
            title: 'Profile Updated',
            description: 'Your profile information has been saved successfully.'
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: "Update Failed", description: "Could not update profile.", variant: "destructive" });
    }
  }

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Card>
                <Skeleton className="h-36 md:h-48 w-full rounded-t-lg" />
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-end -mt-16 sm:-mt-20">
                         <Skeleton className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-card" />
                    </div>
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                     <div className="flex gap-6 mt-4 pt-4 border-t">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!appUser) {
    return <div className="text-center py-12">Please log in to view your profile.</div>;
  }
  
  const garagePhotos = appUser.garagePhotos || [];
  const displayGaragePhotos = garagePhotos.length > 0 ? garagePhotos : Array(4).fill("https://placehold.co/400x400");


  return (
    <>
      <div className="space-y-6">
        <Card>
          <div className="h-36 md:h-48 bg-muted relative rounded-t-lg">
            <Image
              src={appUser.coverUrl || "https://placehold.co/1200x300"}
              alt="Cover photo"
              className="object-cover rounded-t-lg"
              fill
              data-ai-hint="car garage"
            />
          </div>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-end -mt-16 sm:-mt-20">
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-card">
                <AvatarImage src={appUser.avatarUrl} alt={appUser.name} />
                <AvatarFallback className="text-4xl">{appUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-auto flex items-center gap-2">
                {isOwnProfile ? (
                    <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                ) : (
                    <Button onClick={handleFollowToggle} variant={isFollowing ? 'secondary' : 'default'}>
                      {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      {isFollowing ? 'Following' : (isPrivate ? 'Request to Follow' : 'Follow')}
                    </Button>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                  {appUser.name}
                  {appUser.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />}
                </h1>
                {isPrivate && <Lock className="h-5 w-5 text-muted-foreground" />}
              </div>
              <p className="text-muted-foreground">@{appUser.handle}</p>
              <p className="mt-2 text-sm">{appUser.bio || 'No bio available.'}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4" /> {appUser.raceCarName || '1966 Ford Mustang'}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {appUser.location || 'Location not set'}
                </div>
                 {appUser.instagramUrl && (
                    <div className="flex items-center gap-1">
                        <InstagramIcon className="h-4 w-4" />
                        <Link href={appUser.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {appUser.handle}
                        </Link>
                    </div>
                 )}
              </div>
            </div>
            <div className="flex gap-6 mt-4 pt-4 border-t">
              <div>
                <p className="font-bold">{userPosts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="font-bold">{(appUser.followerCount || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-bold">{(appUser.followingCount || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isPrivate && !isOwnProfile && !isFollowing ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <Lock className="h-8 w-8 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">This Account is Private</h2>
            <p>Follow this account to see their posts and garage.</p>
          </div>
        ) : (
          <Tabs defaultValue="posts" className="mt-6">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="garage">Garage</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {userPosts.length === 0 && <p className="text-muted-foreground text-center py-12">No posts yet.</p>}
              </div>
            </TabsContent>
            <TabsContent value="garage" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={handleAddCar}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Car
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">{appUser.raceCarName || '1966 Ford Mustang'}</h2>
                      <Button variant="outline" onClick={handleAddPhotos}>
                        <Camera className="mr-2 h-4 w-4" /> Add Photos
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {displayGaragePhotos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image
                            src={photo}
                            alt={`Garage photo ${index + 1}`}
                            fill
                            className="rounded-lg object-cover"
                            data-ai-hint="classic mustang"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="bg-muted p-3 rounded-lg">
                              <Trophy className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{event.name}</CardTitle>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{event.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No event history yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{subscriptionDialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {subscriptionDialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubscribe}>Subscribe Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <Input type="file" accept="image/*" onChange={(e) => setProfilePicFile(e.target.files ? e.target.files[0] : null)} />
                  </div>
                  <div className="space-y-2">
                      <Label>Cover Photo</Label>
                      <Input type="file" accept="image/*" onChange={(e) => setCoverPhotoFile(e.target.files ? e.target.files[0] : null)} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="name-edit">Name</Label>
                      <Input id="name-edit" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="bio-edit">Bio</Label>
                      <Textarea id="bio-edit" value={bio} onChange={e => setBio(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="location-edit">Location</Label>
                      <Input id="location-edit" value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
              </div>
              <DialogFooter>
                  <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
