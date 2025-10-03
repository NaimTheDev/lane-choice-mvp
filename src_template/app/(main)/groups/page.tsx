
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, LogOut, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';
import type { Group } from '@/lib/types';
import { groups as hardcodedGroups } from '@/lib/data';

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(hardcodedGroups);
  const [userGroupIds, setUserGroupIds] = useState<Set<string>>(new Set());
  const { appUser } = useAuth();

  useEffect(() => {
    // In a real app, you'd fetch the user's groups from Firestore.
    // For this simulation, we'll just manage it in local state.
    if (appUser) {
      const initialGroups = new Set<string>();
      // Example: if user is in 'Street Racers'
      if (appUser.id === 'u1' || appUser.id === 'u5') {
        initialGroups.add('g1');
      }
      setUserGroupIds(initialGroups);
    }
  }, [appUser]);

  const handleJoinLeave = (groupId: string) => {
    if (!appUser) {
      toast({ title: 'Not logged in', description: 'You must be logged in to join or leave a group.', variant: 'destructive' });
      return;
    }

    const newGroups = new Set(userGroupIds);
    let groupName = '';
    
    setGroups(currentGroups => currentGroups.map(g => {
        if (g.id === groupId) {
            groupName = g.name;
            const isMember = newGroups.has(groupId);
            if (isMember) {
                newGroups.delete(groupId);
                return { ...g, memberCount: g.memberCount - 1 };
            } else {
                newGroups.add(groupId);
                return { ...g, memberCount: g.memberCount + 1 };
            }
        }
        return g;
    }));

    setUserGroupIds(newGroups);

    toast({
      title: newGroups.has(groupId) ? 'Group Joined!' : 'Group Left',
      description: newGroups.has(groupId) ? `Welcome to ${groupName}!` : `You have left ${groupName}.`,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Official Groups</h1>
        <p className="text-muted-foreground mt-2">Join official communities for different styles of racing and car culture.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const isMember = userGroupIds.has(group.id);
          return (
            <Card key={group.id}>
              <CardHeader className="p-0">
                <div className="relative aspect-video w-full">
                  <Image
                    src={group.bannerUrl}
                    alt={`${group.name} banner`}
                    fill
                    className="object-cover rounded-t-lg"
                    data-ai-hint={group.bannerHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 flex items-center gap-2">
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{(group.memberCount || 0).toLocaleString()} members</span>
                </div>
                <Button 
                  onClick={() => handleJoinLeave(group.id)} 
                  variant={isMember ? 'secondary' : 'default'}
                  disabled={!appUser}
                >
                  {isMember ? <LogOut className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  {isMember ? 'Leave Group' : 'Join Group'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
