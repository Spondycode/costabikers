
import { Member, Trip, Poll } from '../types';
import { MEMBERS, MOCK_TRIPS, INITIAL_POLLS } from '../constants';

const STORAGE_KEYS = {
  MEMBERS: 'cbb_members',
  TRIPS: 'cbb_trips',
  POLLS: 'cbb_polls',
  VERSION: 'cbb_version',
};

const CURRENT_VERSION = '1.1.0'; // Increment this when you want to reset data

// Check version and clear storage if needed (only in production)
const checkVersion = () => {
  // Skip version check in development mode
  if (import.meta.env.DEV) {
    return;
  }
  
  try {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (storedVersion !== CURRENT_VERSION) {
      console.log('Version mismatch, resetting storage...');
      localStorage.clear();
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    }
  } catch (e) {
    console.error('Failed to check version', e);
  }
};

export const storage = {
  getMembers: (): Member[] => {
    checkVersion();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      let members = data ? JSON.parse(data) : MEMBERS;
      
      // Ensure Admin always exists (checks if 'admin' id is missing from stored data and adds it)
      const defaultAdmin = MEMBERS.find(m => m.id === 'admin');
      if (defaultAdmin && !members.find((m: Member) => m.id === 'admin')) {
          members = [defaultAdmin, ...members];
          localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
      }
      
      return members;
    } catch (e) {
      console.error("Failed to load members from storage", e);
      return MEMBERS;
    }
  },
  saveMembers: (members: Member[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error("Failed to save members to storage", e);
    }
  },
  getTrips: (): Trip[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return data ? JSON.parse(data) : MOCK_TRIPS;
    } catch (e) {
      console.error("Failed to load trips from storage", e);
      return MOCK_TRIPS;
    }
  },
  saveTrips: (trips: Trip[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error("Failed to save trips to storage", e);
    }
  },
  getPolls: (): Poll[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POLLS);
      return data ? JSON.parse(data) : INITIAL_POLLS;
    } catch (e) {
      console.error("Failed to load polls from storage", e);
      return INITIAL_POLLS;
    }
  },
  savePolls: (polls: Poll[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.POLLS, JSON.stringify(polls));
    } catch (e) {
      console.error("Failed to save polls to storage", e);
    }
  },
};
