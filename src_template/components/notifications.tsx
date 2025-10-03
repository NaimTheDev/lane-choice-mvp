
'use client';

import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, ThumbsUp, UserPlus, MessageSquare, PlusSquare, Flag, CalendarPlus, BellRing } from 'lucide-react';
import type { Notification } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

export function Notifications() {
  const { appUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!appUser) return;

    const userNotificationsRef = collection(db, 'notifications');
    const q = query(
      userNotificationsRef,
      where('recipientRef', '==', doc(db, 'users', appUser.id)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedNotifications: Notification[] = [];
      let unread = 0;
      for (const notifDoc of snapshot.docs) {
        const data = { id: notifDoc.id, ...notifDoc.data() } as Notification;
        
        // Fetch sender data if not already present
        if (data.senderRef && !data.sender) {
          const senderSnap = await getDoc(data.senderRef);
          if (senderSnap.exists()) {
            data.sender = senderSnap.data() as Notification['sender'];
            data.senderName = data.sender.name;
            data.senderAvatarUrl = data.sender.avatarUrl;
          }
        }
        
        fetchedNotifications.push(data);
        if (!data.read) {
          unread++;
        }
      };
      setNotifications(fetchedNotifications);
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [appUser]);

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      // Mark all as read
      notifications.forEach(async (notif) => {
        if (!notif.read) {
          const notifRef = doc(db, 'notifications', notif.id);
          await updateDoc(notifRef, { read: true });
        }
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'new_post':
        return <PlusSquare className="h-4 w-4 text-primary" />;
      case 'new_message':
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      case 'new_match':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'new_event':
        return <CalendarPlus className="h-4 w-4 text-indigo-500" />;
      case 'event_reminder':
        return <BellRing className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <p>
            <span className="font-semibold">{notification.senderName}</span> liked your post.
          </p>
        );
      case 'follow':
        return (
          <p>
            <span className="font-semibold">{notification.senderName}</span> started following you.
          </p>
        );
      case 'comment':
        return (
          <p>
            <span className="font-semibold">{notification.senderName}</span> commented on your post.
          </p>
        );
      case 'new_match':
         return (
          <p>
            You matched with <span className="font-semibold">{notification.senderName}</span>!
          </p>
        );
      default:
        return 'New notification';
    }
  };

  const getLink = (notification: Notification) => {
     switch (notification.type) {
      case 'like':
      case 'comment':
        return notification.postRef ? `/post/${notification.postRef.id}` : '#';
      case 'follow':
        return notification.sender ? `/profile/${notification.sender.handle}` : '#';
      case 'new_match':
      case 'new_message':
        return '/messages';
      case 'new_event':
      case 'event_reminder':
        return notification.eventRef ? `/events` : '#';
      default:
        return '#';
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild className="cursor-pointer">
              <Link href={getLink(notification)}>
                 <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 pt-1">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.senderAvatarUrl} alt={notification.senderName} />
                          <AvatarFallback>{notification.senderName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      {getMessage(notification)}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-sm text-center text-muted-foreground">
            You're all caught up!
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
