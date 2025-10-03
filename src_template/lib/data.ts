

import type { User, Post, Club, Event, Notification, CarOfTheWeekEntry, Comment, VideoPost, Group } from './types';
import { doc } from 'firebase/firestore';
import { db } from './firebase';

// This file is now mostly deprecated in favor of fetching data directly from Firestore.
// It is kept for type reference and potential fallback data during development.

export const users: User[] = [
  { 
    id: 'u1', 
    name: 'Alex Ryder', 
    email: 'alex@example.com', 
    avatarUrl: 'https://placehold.co/100x100', 
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'ryderauto', 
    instagramUrl: 'https://instagram.com/ryderauto', 
    isPrivate: false, 
    isVerified: true, 
    raceTypes: ['1/4 mile', 'Roll Race'], 
    raceCarName: '1966 Ford Mustang', 
    raceCardImageUrls: ['https://placehold.co/600x800', 'https://placehold.co/600x800?text=2', 'https://placehold.co/600x800?text=3'], 
    raceCardDescription: 'Classic pony car with a modern heart. Ready to run.', 
    followerCount: 1200, 
    followingCount: 345,
    bio: 'Just a guy and his Mustang. Living one quarter-mile at a time. Chasing sunsets and burnt rubber.',
    location: 'Los Angeles, CA',
    garagePhotos: [
        'https://placehold.co/400x400',
        'https://placehold.co/400x400',
        'https://placehold.co/400x400',
        'https://placehold.co/400x400',
    ]
  },
  { 
    id: 'u2', 
    name: 'Mia Chen', 
    email: 'mia@example.com', 
    avatarUrl: 'https://placehold.co/100x100', 
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'miadrifts', 
    isVerified: true, 
    raceTypes: ['Drift'], 
    raceCarName: 'Nissan Silvia S15', 
    raceCardImageUrls: ['https://placehold.co/600x800'], 
    raceCardDescription: 'Lover of all things JDM. Catch me at the track going sideways.', 
    followerCount: 25000, 
    followingCount: 120,
    bio: 'JDM queen. Drifting is my therapy. Building my dream S15 one part at a time.',
    location: 'Tokyo, JP',
  },
  {
    id: 'u3',
    name: 'Ben Carter',
    email: 'ben@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'euroben',
    raceCarName: 'BMW M3 E92',
    followerCount: 5600,
    followingCount: 800,
    bio: 'German engineering enthusiast. All about clean builds and performance.',
    location: 'Munich, DE',
  },
  {
    id: 'u4',
    name: 'Chloe Davis',
    email: 'chloe@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'offroadchloe',
    raceCarName: 'Jeep Wrangler Rubicon',
    followerCount: 8900,
    followingCount: 210,
    bio: 'The trail is my happy place. If it has dirt, I\'m there. ⛰️',
    location: 'Moab, UT',
  },
  {
    id: 'u5',
    name: 'Marcus Holloway',
    email: 'marcus@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'tunerlife',
    raceCarName: 'Honda Civic Type R',
    followerCount: 15200,
    followingCount: 450,
    bio: 'VTEC kicked in, yo. Building and tuning with my crew.',
    location: 'San Francisco, CA',
  },
  {
    id: 'u6',
    name: 'Sophia Rossi',
    email: 'sophia@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'vintagevibes',
    raceCarName: 'Porsche 911 (964)',
    followerCount: 42000,
    followingCount: 99,
    bio: 'Curator of classic automotive elegance. Air-cooled forever.',
    location: 'Milan, IT',
  },
  {
    id: 'u7',
    name: 'Leo Garcia',
    email: 'leo@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'lowriderleo',
    raceCarName: '1964 Chevy Impala',
    followerCount: 7800,
    followingCount: 300,
    bio: 'Low and slow, that is the tempo. Hydraulics and custom paint.',
    location: 'East LA, CA',
  },
  {
    id: 'u8',
    name: 'Isabelle Dubois',
    email: 'isabelle@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'rallybelle',
    raceCarName: 'Subaru WRX STI',
    followerCount: 19500,
    followingCount: 600,
    bio: 'Life is too short to stay on the pavement. Co-driver and aspiring rally champion.',
    location: 'Monaco',
  },
   {
    id: 'u9',
    name: 'Kenji Tanaka',
    email: 'kenji@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'midnightkenji',
    raceCarName: 'Mazda RX-7 FD',
    followerCount: 33000,
    followingCount: 50,
    bio: 'Wankel enthusiast. Exploring the Wangan at night.',
    location: 'Yokohama, JP',
  },
  {
    id: 'u10',
    name: 'Fatima Al-Jamil',
    email: 'fatima@example.com',
    avatarUrl: 'https://placehold.co/100x100',
    coverUrl: 'https://placehold.co/1200x300',
    handle: 'desertdriver',
    raceCarName: 'Lamborghini Urus',
    followerCount: 55000,
    followingCount: 15,
    bio: 'Supercar adventures in the desert. Speed and luxury.',
    location: 'Dubai, UAE',
  }
];

const commentsP1: Comment[] = [
    {
        id: 'comment1',
        author: users[1], // Mia
        authorRef: doc(db, 'users', 'u2'), 
        text: 'Looks amazing! The scenery is perfect.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        replies: [
            {
                id: 'reply1',
                author: users[0], // Alex
                authorRef: doc(db, 'users', 'u1'),
                text: 'Thanks! It was a great drive.',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
                replies: []
            }
        ]
    },
    {
        id: 'comment2',
        author: users[2], // Ben
        authorRef: doc(db, 'users', 'u3'),
        text: 'Clean Mustang! Love the color.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        replies: []
    },
]

export const posts: Post[] = [
  {
    id: 'p1',
    author: users[0], // Alex
    authorRef: doc(db, 'users', 'u1'),
    content: 'Sunset drive with the classic. Nothing beats the feeling of an open road.',
    imageUrl: 'https://placehold.co/600x400',
    imageHint: 'classic car sunset',
    car: '1966 Ford Mustang',
    timestamp: '2h ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    likes: 124,
    likedBy: ['u2', 'u3', 'u5'],
    comments: commentsP1,
  },
  {
    id: 'p2',
    author: users[1], // Mia
    authorRef: doc(db, 'users', 'u2'),
    content: 'New aero parts finally installed on the S15! Ready for the next track day.',
    imageUrl: 'https://placehold.co/600x400',
    imageHint: 'nissan silvia modification',
    car: 'Nissan Silvia S15',
    timestamp: '5h ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    likes: 350,
    likedBy: ['u1', 'u5', 'u9'],
    comments: [],
  },
  {
    id: 'p3',
    author: users[3], // Chloe
    authorRef: doc(db, 'users', 'u3'),
    content: 'Got a little muddy today. The Wrangler didn\'t even break a sweat!',
    imageUrl: 'https://placehold.co/600x400',
    imageHint: 'jeep offroad mud',
    car: 'Jeep Wrangler Rubicon',
    timestamp: '1d ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    likes: 215,
    likedBy: ['u4', 'u8'],
    comments: [],
  },
   {
    id: 'p4',
    author: users[5], // Sophia
    authorRef: doc(db, 'users', 'u6'),
    content: 'A timeless design. Soaking in the morning light.',
    imageUrl: 'https://placehold.co/600x400',
    imageHint: 'porsche classic morning',
    car: 'Porsche 911 (964)',
    timestamp: '2d ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    likes: 890,
    likedBy: ['u1', 'u2', 'u3', 'u9'],
    comments: [],
  },
];

export const videoPosts: VideoPost[] = [
  {
    id: 'vp1',
    author: users[0],
    title: 'Mustang leaving the car show!',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://placehold.co/600x400',
    timestamp: '4h ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
    likes: 256,
    comments: [],
  },
  {
    id: 'vp2',
    author: users[1],
    title: 'Testing out the new drift setup',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://placehold.co/600x400',
    timestamp: '1d ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 1024,
    comments: [],
  },
    {
    id: 'vp3',
    author: users[8],
    title: 'Rally stage practice run',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://placehold.co/600x400',
    timestamp: '2d ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    likes: 876,
    comments: [],
  }
];

export const clubs: Club[] = [
    {
        id: 'c1',
        name: 'JDM Legends',
        description: 'A club for enthusiasts of Japanese Domestic Market cars. All models and makes welcome!',
        bannerUrl: 'https://placehold.co/800x450',
        bannerHint: 'japanese cars night',
        isPrivate: false,
        ownerRef: doc(db, 'users', 'u2'),
        memberRefs: [doc(db, 'users', 'u1'), doc(db, 'users', 'u2'), doc(db, 'users', 'u5'), doc(db, 'users', 'u9')],
        joinRequestRefs: [],
        memberCount: 4,
        createdAt: new Date() as any,
    },
    {
        id: 'c2',
        name: 'German Engineering Alliance',
        description: 'Celebrating the best of German automotive design and performance. BMW, Porsche, Audi, VW, and more.',
        bannerUrl: 'https://placehold.co/800x450',
        bannerHint: 'german cars highway',
        isPrivate: false,
        ownerRef: doc(db, 'users', 'u3'),
        memberRefs: [doc(db, 'users', 'u3'), doc(db, 'users', 'u6')],
        joinRequestRefs: [],
        memberCount: 2,
        createdAt: new Date() as any,
    },
    {
        id: 'c3',
        name: '4x4 Trailblazers',
        description: 'For those who believe the road less traveled is the only way. Off-roading, overlanding, and adventure.',
        bannerUrl: 'https://placehold.co/800x450',
        bannerHint: 'offroad adventure mountains',
        isPrivate: true,
        ownerRef: doc(db, 'users', 'u4'),
        memberRefs: [doc(db, 'users', 'u4'), doc(db, 'users', 'u8')],
        joinRequestRefs: [doc(db, 'users', 'u1')],
        memberCount: 2,
        createdAt: new Date() as any,
    }
];

export const groups: Group[] = [
    {
        id: 'g1',
        name: 'Street Racers',
        description: 'The official group for street racers. Share your slips, discuss tactics, and find your next race.',
        bannerUrl: 'https://placehold.co/800x450',
        bannerHint: 'street race night city',
        memberCount: 15600,
        members: ['u1', 'u5'],
    },
    {
        id: 'g2',
        name: 'Drifters',
        description: 'For those who live life sideways. Share your best drifts, tuning setups, and find drift events.',
        bannerUrl: 'https://placehold.co/800x450',
        bannerHint: 'car drifting smoke',
        memberCount: 28900,
        members: ['u2', 'u9'],
    },
    {
        id: 'g3',
        name: 'Show & Shine',
        description: 'This group is for the perfectionists. Show off your pristine builds, detailing work, and car show winners.',
        bannerUrl: 'https://placehold.co/800x450',
        bannerHint: 'car show polished',
        memberCount: 42300,
        members: ['u6', 'u7'],
    }
];

export const events: Event[] = [
    {
        id: 'e1',
        name: 'Cars & Coffee - Downtown',
        date: 'Saturday, Sep 21st, 8:00 AM',
        location: 'Central City Coffee Roasters',
        description: 'Join us for our weekly Cars & Coffee meetup. All are welcome. Please respect the property and no burnouts!',
        coverUrl: 'https://placehold.co/800x450',
        coverHint: 'cars coffee shop',
        attendees: [users[0], users[2], users[5]],
        attendeeRefs: [doc(db, 'users', 'u1'), doc(db, 'users', 'u3'), doc(db, 'users', 'u6')],
        attendeeCount: 3,
        createdAt: new Date() as any,
    },
    {
        id: 'e2',
        name: 'Midnight Touge Run',
        date: 'Friday, Sep 20th, 11:00 PM',
        location: 'Mount Akina Pass',
        description: 'A spirited drive through the mountain pass. Experienced drivers only. Safety is our top priority, respect the property and other drivers.',
        coverUrl: 'https://placehold.co/800x450',
        coverHint: 'car mountain night',
        attendees: [users[1], users[8]],
        attendeeRefs: [doc(db, 'users', 'u2'), doc(db, 'users', 'u9')],
        attendeeCount: 2,
        createdAt: new Date() as any,
    }
];

export const carOfTheWeekEntries: CarOfTheWeekEntry[] = [
    {
        id: 'cotw1',
        user: users[0],
        userRef: doc(db, 'users', 'u1'),
        carName: '1966 Ford Mustang',
        imageUrl: 'https://placehold.co/600x400',
        imageHint: 'classic mustang',
        votes: 128,
        wins: 2,
    },
    {
        id: 'cotw2',
        user: users[1],
        userRef: doc(db, 'users', 'u2'),
        carName: 'Nissan Silvia S15',
        imageUrl: 'https://placehold.co/600x400',
        imageHint: 'nissan silvia',
        votes: 95,
    },
    {
        id: 'cotw3',
        user: users[5],
        userRef: doc(db, 'users', 'u6'),
        carName: 'Porsche 911 (964)',
        imageUrl: 'https://placehold.co/600x400',
        imageHint: 'porsche classic',
        votes: 210,
        wins: 1,
    },
    {
        id: 'cotw4',
        user: users[6],
        userRef: doc(db, 'users', 'u7'),
        carName: '1964 Chevy Impala',
        imageUrl: 'https://placehold.co/600x400',
        imageHint: 'chevy impala',
        votes: 78,
    }
];

export const notifications: Notification[] = [];
    
