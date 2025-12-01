import React, { useState, useEffect, useRef } from 'react';
import { Trip, Member, Comment } from '../types';
import { getRouteAIAnalysis, getChatAssistantReply } from '../services/geminiService';
import { MapPin, Calendar, Navigation, Send, Camera, Bot, Edit2, Save, X, Clock, RefreshCw, CheckCircle, PlusCircle, Link as LinkIcon, Users, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface NextTripProps {
  trip?: Trip; // Can be undefined if no upcoming trip
  currentUser: Member;
  allMembers: Member[];
  onUpdateTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onTripCompleted?: () => void;
}

const NextTrip: React.FC<NextTripProps> = ({ trip, currentUser, allMembers, onUpdateTrip, onDeleteTrip, onTripCompleted }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback for "Create New" flow
  const handleCreateNew = () => {
    const newTrip: Trip = {
        id: `t_${Date.now()}`,
        title: 'New Adventure',
        date: new Date().toISOString(),
        status: 'upcoming',
        description: 'Plan the details for the next run.',
        distanceKm: 0,
        startLocation: 'Clubhouse',
        endLocation: 'TBD',
        coverImage: 'https://picsum.photos/seed/newtrip/800/400',
        comments: [],
        gallery: [],
        externalLinks: [],
        participants: [],
    };
    onUpdateTrip(newTrip);
  };

  if (!trip) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-in fade-in">
              <div className="bg-gray-800 p-8 rounded-full border-4 border-dashed border-gray-700">
                  <Navigation size={64} className="text-gray-600" />
              </div>
              <div className="text-center">
                  <h2 className="text-2xl font-black text-white italic uppercase">No Upcoming Rides</h2>
                  <p className="text-gray-400 mt-2 max-w-xs mx-auto">The road is calling. Time to plan the next mission for the pack.</p>
              </div>
              <button 
                onClick={handleCreateNew}
                className="bg-bike-orange text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg hover:shadow-orange-500/20"
              >
                  <PlusCircle size={20} /> Plan Next Adventure
              </button>
          </div>
      );
  }

  // We rely on trip.comments from props now for persistence
  const comments = trip.comments;
  const participants = trip.participants || [];
  const isJoined = participants.includes(currentUser.id);

  // Effect to generate AI briefing only if it doesn't exist yet
  useEffect(() => {
    let isMounted = true;
    
    // Only fetch if missing
    if (!trip.aiBriefing && !loadingAi && trip.distanceKm > 0) {
        const fetchAnalysis = async () => {
        setLoadingAi(true);
        const text = await getRouteAIAnalysis(trip.title, trip.startLocation, trip.endLocation, trip.distanceKm);
        if (isMounted) {
            // Persist the generated briefing to the trip object
            onUpdateTrip({ ...trip, aiBriefing: text });
            setLoadingAi(false);
        }
        };
        fetchAnalysis();
    }
    
    return () => { isMounted = false; };
  }, [trip.id, trip.aiBriefing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Comment = {
      id: Date.now().toString(),
      memberId: currentUser.id,
      text: newMessage,
      timestamp: Date.now(),
    };

    // Update parent state for persistence
    const updatedComments = [...comments, message];
    onUpdateTrip({ ...trip, comments: updatedComments });
    setNewMessage('');

    // Fun easter egg: If message contains "@AI", get a response
    if (message.text.toLowerCase().includes('@ai')) {
        const reply = await getChatAssistantReply(updatedComments.map(c => c.text));
        const aiMsg: Comment = {
            id: 'ai_' + Date.now(),
            memberId: 'ai', 
            text: reply,
            timestamp: Date.now() + 100 
        };
        // Update again with AI response
        onUpdateTrip({ ...trip, comments: [...updatedComments, aiMsg] });
    }
  };

  const getMember = (id: string) => {
    if (id === 'ai') return { name: 'Road Captain AI', avatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png' };
    return allMembers.find(m => m.id === id) || allMembers[0];
  };

  const handleSaveTrip = (updatedTrip: Trip) => {
    onUpdateTrip(updatedTrip);
    setIsEditing(false);
  };

  const handleCompleteTrip = () => {
      if (confirm("Are you sure you want to mark this ride as completed? It will be moved to the Archive.")) {
          // 1. Update status to past
          onUpdateTrip({ ...trip, status: 'past' });
          // 2. Close edit mode
          setIsEditing(false);
          // 3. Navigate to archive page
          if (onTripCompleted) {
            onTripCompleted();
          }
      }
  };

  const handleToggleJoin = () => {
      let newParticipants;
      if (isJoined) {
          // Leave
          newParticipants = participants.filter(id => id !== currentUser.id);
      } else {
          // Join
          newParticipants = [...participants, currentUser.id];
      }
      onUpdateTrip({ ...trip, participants: newParticipants });
  };

  const isAdmin = currentUser.role === 'admin';

  const handleDeleteTrip = () => {
    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      onDeleteTrip(trip.id);
    }
  };

  if (isEditing) {
    return (
        <EditTripForm 
            trip={trip} 
            currentUser={currentUser}
            onSave={handleSaveTrip} 
            onCancel={() => setIsEditing(false)} 
            onComplete={handleCompleteTrip}
            onDelete={isAdmin ? handleDeleteTrip : undefined}
        />
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700 group">
        <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        
        {/* Actions Top Right */}
        <div className="absolute top-4 right-4 z-20">
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-black/40 hover:bg-bike-orange hover:text-black text-white p-2 rounded-full backdrop-blur transition-all border border-white/20 shadow-lg hover:scale-105"
                title="Edit Ride Details"
            >
                <Edit2 size={20} />
            </button>
        </div>

        <div className="absolute bottom-0 left-0 p-6">
          <div className="inline-flex items-center gap-2 bg-bike-orange text-black px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
            <Navigation size={14} /> Upcoming Ride
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight">{trip.title}</h2>
          <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm md:text-base font-medium">
            <span className="flex items-center gap-1"><Calendar size={16} className="text-bike-orange" /> {new Date(trip.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock size={16} className="text-bike-orange" /> {new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="flex items-center gap-1"><MapPin size={16} className="text-bike-orange" /> {trip.startLocation} &rarr; {trip.endLocation}</span>
            <span className="flex items-center gap-1"><Navigation size={16} className="text-bike-orange" /> {trip.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Muster Station / Participants */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="text-bike-orange" /> Riders for Trip
              </h3>
              <button 
                onClick={handleToggleJoin}
                className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${isJoined ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' : 'bg-bike-orange text-black hover:bg-white'}`}
              >
                  {isJoined ? <><UserMinus size={14} /> Leave Ride</> : <><UserPlus size={14} /> I'm In!</>}
              </button>
          </div>
          
          {participants.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                  {participants.map(id => {
                      const member = getMember(id);
                      return (
                          <div key={id} className="flex flex-col items-center">
                              <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover" />
                              <span className="text-xs text-gray-400 font-bold mt-1">{member.name}</span>
                          </div>
                      );
                  })}
              </div>
          ) : (
              <p className="text-gray-500 italic text-sm">No riders confirmed yet. Be the first to join the pack!</p>
          )}
      </div>

      {/* AI Analysis Card (Editable via Form) */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Bot size={64} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Bot className="text-bike-orange" /> Road Captain's Briefing
        </h3>
        {loadingAi ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="text-xs text-gray-500 mt-2">Generating briefing...</div>
          </div>
        ) : (
          <p className="text-gray-300 italic leading-relaxed whitespace-pre-wrap">"{trip.aiBriefing || "Briefing pending..."}"</p>
        )}
      </div>

      {/* Discussion Board */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur rounded-t-xl">
          <h3 className="font-bold text-white">Ride Chat & Updates</h3>
          <p className="text-xs text-gray-400">Discuss route, packing, or meetup times. Tag @AI for help.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {comments.map((comment) => {
            const sender = getMember(comment.memberId);
            const isMe = comment.memberId === currentUser.id;
            const isAi = comment.memberId === 'ai';

            return (
              <div key={comment.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img src={sender.avatarUrl} alt={sender.name} className="w-10 h-10 rounded-full border border-gray-600 bg-gray-700 object-cover" />
                <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-bike-orange text-black rounded-tr-none' : isAi ? 'bg-indigo-900/50 border border-indigo-500/30 text-indigo-100 rounded-tl-none' : 'bg-gray-700 text-gray-200 rounded-tl-none'}`}>
                  {!isMe && <p className="text-xs font-bold mb-1 opacity-70">{sender.name}</p>}
                  <p className="text-sm">{comment.text}</p>
                  {comment.imageUrl && <img src={comment.imageUrl} className="mt-2 rounded-lg max-w-full" alt="attachment" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
              <Camera size={20} />
            </button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..." 
              className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-bike-orange"
            />
            <button type="submit" className="p-2 bg-bike-orange rounded-full text-black hover:bg-orange-600 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Internal Edit Form Component for Trip
export const EditTripForm: React.FC<{ 
    trip: Trip;
    currentUser: Member;
    onSave: (t: Trip) => void; 
    onCancel: () => void;
    onComplete?: () => void;
    onDelete?: () => void;
}> = ({ trip, currentUser, onSave, onCancel, onComplete, onDelete }) => {
    const [formData, setFormData] = useState<Trip>(trip);
    const [isRegenerating, setIsRegenerating] = useState(false);
    
    // Manage links state separately to make binding inputs easier
    const [reliveUrl, setReliveUrl] = useState(trip.externalLinks?.find(l => l.platform === 'Relive')?.url || '');
    const [calimotoUrl, setCalimotoUrl] = useState(trip.externalLinks?.find(l => l.platform === 'Calimoto')?.url || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegenerateBriefing = async () => {
        setIsRegenerating(true);
        const text = await getRouteAIAnalysis(formData.title, formData.startLocation, formData.endLocation, formData.distanceKm);
        setFormData(prev => ({ ...prev, aiBriefing: text }));
        setIsRegenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reconstruct externalLinks
        // Preserve any existing links that aren't Relive or Calimoto
        const otherLinks = formData.externalLinks?.filter(l => l.platform !== 'Relive' && l.platform !== 'Calimoto') || [];
        
        const newLinks = [...otherLinks];
        if (reliveUrl.trim()) newLinks.push({ platform: 'Relive', url: reliveUrl.trim() });
        if (calimotoUrl.trim()) newLinks.push({ platform: 'Calimoto', url: calimotoUrl.trim() });

        onSave({ ...formData, externalLinks: newLinks });
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Edit2 className="text-bike-orange" /> Edit Ride Details
                </h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-280px)] overflow-y-auto p-6 pt-4 pb-24 space-y-4 scrollbar-hide">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ride Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none font-bold text-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date & Time</label>
                        <input 
                            type="datetime-local" 
                            name="date" 
                            value={formData.date.slice(0, 16)} // Format for datetime-local
                            onChange={(e) => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Distance (km)</label>
                        <input 
                            type="number" 
                            name="distanceKm" 
                            value={formData.distanceKm} 
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Location</label>
                        <input 
                            type="text" 
                            name="startLocation" 
                            value={formData.startLocation} 
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Location</label>
                        <input 
                            type="text" 
                            name="endLocation" 
                            value={formData.endLocation} 
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                        />
                    </div>
                </div>

                {/* Editable Road Captain Briefing */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Road Captain's Briefing (AI)</label>
                        <button 
                            type="button" 
                            onClick={handleRegenerateBriefing}
                            disabled={isRegenerating}
                            className="text-[10px] text-bike-orange flex items-center gap-1 hover:text-white disabled:opacity-50"
                        >
                            <RefreshCw size={10} className={isRegenerating ? "animate-spin" : ""} /> Regenerate Text
                        </button>
                    </div>
                    <textarea 
                        name="aiBriefing" 
                        value={formData.aiBriefing || ''} 
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none text-sm leading-relaxed"
                        placeholder="AI briefing will appear here, or write your own..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description (Internal)</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-bike-orange focus:outline-none"
                    />
                </div>

                {/* Relive and Calimoto Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Relive URL</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon size={14} className="text-gray-500" />
                            </div>
                            <input 
                                type="url" 
                                value={reliveUrl} 
                                onChange={(e) => setReliveUrl(e.target.value)}
                                placeholder="https://relive.cc/..."
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 pl-9 text-white focus:border-bike-orange focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Calimoto URL</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon size={14} className="text-gray-500" />
                            </div>
                            <input 
                                type="url" 
                                value={calimotoUrl} 
                                onChange={(e) => setCalimotoUrl(e.target.value)}
                                placeholder="https://calimoto.com/..."
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 pl-9 text-white focus:border-bike-orange focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image</label>
                    <div className="space-y-3">
                        <ImageUpload
                            onImageUploaded={(url) => setFormData({ ...formData, coverImage: url })}
                            buttonText="Upload Cover Image"
                            showPreview={false}
                        />
                        <div className="flex items-start gap-3">
                            <div className="h-24 w-40 rounded overflow-hidden border-2 border-gray-700 bg-gray-900 shrink-0">
                                {formData.coverImage && (
                                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-gray-600 mb-1">Or paste URL:</label>
                                <input 
                                    type="text" 
                                    name="coverImage" 
                                    value={formData.coverImage} 
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-gray-400 text-sm focus:border-bike-orange focus:outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {onComplete && (
                    <div className="mt-8 border-t border-gray-700 pt-6">
                        <button
                            type="button"
                            onClick={onComplete}
                            className="w-full py-4 bg-green-600/10 text-green-500 border border-green-500/50 hover:bg-green-600 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                        >
                            <CheckCircle className="group-hover:scale-110 transition-transform" /> 
                            Mark Ride as Completed & Archive
                        </button>
                         <p className="text-center text-gray-500 text-xs mt-2">
                            This will move the current ride to the archive folder.
                        </p>
                    </div>
                )}

                {onDelete && (
                    <div className="mt-8 border-t border-gray-700 pt-6">
                        <button
                            type="button"
                            onClick={onDelete}
                            className="w-full py-4 bg-red-600/10 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                        >
                            <Trash2 className="group-hover:scale-110 transition-transform" size={20} /> 
                            Delete Trip Permanently
                        </button>
                         <p className="text-center text-gray-500 text-xs mt-2">
                            This action cannot be undone. The trip and all its data will be permanently deleted.
                        </p>
                    </div>
                )}

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
                        <Save size={18} /> Save Ride
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NextTrip;