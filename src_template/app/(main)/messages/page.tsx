
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, MessageCircle } from 'lucide-react';
import type { Conversation, Message, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const { appUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!appUser) return;

    setIsLoadingConvos(true);
    const userRef = doc(db, 'users', appUser.id);
    const q = query(collection(db, 'conversations'), where('participantRefs', 'array-contains', userRef));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convosData: Conversation[] = [];
      for (const convoDoc of snapshot.docs) {
        const data = convoDoc.data();
        const participantPromises = data.participantRefs
            .filter((ref: any) => ref.id !== appUser.id)
            .map((ref: any) => getDoc(ref));
        
        const participantDocs = await Promise.all(participantPromises);
        const participants = participantDocs.map(doc => doc.data() as User).filter(Boolean);

        convosData.push({
          id: convoDoc.id,
          participants,
          ...data,
        } as Conversation);
      }
      setConversations(convosData);
      setIsLoadingConvos(false);
    });

    return () => unsubscribe();
  }, [appUser]);

  useEffect(() => {
    if (activeConversation) {
      setIsLoadingMessages(true);
      const messagesQuery = query(collection(db, 'conversations', activeConversation.id, 'messages'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData: Message[] = [];
        snapshot.forEach(doc => {
            messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messagesData);
        setIsLoadingMessages(false);
      });
      return () => unsubscribe();
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async () => {
    if (!appUser || !activeConversation || !newMessage.trim()) return;

    const userRef = doc(db, 'users', appUser.id);
    const messagesCol = collection(db, 'conversations', activeConversation.id, 'messages');
    
    await addDoc(messagesCol, {
        senderRef: userRef,
        text: newMessage,
        createdAt: serverTimestamp(),
    });

    const convoRef = doc(db, 'conversations', activeConversation.id);
    await updateDoc(convoRef, {
        lastMessage: {
            text: newMessage,
            createdAt: serverTimestamp(),
            senderId: appUser.id,
        }
    });

    setNewMessage('');
  };
  
  const getOtherParticipant = (convo: Conversation) => {
      if (!appUser) return null;
      return convo.participants.find(p => p.id !== appUser.id);
  }

  const getTimestamp = (ts: any) => {
    if (!ts) return '';
    if (ts instanceof Date) {
      return formatDistanceToNow(ts, { addSuffix: true });
    }
    if (ts && typeof ts.toDate === 'function') {
      return formatDistanceToNow(ts.toDate(), { addSuffix: true });
    }
    return '';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          <div className="col-span-1 border-r">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <CardContent className="p-2">
              {isLoadingConvos ? (
                <div className="space-y-2 p-2">
                  {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1">
                  {conversations.map((convo) => {
                    const otherParticipant = getOtherParticipant(convo);
                    if (!otherParticipant) return null;

                    return (
                        <li key={convo.id}>
                            <Button
                            variant={convo.id === activeConversation?.id ? 'secondary' : 'ghost'}
                            className="w-full justify-start h-auto py-3"
                            onClick={() => setActiveConversation(convo)}
                            >
                            <Avatar className="mr-4">
                                <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name} />
                                <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-left w-full overflow-hidden">
                                <div className="flex justify-between items-center">
                                <p className="font-semibold">{otherParticipant.name}</p>
                                <p className="text-xs text-muted-foreground">{getTimestamp(convo.lastMessage?.createdAt)}</p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage?.text}</p>
                            </div>
                            </Button>
                        </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </div>
          <div className="col-span-2 flex flex-col h-full bg-muted/20">
            {activeConversation && getOtherParticipant(activeConversation) ? (
              <>
                <div className="p-4 border-b flex items-center gap-4 bg-background">
                  <Avatar>
                    <AvatarImage src={getOtherParticipant(activeConversation)?.avatarUrl} alt={getOtherParticipant(activeConversation)?.name} />
                    <AvatarFallback>{getOtherParticipant(activeConversation)?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">{getOtherParticipant(activeConversation)?.name}</h3>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {isLoadingMessages ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-2/3 rounded-lg" />
                            <Skeleton className="h-10 w-1/2 rounded-lg self-end ml-auto" />
                            <Skeleton className="h-12 w-3/4 rounded-lg" />
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isCurrentUser = message.senderRef.id === appUser?.id;
                            const participant = isCurrentUser ? appUser : getOtherParticipant(activeConversation);
                            return (
                                <div
                                key={message.id}
                                className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}
                                >
                                {!isCurrentUser && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={participant?.avatarUrl} alt={participant?.name} />
                                        <AvatarFallback>{participant?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                    'rounded-lg px-4 py-2 max-w-[80%] lg:max-w-md',
                                    isCurrentUser
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card'
                                    )}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                </div>
                            );
                        })
                    )}
                   <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t bg-background">
                  <div className="relative">
                     <Input 
                        placeholder="Type a message..." 
                        className="pr-12"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                     <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2" onClick={handleSendMessage}>
                        <Send className="h-5 w-5"/>
                        <span className="sr-only">Send</span>
                     </Button>
                  </div>
                </div>
              </>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold">Select a conversation</h3>
                  <p className="text-sm">Choose from your existing conversations to start chatting.</p>
               </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
