import React, { useState } from 'react';
import { Member } from '../types';
import { MapPin, User, Bike, ChevronLeft, Edit2, Save, X } from 'lucide-react';

interface MembersProps {
  members: Member[];
  currentUser: Member;
  onUpdateMember: (member: Member) => void;
}

const Members: React.FC<MembersProps> = ({ members, currentUser, onUpdateMember }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Helper to handle saving the edit form
  const handleSave = (updatedMember: Member) => {
    onUpdateMember(updatedMember);
    setIsEditing(false);
  };

  // 1. DETAIL & EDIT VIEW
  if (selectedMemberId) {
    const member = members.find(m => m.id === selectedMemberId);
    if (!member) return null;

    const isOwnProfile = currentUser.id === member.id;

    return (
      <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
            <button 
                onClick={() => { setSelectedMemberId(null); setIsEditing(false); }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ChevronLeft size={20} /> Back to Members
            </button>
            {isOwnProfile && !isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-bike-orange border border-bike-orange/30 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all"
                >
                    <Edit2 size={14} /> Edit Profile
                </button>
            )}
        </div>

        {isEditing ? (
            <EditProfileForm member={member} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        ) : (
            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                {/* Large Cover / Bike Image */}
                <div className="h-64 md:h-80 w-full relative">
                    <img src={member.bikeImageUrl} alt={member.bikeModel} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
                    
                    {/* Profile Overlay */}
                    <div className="absolute -bottom-12 left-6 md:left-10 flex items-end">
                         <img 
                            src={member.avatarUrl} 
                            alt={member.name} 
                            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-gray-800 shadow-xl object-cover bg-gray-700" 
                        />
                    </div>
                </div>

                <div className="pt-16 px-6 md:px-10 pb-8 space-y-6">
                    <div>
                        <h2 className="text-3xl font-black text-white">{member.name}</h2>
                        <div className="flex items-center gap-2 text-bike-orange font-bold text-sm uppercase tracking-wide mt-1">
                            <Bike size={16} /> {member.bikeModel}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Base Location</h3>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-bike-orange shrink-0" size={20} />
                                <div>
                                    <p className="text-gray-200">{member.address}</p>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(member.address)}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                                    >
                                        Open in Maps &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Placeholder for future stats or bio */}
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 flex flex-col justify-center">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Member Status</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-gray-300 font-medium">Active Rider</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // 2. LIST VIEW
  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Members ({members.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div 
            key={member.id} 
            onClick={() => setSelectedMemberId(member.id)}
            className="group cursor-pointer bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-bike-orange shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex h-32">
                {/* Left: Avatar & Info */}
                <div className="w-2/3 p-4 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full border border-gray-600 object-cover" />
                        <div>
                            <h3 className="font-bold text-lg text-white group-hover:text-bike-orange transition-colors">{member.name}</h3>
                            <p className="text-xs text-gray-400">{member.bikeModel}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <MapPin size={12} /> <span className="truncate">{member.address}</span>
                    </div>
                </div>

                {/* Right: Bike Image Slice */}
                <div className="w-1/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-transparent z-10" />
                    <img src={member.bikeImageUrl} alt={member.bikeModel} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
            </div>
            
            <div className="bg-gray-900/50 py-2 px-4 flex justify-between items-center text-xs text-gray-400 border-t border-gray-700 group-hover:bg-bike-orange/10 group-hover:text-bike-orange transition-colors">
                <span>View Full Profile</span>
                <span>&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Internal Edit Form Component
const EditProfileForm: React.FC<{ member: Member; onSave: (m: Member) => void; onCancel: () => void }> = ({ member, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Member>(member);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name / Handle</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Motorcycle Model</label>
                    <input 
                        type="text" 
                        name="bikeModel" 
                        value={formData.bikeModel} 
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Home Base (Address)</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Avatar URL</label>
                        <input 
                            type="text" 
                            name="avatarUrl" 
                            value={formData.avatarUrl} 
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 text-sm focus:border-bike-orange focus:outline-none"
                        />
                        <div className="mt-2 h-10 w-10 rounded-full overflow-hidden border border-gray-700">
                             <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bike Photo URL</label>
                        <input 
                            type="text" 
                            name="bikeImageUrl" 
                            value={formData.bikeImageUrl} 
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 text-sm focus:border-bike-orange focus:outline-none"
                        />
                        <div className="mt-2 h-16 w-full rounded overflow-hidden border border-gray-700">
                             <img src={formData.bikeImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex gap-3">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 py-3 bg-bike-orange text-black rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Members;