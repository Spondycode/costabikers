import React, { useState } from 'react';
import { Member } from '../types';
import { Shield, UserPlus, X, Save, Trash2 } from 'lucide-react';

interface AdminProps {
  members: Member[];
  currentUser: Member;
  onUpdateMember: (member: Member) => void;
  onAddMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
}

const Admin: React.FC<AdminProps> = ({ members, currentUser, onUpdateMember, onAddMember, onDeleteMember }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    password: '',
    role: 'member',
    avatarUrl: '',
    bikeModel: '',
    bikeImageUrl: '',
    address: '',
    lat: 41.9794,
    lng: 2.8214,
  });

  const handleAddMember = () => {
    if (!formData.name || !formData.password) {
      alert('Name and password are required');
      return;
    }

    const newMember: Member = {
      id: `m_${Date.now()}`,
      name: formData.name,
      password: formData.password,
      role: formData.role as 'admin' | 'member',
      avatarUrl: formData.avatarUrl || `https://picsum.photos/seed/${formData.name}/150/150`,
      bikeModel: formData.bikeModel || 'Unknown',
      bikeImageUrl: formData.bikeImageUrl || `https://picsum.photos/seed/${formData.name}bike/400/300`,
      address: formData.address || 'Unknown',
      lat: formData.lat || 41.9794,
      lng: formData.lng || 2.8214,
    };

    onAddMember(newMember);
    setShowAddForm(false);
    setFormData({
      name: '',
      password: '',
      role: 'member',
      avatarUrl: '',
      bikeModel: '',
      bikeImageUrl: '',
      address: '',
      lat: 41.9794,
      lng: 2.8214,
    });
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      onUpdateMember(editingMember);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (memberId === currentUser.id) {
      alert('You cannot delete yourself!');
      return;
    }
    if (confirm('Are you sure you want to delete this member?')) {
      onDeleteMember(memberId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-bike-orange p-3 rounded-lg">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Admin Panel</h1>
            <p className="text-sm text-gray-400">Manage club members</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-bike-orange text-black px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
        >
          <UserPlus size={20} />
          Add Member
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add New Member</h2>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Member name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password *</label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bike Model</label>
              <input
                type="text"
                value={formData.bikeModel}
                onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="e.g., Harley-Davidson Dyna"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Member address"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Avatar URL (optional)</label>
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Auto-generated if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bike Image URL (optional)</label>
              <input
                type="text"
                value={formData.bikeImageUrl}
                onChange={(e) => setFormData({ ...formData, bikeImageUrl: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>
          <button
            onClick={handleAddMember}
            className="mt-4 w-full bg-bike-orange text-black py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            Create Member
          </button>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Members ({members.length})</h2>
        {members.map((member) => (
          <div key={member.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            {editingMember?.id === member.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Edit Member</h3>
                  <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                      type="text"
                      value={editingMember.password || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Role</label>
                    <select
                      value={editingMember.role || 'member'}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as 'admin' | 'member' })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Bike Model</label>
                    <input
                      type="text"
                      value={editingMember.bikeModel}
                      onChange={(e) => setEditingMember({ ...editingMember, bikeModel: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input
                      type="text"
                      value={editingMember.address}
                      onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateMember}
                  className="w-full bg-bike-orange text-black py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full border-2 border-gray-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      {member.role === 'admin' && (
                        <span className="bg-bike-orange text-black text-xs px-2 py-1 rounded-full font-bold">ADMIN</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{member.bikeModel}</p>
                    <p className="text-xs text-gray-500">{member.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  {member.id !== currentUser.id && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 bg-red-900/50 hover:bg-red-900 rounded-lg text-red-400 hover:text-red-200 transition-colors"
                      title="Delete member"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
