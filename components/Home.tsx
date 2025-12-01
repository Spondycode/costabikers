import React from 'react';
import { Trip, Member, TabView } from '../types';
import { Calendar, MapPin, ChevronRight, Navigation, Clock, PlusCircle } from 'lucide-react';

interface HomeProps {
  user: Member;
  upcomingTrip?: Trip;
  pastTrips: Trip[];
  onNavigate: (tab: TabView) => void;
}

const Home: React.FC<HomeProps> = ({ user, upcomingTrip, pastTrips, onNavigate }) => {
  const recentTrips = pastTrips.slice(0, 3); // Show last 3 trips

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Hola, <span className="text-bike-orange">{user.name}</span>
          </h1>
          <p className="text-gray-400 text-sm">Ready to ride with Costa Brava Bikers?</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-full border border-gray-700">
             <img src={user.bikeImageUrl} alt="My Bike" className="w-12 h-12 rounded-full object-cover" />
        </div>
      </div>

      {/* Next Ride Card */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white uppercase italic tracking-wide">Next Mission</h2>
            {upcomingTrip && (
                <button 
                    onClick={() => onNavigate('next-trip')}
                    className="text-xs font-bold text-bike-orange hover:text-white flex items-center gap-1 transition-colors"
                >
                    View Full Details <ChevronRight size={14} />
                </button>
            )}
        </div>
        
        {upcomingTrip ? (
            <div 
                onClick={() => onNavigate('next-trip')}
                className="group relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700 cursor-pointer"
            >
                <img 
                    src={upcomingTrip.coverImage} 
                    alt={upcomingTrip.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="inline-flex items-center gap-2 bg-bike-orange text-black px-3 py-1 rounded-full text-xs font-bold uppercase mb-3">
                        <Navigation size={14} /> {upcomingTrip.distanceKm} km
                    </div>
                    <h3 className="text-3xl font-black text-white italic tracking-tight mb-2 group-hover:text-bike-orange transition-colors">{upcomingTrip.title}</h3>
                    
                    <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-bike-orange" /> 
                            {new Date(upcomingTrip.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} className="text-bike-orange" /> 
                            {new Date(upcomingTrip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-1 text-gray-400 text-xs">
                        <MapPin size={12} /> {upcomingTrip.startLocation} &rarr; {upcomingTrip.endLocation}
                    </div>
                </div>
            </div>
        ) : (
            <div 
                onClick={() => onNavigate('next-trip')}
                className="group relative h-48 w-full rounded-2xl overflow-hidden shadow-xl border-2 border-dashed border-gray-700 hover:border-bike-orange cursor-pointer bg-gray-800/50 flex flex-col items-center justify-center transition-all"
            >
                <div className="bg-gray-800 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                     <PlusCircle size={32} className="text-gray-500 group-hover:text-bike-orange" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 group-hover:text-white uppercase italic">No Upcoming Ride</h3>
                <p className="text-xs text-gray-500 mt-1">Tap to plan the next adventure</p>
            </div>
        )}
      </section>

      {/* Recent History */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white uppercase italic tracking-wide">Recent History</h2>
            <button 
                onClick={() => onNavigate('past-trips')}
                className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
            >
                View Archive <ChevronRight size={14} />
            </button>
        </div>

        {recentTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentTrips.map(trip => (
                    <div 
                        key={trip.id}
                        onClick={() => onNavigate('past-trips')}
                        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
                    >
                        <div className="h-32 relative">
                            <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-3">
                                <span className="text-xs font-bold text-gray-300">{new Date(trip.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-white text-sm truncate">{trip.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">{trip.startLocation}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-sm italic">No past trips recorded yet.</p>
        )}
      </section>
      
      {/* Quick Action / CTA */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 flex items-center justify-between">
            <div>
                <h4 className="font-bold text-white">Have a say?</h4>
                <p className="text-xs text-gray-400">Vote on the next adventure.</p>
            </div>
            <button 
                onClick={() => onNavigate('polls')}
                className="bg-gray-700 hover:bg-bike-orange hover:text-black text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors"
            >
                Go to Polls
            </button>
      </div>
    </div>
  );
};

export default Home;