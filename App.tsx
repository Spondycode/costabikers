import React, { useState, useEffect } from 'react';
import { Member, TabView, Trip, Poll } from './types';
import { storage } from './services/storage';
import Login from './components/Login';
import NextTrip from './components/NextTrip';
import PastTrips from './components/PastTrips';
import Members from './components/Members';
import Polls from './components/Polls';
import Home from './components/Home';
import Admin from './components/Admin';
import { Navigation, Calendar, Users, BarChart2, LogOut, Bike, Home as HomeIcon, Shield } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state from storage (database)
  const [members, setMembers] = useState<Member[]>(() => storage.getMembers());
  const [trips, setTrips] = useState<Trip[]>(() => storage.getTrips());
  const [polls, setPolls] = useState<Poll[]>(() => storage.getPolls());
  
  const [user, setUser] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>('home'); // Default to Home

  const handleUpdateMember = (updatedMember: Member) => {
    const newMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setMembers(newMembers);
    storage.saveMembers(newMembers); // Persist to DB

    // If the currently logged in user is the one being updated, update that state too
    if (user && user.id === updatedMember.id) {
      setUser(updatedMember);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    const newTrips = trips.filter(t => t.id !== tripId);
    setTrips(newTrips);
    storage.saveTrips(newTrips);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    // Check if we are updating an existing trip or adding a new one (if id doesn't exist)
    const exists = trips.some(t => t.id === updatedTrip.id);
    let newTrips;
    if (exists) {
        newTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
    } else {
        newTrips = [...trips, updatedTrip];
    }
    setTrips(newTrips);
    storage.saveTrips(newTrips); // Persist to DB
  };

  const handleUpdatePolls = (updatedPolls: Poll[]) => {
    setPolls(updatedPolls);
    storage.savePolls(updatedPolls); // Persist to DB
  };

  const handleAddMember = (newMember: Member) => {
    const newMembers = [...members, newMember];
    setMembers(newMembers);
    storage.saveMembers(newMembers);
  };

  const handleDeleteMember = (memberId: string) => {
    const newMembers = members.filter(m => m.id !== memberId);
    setMembers(newMembers);
    storage.saveMembers(newMembers);
  };

  const isAdmin = user?.role === 'admin';

  if (!user) {
    return <Login onLogin={setUser} members={members} />;
  }

  const upcomingTrip = trips.find(t => t.status === 'upcoming');
  const pastTrips = trips.filter(t => t.status === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 font-sans selection:bg-bike-orange selection:text-black">
      
      {/* Top Bar (Mobile/Desktop) */}
      <header className="sticky top-0 z-50 bg-[#111827]/95 backdrop-blur border-b border-gray-800 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
             <div className="bg-bike-orange p-1.5 rounded-lg">
                <Bike className="text-black w-6 h-6" />
             </div>
             <h1 className="text-xl font-black italic tracking-tighter hidden sm:block">COSTA BRAVA <span className="text-bike-orange">BIKERS</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-white">{user.name}</p>
               <p className="text-xs text-gray-500">{user.bikeModel}</p>
             </div>
             <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-700" />
             <button 
                onClick={() => setUser(null)}
                className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
             >
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        {activeTab === 'home' && (
          <Home 
             user={user}
             upcomingTrip={upcomingTrip} 
             pastTrips={pastTrips}
             onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'next-trip' && (
          <NextTrip 
            trip={upcomingTrip} 
            currentUser={user} 
            allMembers={members} 
            onUpdateTrip={handleUpdateTrip}
            onDeleteTrip={handleDeleteTrip}
            onTripCompleted={() => setActiveTab('past-trips')}
          />
        )}
        {activeTab === 'past-trips' && (
          <PastTrips 
            trips={pastTrips} 
            currentUser={user}
            allMembers={members}
            onUpdateTrip={handleUpdateTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}
        {activeTab === 'members' && (
          <Members 
            members={members} 
            currentUser={user}
            onUpdateMember={handleUpdateMember}
          />
        )}
        {activeTab === 'polls' && (
          <Polls 
            polls={polls} 
            onUpdatePolls={handleUpdatePolls}
            currentUser={user} 
          />
        )}
        {activeTab === 'admin' && isAdmin && (
          <Admin 
            members={members}
            currentUser={user}
            onUpdateMember={handleUpdateMember}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </main>

      {/* Bottom Navigation (Mobile First Design) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 pb-safe">
        <div className="max-w-4xl mx-auto flex justify-around items-center p-2">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<HomeIcon size={24} />} 
            label="Home" 
          />
          <NavButton 
            active={activeTab === 'next-trip'} 
            onClick={() => setActiveTab('next-trip')} 
            icon={<Navigation size={24} />} 
            label="Next Run" 
          />
          <NavButton 
            active={activeTab === 'polls'} 
            onClick={() => setActiveTab('polls')} 
            icon={<BarChart2 size={24} />} 
            label="Vote" 
          />
          <NavButton 
            active={activeTab === 'members'} 
            onClick={() => setActiveTab('members')} 
            icon={<Users size={24} />} 
            label="Members" 
          />
          {isAdmin && (
            <NavButton 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')} 
              icon={<Shield size={24} />} 
              label="Admin" 
            />
          )}
          <NavButton 
            active={activeTab === 'past-trips'} 
            onClick={() => setActiveTab('past-trips')} 
            icon={<Calendar size={24} />} 
            label="Archive" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 w-full transition-all duration-300 ${active ? 'text-bike-orange' : 'text-gray-500 hover:text-gray-300'}`}
  >
    <div className={`transform transition-transform ${active ? 'scale-110' : ''}`}>
        {icon}
    </div>
    <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{label}</span>
  </button>
);

export default App;