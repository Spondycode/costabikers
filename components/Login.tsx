
import React, { useState } from 'react';
import { Member } from '../types';
import { Bike, Lock, ArrowLeft, ChevronRight, Key } from 'lucide-react';

interface LoginProps {
  onLogin: (member: Member) => void;
  members: Member[];
}

const Login: React.FC<LoginProps> = ({ onLogin, members }) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    // Check password (fallback to '1234' if not set in legacy data)
    const validPassword = selectedMember.password || '1234';
    
    if (password === validPassword) {
      onLogin(selectedMember);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleSelectMember = (member: Member) => {
      setSelectedMember(member);
      setPassword('');
      setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#111827] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-800 to-transparent opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-bike-orange rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="text-center mb-10 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-bike-orange/10 p-5 rounded-full inline-block mb-4 border border-bike-orange/30 shadow-2xl shadow-bike-orange/20">
           <Bike className="w-16 h-16 text-bike-orange" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Costa Brava <span className="text-bike-orange">Bikers</span></h1>
        <p className="text-gray-400 mt-2 font-medium tracking-wide text-sm uppercase">Official Club Portal</p>
      </div>

      <div className="w-full max-w-4xl z-10">
        {!selectedMember ? (
            // MEMBER SELECTION GRID
            <div className="animate-in fade-in zoom-in duration-500">
                 <p className="text-center text-gray-400 mb-6 text-sm">Select your rider profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {members.map((member) => (
                    <button
                        key={member.id}
                        onClick={() => handleSelectMember(member)}
                        className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/80 backdrop-blur border border-gray-700 hover:border-bike-orange hover:bg-gray-750 transition-all group text-left hover:shadow-lg hover:shadow-bike-orange/10 hover:-translate-y-1 duration-300"
                    >
                        <img 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        className="w-12 h-12 rounded-full border-2 border-gray-600 group-hover:border-bike-orange object-cover transition-colors" 
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-white group-hover:text-bike-orange transition-colors">{member.name}</h3>
                            <p className="text-xs text-gray-500">{member.bikeModel}</p>
                        </div>
                        <ChevronRight className="text-gray-600 group-hover:text-bike-orange opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" size={16} />
                    </button>
                    ))}
                </div>
            </div>
        ) : (
            // PASSWORD ENTRY
            <div className="max-w-md mx-auto bg-gray-800/90 backdrop-blur p-8 rounded-2xl border border-gray-700 shadow-2xl animate-in slide-in-from-right-8 duration-300">
                <button 
                    onClick={() => setSelectedMember(null)}
                    className="flex items-center gap-1 text-gray-500 hover:text-white text-xs font-bold uppercase mb-6 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to riders
                </button>

                <div className="flex flex-col items-center mb-6">
                    <img 
                        src={selectedMember.avatarUrl} 
                        alt={selectedMember.name} 
                        className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-xl object-cover mb-4" 
                    />
                    <h2 className="text-2xl font-black text-white uppercase italic">{selectedMember.name}</h2>
                    <p className="text-bike-orange text-xs font-bold uppercase tracking-wider">{selectedMember.bikeModel}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-gray-500" size={18} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            autoFocus
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-bike-orange focus:ring-1 focus:ring-bike-orange transition-all"
                        />
                    </div>
                    
                    {error && (
                        <div className="text-red-500 text-xs font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                             <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                             {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-bike-orange hover:bg-orange-600 text-black font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        <Key size={18} /> Authenticate
                    </button>
                    <p className="text-center text-gray-600 text-[10px] mt-2">Default password is '1234' for demo</p>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default Login;
