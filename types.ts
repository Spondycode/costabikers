
export interface Member {
  id: string;
  name: string;
  password?: string; // Added password field (optional for backwards compatibility with old data)
  role?: 'admin' | 'member'; // Role field (optional for backwards compatibility)
  avatarUrl: string;
  bikeModel: string;
  bikeImageUrl: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Comment {
  id: string;
  memberId: string;
  text: string;
  timestamp: number;
  imageUrl?: string;
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'past';
  description: string;
  aiBriefing?: string;
  distanceKm: number;
  startLocation: string;
  endLocation: string;
  coverImage: string;
  routeMapUrl?: string;
  gpxFile?: string; // GPX file data URL
  gpxFileName?: string; // Original filename
  externalLinks?: {
    platform: 'Relive' | 'Calimoto' | 'Strava' | 'Google Maps';
    url: string;
  }[];
  gallery?: string[];
  comments: Comment[];
  participants?: string[]; // Array of member IDs
}

export interface PollOption {
  id: string;
  title: string;       // Renamed from 'text' to 'title'
  description: string; // Added description
  votes: string[];     // Array of member IDs
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  active: boolean;
}

export type TabView = 'home' | 'next-trip' | 'past-trips' | 'members' | 'polls' | 'admin';
