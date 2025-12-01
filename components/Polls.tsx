
import React, { useState } from 'react';
import { Poll, Member, PollOption } from '../types';
import { BarChart2, CheckCircle, Circle, Send, Edit2, Plus, Trash2, X, Save } from 'lucide-react';

interface PollsProps {
  polls: Poll[];
  currentUser: Member;
  onUpdatePolls: (polls: Poll[]) => void;
}

const Polls: React.FC<PollsProps> = ({ polls, currentUser, onUpdatePolls }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Track selected option per poll before submission (pollId -> optionId)
  const [pendingSelections, setPendingSelections] = useState<Record<string, string>>({});

  // ---------------- VOTE MODE HANDLERS ---------------- //
  const handleSelect = (pollId: string, optionId: string) => {
    setPendingSelections(prev => ({
      ...prev,
      [pollId]: optionId
    }));
  };

  const handleSubmitVote = (pollId: string) => {
    const selectedOptionId = pendingSelections[pollId];
    if (!selectedOptionId) return;

    const updatedPolls = polls.map(poll => {
      if (poll.id !== pollId) return poll;

      // Update votes
      const newOptions = poll.options.map(opt => {
        // Remove user from any previous vote
        const newVotes = opt.votes.filter(id => id !== currentUser.id);
        
        // Add user to the new selected option
        if (opt.id === selectedOptionId) {
          return { ...opt, votes: [...newVotes, currentUser.id] };
        }
        return { ...opt, votes: newVotes };
      });

      return { ...poll, options: newOptions };
    });

    onUpdatePolls(updatedPolls);

    setPendingSelections(prev => {
        const newState = { ...prev };
        delete newState[pollId];
        return newState;
    });
  };

  // ---------------- EDIT MODE HANDLERS ---------------- //
  const handleSavePolls = (updatedPolls: Poll[]) => {
      onUpdatePolls(updatedPolls);
      setIsEditing(false);
  };

  if (isEditing) {
      return (
          <EditPollsView polls={polls} onSave={handleSavePolls} onCancel={() => setIsEditing(false)} />
      );
  }

  // ---------------- RENDER VOTE MODE ---------------- //
  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Road Consensus</h2>
        <div className="flex items-center gap-3">
            <div className="bg-bike-orange/10 text-bike-orange px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <BarChart2 size={14} /> {polls.filter(p => p.active).length} Active
            </div>
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full border border-gray-600 transition-colors"
                title="Edit Polls"
            >
                <Edit2 size={16} />
            </button>
        </div>
      </div>

      <div className="grid gap-8">
        {polls.length === 0 && (
            <div className="text-center py-10 bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-700">
                <p className="text-gray-400 mb-4">No active polls.</p>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="text-bike-orange font-bold text-sm hover:underline"
                >
                    Create a Poll
                </button>
            </div>
        )}

        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);
          
          // Determine current status
          const currentVoteOptionId = poll.options.find(opt => opt.votes.includes(currentUser.id))?.id;
          const pendingOptionId = pendingSelections[poll.id];
          const activeSelectionId = pendingOptionId || currentVoteOptionId;
          const isDirty = pendingOptionId && pendingOptionId !== currentVoteOptionId;

          return (
            <div key={poll.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-black text-white italic mb-6 border-b border-gray-700 pb-4">{poll.question}</h3>
              
              <div className="space-y-4">
                {poll.options.map((option) => {
                  const voteCount = option.votes.length;
                  const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
                  const isSelected = activeSelectionId === option.id;

                  return (
                    <div 
                      key={option.id} 
                      onClick={() => handleSelect(poll.id, option.id)}
                      className={`relative group cursor-pointer p-4 rounded-xl border-2 transition-all overflow-hidden ${isSelected ? 'border-bike-orange bg-bike-orange/5' : 'border-gray-700 hover:border-gray-500 bg-gray-900'}`}
                    >
                      <div className="flex items-start justify-between z-10 relative">
                        <div className="flex items-start gap-3 w-full">
                          <div className="mt-1">
                             {isSelected ? <CheckCircle className="text-bike-orange" size={22} /> : <Circle className="text-gray-600 group-hover:text-gray-400" size={22} />}
                          </div>
                          <div className="flex-1">
                             <h4 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-200'} transition-colors`}>{option.title}</h4>
                             <p className="text-sm text-gray-400 mt-1 leading-snug">{option.description}</p>
                          </div>
                        </div>
                        <span className="font-mono text-xl font-bold text-gray-500 ml-4">{percentage}%</span>
                      </div>
                      
                      {/* Progress Bar Background */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-gray-700/30 pointer-events-none transition-all duration-700 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                      
                      {/* Avatar Pile */}
                      {option.votes.length > 0 && (
                          <div className="mt-3 flex -space-x-2 pl-9">
                              {option.votes.slice(0, 5).map(voterId => (
                                  <div key={voterId} className="w-6 h-6 rounded-full bg-gray-600 border border-gray-800" />
                              ))}
                              {option.votes.length > 5 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center text-[10px] text-white">+{option.votes.length - 5}</div>
                              )}
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-700/50">
                <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                   Total Votes: {totalVotes}
                </div>
                
                {isDirty && (
                    <button 
                        onClick={() => handleSubmitVote(poll.id)}
                        className="bg-bike-orange hover:bg-orange-600 text-black font-bold py-2 px-8 rounded-full flex items-center gap-2 transition-all animate-in fade-in slide-in-from-right-4 shadow-lg hover:shadow-orange-500/20"
                    >
                        Submit Vote <Send size={16} />
                    </button>
                )}
                
                {!isDirty && currentVoteOptionId && (
                     <div className="text-sm text-green-500 flex items-center gap-2 font-bold bg-green-500/10 px-3 py-1 rounded-full">
                         <CheckCircle size={16} /> Vote Recorded
                     </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- EDIT MODE COMPONENT ---------------- //

interface EditPollsViewProps {
    polls: Poll[];
    onSave: (polls: Poll[]) => void;
    onCancel: () => void;
}

const EditPollsView: React.FC<EditPollsViewProps> = ({ polls: initialPolls, onSave, onCancel }) => {
    const [polls, setPolls] = useState<Poll[]>(initialPolls);

    const handleAddPoll = () => {
        const newPoll: Poll = {
            id: `p_${Date.now()}`,
            question: 'New Poll Question',
            active: true,
            options: [
                { id: `o_${Date.now()}_1`, title: 'Option 1', description: 'Description here...', votes: [] },
                { id: `o_${Date.now()}_2`, title: 'Option 2', description: 'Description here...', votes: [] }
            ]
        };
        setPolls([...polls, newPoll]);
    };

    const handleDeletePoll = (pollId: string) => {
        if (confirm('Delete this poll?')) {
            setPolls(polls.filter(p => p.id !== pollId));
        }
    };

    const handleQuestionChange = (pollId: string, text: string) => {
        setPolls(polls.map(p => p.id === pollId ? { ...p, question: text } : p));
    };

    const handleOptionChange = (pollId: string, optionId: string, field: 'title' | 'description', value: string) => {
        setPolls(polls.map(p => {
            if (p.id !== pollId) return p;
            return {
                ...p,
                options: p.options.map(o => o.id === optionId ? { ...o, [field]: value } : o)
            };
        }));
    };

    const handleAddOption = (pollId: string) => {
        setPolls(polls.map(p => {
            if (p.id !== pollId) return p;
            const newOption: PollOption = {
                id: `o_${Date.now()}`,
                title: 'New Option',
                description: 'Description...',
                votes: []
            };
            return { ...p, options: [...p.options, newOption] };
        }));
    };

    const handleDeleteOption = (pollId: string, optionId: string) => {
        setPolls(polls.map(p => {
            if (p.id !== pollId) return p;
            return { ...p, options: p.options.filter(o => o.id !== optionId) };
        }));
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                    <Edit2 className="text-bike-orange" /> Edit Polls
                </h2>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full">
                        <X size={20} />
                    </button>
                    <button 
                        onClick={() => onSave(polls)}
                        className="bg-bike-orange text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {polls.map((poll, pIndex) => (
                    <div key={poll.id} className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-2xl relative">
                        <button 
                            onClick={() => handleDeletePoll(poll.id)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete Poll"
                        >
                            <Trash2 size={20} />
                        </button>

                        <div className="mb-6 pr-8">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Poll Question</label>
                            <input 
                                type="text" 
                                value={poll.question}
                                onChange={(e) => handleQuestionChange(poll.id, e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white font-bold text-lg focus:border-bike-orange focus:outline-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Options</label>
                            {poll.options.map((option, oIndex) => (
                                <div key={option.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex gap-4 items-start group">
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            type="text" 
                                            value={option.title}
                                            onChange={(e) => handleOptionChange(poll.id, option.id, 'title', e.target.value)}
                                            placeholder="Option Title"
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm font-bold focus:border-bike-orange focus:outline-none"
                                        />
                                        <textarea 
                                            value={option.description}
                                            onChange={(e) => handleOptionChange(poll.id, option.id, 'description', e.target.value)}
                                            placeholder="Description..."
                                            rows={2}
                                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-300 text-xs focus:border-bike-orange focus:outline-none resize-none"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteOption(poll.id, option.id)}
                                        className="text-gray-600 hover:text-red-500 mt-2 opacity-50 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                onClick={() => handleAddOption(poll.id)}
                                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-bike-orange hover:border-bike-orange transition-all flex items-center justify-center gap-2 text-sm font-bold"
                            >
                                <Plus size={16} /> Add Option
                            </button>
                        </div>
                    </div>
                ))}

                <button 
                    onClick={handleAddPoll}
                    className="w-full py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <Plus size={20} /> Create New Poll
                </button>
            </div>
        </div>
    );
};

export default Polls;
