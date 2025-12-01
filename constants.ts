
import { Member, Trip, Poll } from './types';

export const MEMBERS: Member[] = [
  {
    id: 'admin',
    name: 'Club Admin',
    password: 'admin123',
    role: 'admin',
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/9703/9703596.png',
    bikeModel: 'Harley-Davidson CVO',
    bikeImageUrl: 'https://picsum.photos/seed/adminbike/400/300',
    address: 'Clubhouse HQ',
    lat: 41.9794,
    lng: 2.8214,
  },
  {
    id: 'm1',
    name: 'Jax',
    password: '1234',
    avatarUrl: 'https://picsum.photos/seed/jax/150/150',
    bikeModel: 'Harley-Davidson Dyna',
    bikeImageUrl: 'https://picsum.photos/seed/harley1/400/300',
    address: '123 Redwood Hwy, Charming, CA',
    lat: 38.0,
    lng: -121.0,
  },
  {
    id: 'm2',
    name: 'Chibs',
    password: '1234',
    avatarUrl: 'https://picsum.photos/seed/chibs/150/150',
    bikeModel: 'Triumph Tiger 1200',
    bikeImageUrl: 'https://picsum.photos/seed/triumph/400/300',
    address: '45 Glasgow Ln, Belfast, ME',
    lat: 44.4,
    lng: -69.0,
  },
  {
    id: 'm3',
    name: 'Tig',
    password: '1234',
    avatarUrl: 'https://picsum.photos/seed/tig/150/150',
    bikeModel: 'Ducati Multistrada',
    bikeImageUrl: 'https://picsum.photos/seed/ducati/400/300',
    address: '88 Speed St, Oakland, CA',
    lat: 37.8,
    lng: -122.2,
  },
  {
    id: 'm4',
    name: 'Opie',
    password: '1234',
    avatarUrl: 'https://picsum.photos/seed/opie/150/150',
    bikeModel: 'Indian Chief',
    bikeImageUrl: 'https://picsum.photos/seed/indian/400/300',
    address: '99 Pine Rd, Lodi, CA',
    lat: 38.1,
    lng: -121.2,
  },
  {
    id: 'm5',
    name: 'Bobby',
    password: '1234',
    avatarUrl: 'https://picsum.photos/seed/bobby/150/150',
    bikeModel: 'Honda Goldwing',
    bikeImageUrl: 'https://picsum.photos/seed/honda/400/300',
    address: '505 Elvis Blvd, Memphis, TN',
    lat: 35.1,
    lng: -90.0,
  },
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't_next',
    title: 'Coastal Highway Run',
    date: '2023-11-15T09:00:00',
    status: 'upcoming',
    description: 'A scenic ride down Highway 1. Breakfast at Alice\'s Restaurant before heading towards the coast.',
    distanceKm: 240,
    startLocation: 'Clubhouse HQ',
    endLocation: 'Big Sur Point',
    coverImage: 'https://picsum.photos/seed/hwy1/800/400',
    participants: ['m1', 'm2', 'm4'],
    comments: [
      { id: 'c1', memberId: 'm2', text: 'Does everyone have their rain gear?', timestamp: Date.now() - 1000000 },
      { id: 'c2', memberId: 'm1', text: 'Forecast looks clear, brother.', timestamp: Date.now() - 500000 },
    ],
  },
  {
    id: 't_past_1',
    title: 'Mountain Pass Loop',
    date: '2023-10-01T08:30:00',
    status: 'past',
    description: 'Twisty roads through the Sierra foothills. Challenging but rewarding.',
    distanceKm: 310,
    startLocation: 'Folsom',
    endLocation: 'Lake Tahoe',
    coverImage: 'https://picsum.photos/seed/mountain/800/400',
    externalLinks: [
      { platform: 'Relive', url: '#' },
      { platform: 'Calimoto', url: '#' }
    ],
    gallery: [
      'https://picsum.photos/seed/g1/400/300',
      'https://picsum.photos/seed/g2/400/300',
      'https://picsum.photos/seed/g3/400/300'
    ],
    participants: ['m1', 'm2', 'm3', 'm4', 'm5'],
    comments: [],
  },
  {
    id: 't_past_2',
    title: 'Desert Night Ride',
    date: '2023-09-12T18:00:00',
    status: 'past',
    description: 'Cool air night ride through the high desert.',
    distanceKm: 150,
    startLocation: 'Victorville',
    endLocation: 'Barstow',
    coverImage: 'https://picsum.photos/seed/desert/800/400',
    externalLinks: [
      { platform: 'Google Maps', url: '#' }
    ],
    gallery: [
      'https://picsum.photos/seed/g4/400/300',
      'https://picsum.photos/seed/g5/400/300'
    ],
    participants: ['m1', 'm3'],
    comments: [],
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: 'p1',
    question: 'Where is our next mission?',
    active: true,
    options: [
      { 
        id: 'o1', 
        title: 'Tossa de Mar Loop', 
        description: 'Beautiful coastal curves with a lunch stop at the castle. Can be busy with tourists.',
        votes: ['m1', 'm2'] 
      },
      { 
        id: 'o2', 
        title: 'Montseny Mountain Pass', 
        description: 'Technical twisties, cooler temperatures, and lush forest views. For the spirited riders.',
        votes: ['m3'] 
      },
      { 
        id: 'o3', 
        title: 'Girona Old Town Dash', 
        description: 'Relaxed highway cruise with a coffee stop in the square. Good for all skill levels.',
        votes: ['m4', 'm5'] 
      },
    ]
  }
];
