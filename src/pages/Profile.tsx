import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  creditScore: number;
  accountBalance: number;
  accountCreated: string;
  profilePicture?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | {}>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Mock data - replace with actual API call
        const mockUserData: UserProfile = {
          id: 'USR12345',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, Anytown, ST 12345',
          creditScore: 720,
          accountBalance: 5000,
          accountCreated: '2023-08-15',
          profilePicture: 'https://via.placeholder.com/150'
        };

        // Simulate API delay
        setTimeout(() => {
          setProfile(mockUserData);
          setEditedProfile(mockUserData);
          setIsLoading(false);
        }, 800);

        // Uncomment for real API implementation
        // const response = await fetch('/api/user/profile');
        // if (!response.ok) throw new Error('Failed to fetch profile');
        // const data = await response.json();
        // setProfile(data);
        // setEditedProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      setIsLoading(true);
      
      // Mock API call - replace with actual update API
      setTimeout(() => {
        setProfile(prev => ({ ...prev, ...editedProfile } as UserProfile));
        setIsLoading(false);
        setIsEditing(false);
      }, 800);

      // Uncomment for real API implementation
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedProfile)
      // });
      // if (!response.ok) throw new Error('Failed to update profile');
      // const updatedProfile = await response.json();
      // setProfile(updatedProfile);
      // setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const viewTransactionHistory = () => {
    navigate('/transaction-history');
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 sm:mb-0 sm:mr-6">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">
                    {profile?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <p className="opacity-90">User ID: {profile?.id}</p>
              <p className="opacity-90">Member since: {profile?.accountCreated ? new Date(profile.accountCreated).toLocaleDateString() : ''}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            {!isLoading && (
              isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={(editedProfile as UserProfile).name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile?.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={(editedProfile as UserProfile).email || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile?.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={(editedProfile as UserProfile).phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile?.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={(editedProfile as UserProfile).address || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{profile?.address}</p>
              )}
            </div>
          </div>

          <hr className="my-6" />

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Credit Score</h3>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-800">{profile?.creditScore}</div>
                  <div className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Good</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Account Balance</h3>
                <div className="text-2xl font-bold text-gray-800">${profile?.accountBalance?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={viewTransactionHistory}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View Transaction History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;