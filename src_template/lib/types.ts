
import type { Timestamp, DocumentReference } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  coverUrl?: string;
  bio?: string;
  location?: string;
  instagramUrl?: string;
  isPrivate?: boolean;
  isVerified?: boolean;
  themeColor?: string;
  subscriptionTier?: 'free' | 'player' | 'enthusiast' | 'pro';
  raceTypes?: ('1/8 mile' | '1/4 mile' | 'Roll Race' | 'Drift')[];
  raceCardImageUrls?: string[];
  raceCarName?: string;
  raceCardDescription?: string;
  followerCount?: number;
  followingCount?: number;
  followingRefs?: DocumentReference[];
  followerRefs?: DocumentReference[];
  garagePhotos?: string[];
};

export type Comment = {
    id: string;
    author: User;
    authorRef: DocumentReference;
    text: string;
    timestamp: Timestamp | Date;
    replies?: Comment[];
}

export type Post = {
  id: string;
  author: User;
  authorRef?: DocumentReference;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  car?: string;
  timestamp: string;
  createdAt: Timestamp | Date;
  likes: number;
  likedBy: string[];
  comments: Comment[];
};

export type VideoPost = {
  id: string;
  author: User;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  timestamp: string;
  createdAt: Timestamp | Date;
  likes: number;
  comments: Comment[];
}

export type Club = {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  bannerHint?: string;
  isPrivate: boolean;
  ownerRef: DocumentReference;
  memberRefs: DocumentReference[];
  joinRequestRefs: DocumentReference[];
  memberCount: number;
  createdAt: Timestamp;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  bannerHint?: string;
  memberCount: number;
  members: string[]; // array of user ids
};

export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  coverUrl: string;
  coverHint?: string;
  attendeeRefs?: DocumentReference[];
  attendees?: User[];
  attendeeCount?: number;
  createdAt: Timestamp;
};

export type Message = {
  id: string;
  senderRef: DocumentReference;
  text: string;
  createdAt: Timestamp;
};

export type Conversation = {
  id: string;
  participantRefs: DocumentReference[];
  participants: User[]; // Denormalized for display
  lastMessage?: {
    text: string;
    createdAt: Timestamp;
    senderId: string;
  };
  messages: Message[];
};

export type Notification = {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'new_post' | 'new_message' | 'new_match' | 'new_event' | 'event_reminder';
  recipientRef: DocumentReference;
  senderRef: DocumentReference;
  sender?: User;
  postRef?: DocumentReference;
  eventRef?: DocumentReference;
  read: boolean;
  createdAt: Timestamp;
  // Denormalized data for easy display
  senderAvatarUrl?: string;
  senderName?: string;
  postContent?: string;
  eventName?: string;
};

export type CarOfTheWeekEntry = {
  id: string;
  user: User;
  userRef: DocumentReference;
  carName: string;
  imageUrl: string;
  imageHint: string;
  votes: number;
  wins?: number;
};
