
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Calendar, MapPin, UserPlus, UserCheck, CheckCircle, LogOut, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, increment, arrayUnion, arrayRemove, addDoc, serverTimestamp } from 'firebase/firestore';
import type { User, Club, Event, Group } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { groups as hardcodedGroups } from '@/lib/data';

function SearchComponent() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);
  const { appUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === '') {
        setUsers([]);
        setClubs([]);
        setEvents([]);
        setGroups([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      // Client-side search for hardcoded groups
      const lowercasedTerm = searchTerm.toLowerCase();
      const filteredGroups = hardcodedGroups.filter(
          group => group.name.toLowerCase().includes(lowercasedTerm) || group.description.toLowerCase().includes(lowercasedTerm)
      );
      setGroups(filteredGroups);

      try {
        // Search Users by name
        const usersQuery = query(collection(db, 'users'), orderBy('name'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersData);

        // Search Clubs by name
        const clubsQuery = query(collection(db, 'clubs'), orderBy('name'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        const clubsSnapshot = await getDocs(clubsQuery);
        const clubsData = clubsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
        setClubs(clubsData);
        
        // Search Events by name
        const eventsQuery = query(collection(db, 'events'), orderBy('name'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(eventsData);

      } catch (error) {
        console.error("Error searching Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        handleSearch();
    }, 500); // Debounce search to avoid too many queries

    return () => clearTimeout(debounceTimer);

  }, [searchTerm]);

  const handleFollowToggle = async (targetUser: User) => {
    if (!appUser) {
        toast({ title: "Not Authenticated", description: "You must be logged in to follow users.", variant: "destructive"});
        return;
    }

    const currentUserRef = doc(db, 'users', appUser.id);
    const targetUserRef = doc(db, 'users', targetUser.id);
    const isFollowing = appUser.followingRefs?.some(ref => ref.id === targetUser.id);

    try {
        if (isFollowing) {
            await updateDoc(currentUserRef, { followingRefs: arrayRemove(targetUserRef), followingCount: increment(-1) });
            await updateDoc(targetUserRef, { followerRefs: arrayRemove(currentUserRef), followerCount: increment(-1) });
            toast({ title: "Unfollowed", description: `You are no longer following ${targetUser.name}.`});
        } else {
            await updateDoc(currentUserRef, { followingRefs: arrayUnion(targetUserRef), followingCount: increment(1) });
            await updateDoc(targetUserRef, { followerRefs: arrayUnion(currentUserRef), followerCount: increment(1) });
            await addDoc(collection(db, 'notifications'), {
                recipientRef: targetUserRef,
                senderRef: currentUserRef,
                senderName: appUser.name,
                senderAvatarUrl: appUser.avatarUrl,
                type: 'follow',
                read: false,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Followed", description: `You are now following ${targetUser.name}.`});
        }
    } catch (error) {
        console.error("Error following user:", error);
        toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    }
  }

  const handleJoinLeaveClub = async (club: Club) => {
    if (!appUser) {
      toast({ title: 'Not logged in', description: 'You must be logged in to join or leave a club.', variant: 'destructive' });
      return;
    }

    const clubRef = doc(db, 'clubs', club.id);
    const userRef = doc(db, 'users', appUser.id);
    const isMember = club.memberRefs?.some(ref => ref.id === appUser.id);

    try {
      if (isMember) {
        await updateDoc(clubRef, { memberRefs: arrayRemove(userRef), memberCount: increment(-1) });
        toast({ title: 'Club Left', description: `You have left ${club.name}.`});
      } else {
         if (club.isPrivate) {
             const hasRequested = club.joinRequestRefs?.some(ref => ref.id === appUser.id);
             if (!hasRequested) {
                await updateDoc(clubRef, { joinRequestRefs: arrayUnion(userRef) });
                toast({ title: 'Request Sent!', description: `Your request to join "${club.name}" has been sent for approval.` });
             }
         } else {
            await updateDoc(clubRef, { memberRefs: arrayUnion(userRef), memberCount: increment(1) });
            toast({ title: 'Club Joined!', description: `Welcome to ${club.name}!`});
         }
      }
    } catch (error) {
      console.error('Error joining/leaving club:', error);
      toast({ title: 'Error', description: 'Could not update your membership. Please try again.', variant: 'destructive'});
    }
  };

  const renderClubButton = (club: Club) => {
    if (!appUser) return <Button disabled>Join</Button>;
    if (club.ownerRef?.id === appUser.id) return <Button variant="outline" disabled>Owner</Button>;
    
    const isMember = club.memberRefs?.some(ref => ref.id === appUser.id);
    if (isMember) return <Button variant="secondary" onClick={() => handleJoinLeaveClub(club)}><LogOut className="mr-2 h-4 w-4" />Leave</Button>;

    if (club.isPrivate) {
        const hasRequested = club.joinRequestRefs?.some(ref => ref.id === appUser.id);
        if (hasRequested) return <Button variant="outline" disabled><CheckCircle className="mr-2 h-4 w-4" />Requested</Button>;
        return <Button onClick={() => handleJoinLeaveClub(club)}>Request to Join</Button>;
    }
    
    return <Button onClick={() => handleJoinLeaveClub(club)}>Join</Button>;
  }

  const renderContent = (type: 'users' | 'clubs' | 'events' | 'groups') => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Card>
      ));
    }
    
    if (!hasSearched) {
         return (
            <div className="text-center text-muted-foreground py-12">
                <SearchIcon className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Search Lane Choice</h3>
                <p>Find users, clubs, events, and groups.</p>
            </div>
        )
    }

    if (type === 'users') {
      if (users.length === 0) return <div className="text-center text-muted-foreground py-12">No users found.</div>;
      return (
        <div className="space-y-4">
          {users.map(user => {
            const isFollowing = appUser?.followingRefs?.some(ref => ref.id === user.id);
            return (
                <Card key={user.id}>
                <CardContent className="p-4 flex items-center gap-4">
                    <Link href={`/profile/${user.handle}`}>
                        <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/profile/${user.handle}`} className="hover:underline">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">@{user.handle}</p>
                      </Link>
                    </div>
                    {appUser && appUser.id !== user.id && (
                        <Button variant={isFollowing ? 'secondary' : 'default'} onClick={() => handleFollowToggle(user)}>
                            {isFollowing ? <UserCheck className="mr-2 h-4 w-4"/> : <UserPlus className="mr-2 h-4 w-4"/>}
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                    )}
                </CardContent>
                </Card>
            )
          })}
        </div>
      );
    }
    
    if (type === 'clubs') {
        if (clubs.length === 0) return <div className="text-center text-muted-foreground py-12">No clubs found.</div>
        return (
             <div className="space-y-4">
                {clubs.map(club => (
                    <Card key={club.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <Avatar className="h-12 w-12 rounded-md">
                                <AvatarImage src={club.bannerUrl} alt={club.name} className="object-cover" />
                                <AvatarFallback className="rounded-md">{club.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-bold">{club.name}</p>
                                <p className="text-sm text-muted-foreground">{club.memberCount} members</p>
                            </div>
                            {renderClubButton(club)}
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (type === 'groups') {
        if (groups.length === 0) return <div className="text-center text-muted-foreground py-12">No groups found.</div>
        return (
             <div className="space-y-4">
                {groups.map(group => (
                    <Card key={group.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <Avatar className="h-12 w-12 rounded-md">
                                <AvatarImage src={group.bannerUrl} alt={group.name} className="object-cover" />
                                <AvatarFallback className="rounded-md">{group.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-bold">{group.name}</p>
                                <p className="text-sm text-muted-foreground">{group.memberCount.toLocaleString()} members</p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/groups">
                                    View
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (type === 'events') {
      if (events.length === 0) return <div className="text-center text-muted-foreground py-12">No events found.</div>;
      return (
        <div className="space-y-4">
          {events.map(event => (
            <Card key={event.id}>
                <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for users, groups, clubs, or events..." 
          className="pl-10 text-lg h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          {renderContent('users')}
        </TabsContent>
        <TabsContent value="groups" className="mt-6">
          {renderContent('groups')}
        </TabsContent>
        <TabsContent value="clubs" className="mt-6">
          {renderContent('clubs')}
        </TabsContent>
        <TabsContent value="events" className="mt-6">
          {renderContent('events')}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchComponent />
        </Suspense>
    )
}
