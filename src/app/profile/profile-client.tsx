// src/app/profile/profile-client.tsx (Client Component)
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/client';

interface User {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  category: string[];
  max_priority: number | null;
}

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    category: '',
    max_priority: ''
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (error || !authUser) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const userId = authUser.id;

    try {
      const response = await fetch(`/api/profile/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        setOriginalUser(data.data);
        setFormData({
          first_name: data.data.first_name || '',
          last_name: data.data.last_name || '',
          date_of_birth: data.data.date_of_birth ?
            new Date(data.data.date_of_birth).toISOString().split('T')[0] : '',
          category: data.data.category.join(', '),
          max_priority: data.data.max_priority?.toString() || ''
        });
      } else {
        setError(data.error || 'Failed to fetch user profile');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const updateData = {
        first_name: formData.first_name.trim() || null,
        last_name: formData.last_name.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        category: formData.category.split(',').map(c => c.trim()).filter(c => c),
        max_priority: formData.max_priority ? parseInt(formData.max_priority) : null
      };

      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
        setOriginalUser(data.data);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalUser) {
      setFormData({
        first_name: originalUser.first_name || '',
        last_name: originalUser.last_name || '',
        date_of_birth: originalUser.date_of_birth ?
          new Date(originalUser.date_of_birth).toISOString().split('T')[0] : '',
        category: originalUser.category.join(', '),
        max_priority: originalUser.max_priority?.toString() || ''
      });
    }
    setIsEditing(false);
    setError('');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Profile Display/Edit Form */}
      {user && (
        <div className="space-y-6 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User ID (Read-only) */}
            <div className="md:col-span-2">
              <Label>User ID</Label>
              <Input value={user.id} readOnly className="bg-gray-50" />
            </div>

            {/* Created At (Read-only) */}
            <div className="md:col-span-2">
              <Label>Member Since</Label>
              <Input 
                value={formatDate(user.created_at)} 
                readOnly 
                className="bg-gray-50" 
              />
            </div>

            {/* First Name */}
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  first_name: e.target.value 
                }))}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  last_name: e.target.value 
                }))}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  date_of_birth: e.target.value 
                }))}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {/* Max Priority */}
            <div>
              <Label htmlFor="maxPriority">Max Priority</Label>
              <Input
                id="maxPriority"
                type="number"
                min="1"
                max="32767"
                value={formData.max_priority}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  max_priority: e.target.value 
                }))}
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            {/* Categories */}
            <div className="md:col-span-2">
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input
                id="categories"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value 
                }))}
                placeholder="e.g. work, personal, health"
                readOnly={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
