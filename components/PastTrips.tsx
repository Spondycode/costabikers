
import React, { useState, useRef, useEffect } from 'react';
import { Trip, Member, Comment } from '../types';
import { ExternalLink, Map, Image as ImageIcon, MapPin, Camera, Edit2, MessageSquare, Send, Users } from 'lucide-react';
import { EditTripForm } from './NextTrip';

interface PastTripsProps {
  trips: Trip[];
  currentUser: Member;
  allMembers: Member[];
  onUpdateTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

const PastTrips: React.FC<PastTripsProps> = ({ trips, currentUser, allMembers, onUpdateTrip, onDeleteTrip }) => {
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [expandedChatTripId, setExpandedChatTripId] = useState<string | null>(null);
  
  // Mock image upload function to demonstrate persistence
  const handleAddPhoto = (trip: Trip) => {
    const mockNewImage = `https://picsum.photos/seed/${Date.now()}/400/300`;
    const updatedGallery = [...(trip.gallery || []), mockNewImage];
    onUpdateTrip({
        ...trip,
        gallery: updatedGallery
    });
  };

  const handleSaveEdit = (updatedTrip: Trip) => {
      onUpdateTrip(updatedTrip);
      setEditingTripId(null);
  };

  const isAdmin = currentUser.role === 'admin';

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      onDeleteTrip(tripId);
      setEditingTripId(null);
    }
  };

  const getMember = (id: string) => {
      return allMembers.find(m => m.id === id) || { name: 'Unknown', avatarUrl: '', id: 'unknown', bikeModel: '', bikeImageUrl: '', address: '', lat: 0, lng: 0 };
  };

  if (editingTripId) {
      const tripToEdit = trips.find(t => t.id === editingTripId);
      if (tripToEdit) {
          return (
              <div className="animate-in fade-in">
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Editing Archive</h2>
                  <EditTripForm 
                    trip={tripToEdit} 
                    currentUser={currentUser}
                    onSave={handleSaveEdit} 
                    onCancel={() => setEditingTripId(null)}
                    onDelete={isAdmin ? () => handleDeleteTrip(tripToEdit.id) : undefined}
                  />
              </div>
          )
      }
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Ride Archive</h2>
      
      <div className="grid gap-8">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-300 shadow-xl">
            {/* Header Image */}
            <div className="h-48 w-full relative group">
               <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-4">
                 <h3 className="text-2xl font-bold text-white">{trip.title}</h3>
                 <p className="text-gray-300 text-sm">{new Date(trip.date).toLocaleDateString()} • {trip.distanceKm}km</p>
               </div>
               
               {/* Edit Button */}
               <button 
                  onClick={() => setEditingTripId(trip.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-bike-orange hover:text-black text-white rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100"
                  title="Edit Past Ride"
               >
                   <Edit2 size={16} />
               </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-gray-400 italic">"{trip.description}"</p>

              {/* Participants List */}
              {trip.participants && trip.participants.length > 0 && (
                  <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Users size={12} /> The Pack
                      </h4>
                      <div className="flex -space-x-3 overflow-hidden py-1">
                          {trip.participants.map(id => {
                              const m = getMember(id);
                              if (m.id === 'unknown') return null;
                              return (
                                  <img 
                                    key={id} 
                                    src={m.avatarUrl} 
                                    alt={m.name} 
                                    title={m.name}
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800 object-cover" 
                                  />
                              );
                          })}
                      </div>
                  </div>
              )}

              {/* External Links */}
              {trip.externalLinks && trip.externalLinks.length > 0 && (
                <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Route Data</h4>
                   <div className="flex flex-wrap gap-2">
                     {trip.externalLinks.map((link, idx) => (
                       <a 
                        key={idx} 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-700 hover:bg-bike-orange hover:text-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                       >
                         {link.platform === 'Relive' && <ImageIcon size={14} />}
                         {link.platform === 'Calimoto' && <Map size={14} />}
                         {link.platform === 'Google Maps' && <MapPin size={14} />}
                         {link.platform}
                       </a>
                     ))}
                   </div>
                </div>
              )}

              {/* Gallery Grid */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Memories</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {trip.gallery && trip.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-900 relative group">
                        <img src={img} alt="Trip memory" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer" />
                    </div>
                ))}
                {/* Upload Placeholder */}
                    <div 
                        onClick={() => handleAddPhoto(trip)}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 hover:text-bike-orange hover:border-bike-orange transition-colors cursor-pointer bg-gray-900/50"
                        title="Upload Photo"
                    >
                    <Camera size={20} />
                    <span className="text-[10px] mt-1 font-medium">Add Photo</span>
                    </div>
                </div>
              </div>

              {/* Chat / Comments Toggle */}
              <div className="border-t border-gray-700 pt-4">
                  <button 
                    onClick={() => setExpandedChatTripId(expandedChatTripId === trip.id ? null : trip.id)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
                  >
                      <MessageSquare size={16} /> 
                      {trip.comments.length} Comments 
                      <span className="ml-auto text-xs font-bold uppercase text-bike-orange">
                          {expandedChatTripId === trip.id ? 'Close' : 'View & Discuss'}
                      </span>
                  </button>

                  {expandedChatTripId === trip.id && (
                      <div className="mt-4 bg-gray-900/50 rounded-lg p-4 animate-in slide-in-from-top-2">
                          <PastTripChat 
                            trip={trip} 
                            currentUser={currentUser} 
                            allMembers={allMembers} 
                            onUpdateTrip={onUpdateTrip} 
                          />
                      </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Chat Component for Past Trips (Simplified version of NextTrip chat)
const PastTripChat: React.FC<{ trip: Trip; currentUser: Member; allMembers: Member[]; onUpdateTrip: (t: Trip) => void }> = ({ trip, currentUser, allMembers, onUpdateTrip }) => {
    const [newMessage, setNewMessage] = useState('');
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: Comment = {
            id: Date.now().toString(),
            memberId: currentUser.id,
            text: newMessage,
            timestamp: Date.now(),
        };

        const updatedComments = [...trip.comments, message];
        onUpdateTrip({ ...trip, comments: updatedComments });
        setNewMessage('');
    };

    const getMember = (id: string) => {
        if (id === 'ai') return { name: 'Road Captain AI', avatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png' };
        return allMembers.find(m => m.id === id) || allMembers[0];
    };

    return (
        <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {trip.comments.length === 0 && <p className="text-xs text-gray-600 text-center py-4">No comments yet. Share a memory!</p>}
                {trip.comments.map((comment) => {
                    const sender = getMember(comment.memberId);
                    const isMe = comment.memberId === currentUser.id;
                    return (
                        <div key={comment.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <img src={sender.avatarUrl} className="w-6 h-6 rounded-full" alt="avatar" />
                            <div className={`p-2 rounded-lg text-xs ${isMe ? 'bg-bike-orange text-black' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="font-bold mb-0.5">{sender.name}</p>
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Add a comment..." 
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-bike-orange"
                />
                <button type="submit" className="p-2 bg-gray-700 rounded-lg text-white hover:bg-bike-orange hover:text-black transition-colors">
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};

export default PastTrips;
