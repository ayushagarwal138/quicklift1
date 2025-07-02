import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/user';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, MapPin, Edit, Save, X, Bell, Shield, CreditCard, Settings, LogOut, Camera } from 'lucide-react';

const Profile = () => {
  const { user, loading: authLoading, setUser: setAuthUser } = useAuth();
  const { success, error } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfilePicUrl, setNewProfilePicUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!authLoading) {
        setIsLoading(true);
        try {
          const profileData = await userAPI.getProfile();
          setUserData(profileData);
          setNewProfilePicUrl(profileData.profilePictureUrl || '');
        } catch (err) {
          error('Failed to fetch profile data.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [authLoading, error]);

  const handleSave = async () => {
    try {
      const updatedUser = await userAPI.updateProfile(userData);
      setUserData(updatedUser);
      // Update user in global context as well
      setAuthUser(prev => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      success('Profile updated successfully!');
    } catch (err) {
      error('Failed to update profile.');
    }
  };

  const handleCancel = async () => {
    setIsEditing(false);
    // Refetch original data
    const profileData = await userAPI.getProfile();
    setUserData(profileData);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  const handlePictureUpdate = async () => {
      if (!newProfilePicUrl) {
          error("Please enter a valid URL.");
          return;
      }
      try {
          const updatedUser = await userAPI.updateProfilePicture(newProfilePicUrl);
          setUserData(updatedUser);
          setAuthUser(prev => ({ ...prev, ...updatedUser }));
          setIsModalOpen(false);
          success('Profile picture updated!');
      } catch (err) {
          error('Failed to update profile picture.');
      }
  };

  const vehicleTypes = [
    { id: 'SEDAN', name: 'Sedan', icon: '🚗' },
    { id: 'SUV', name: 'SUV', icon: '🚙' },
    { id: 'LUXURY', name: 'Luxury', icon: '🏎️' },
    { id: 'MOTORCYCLE', name: 'Motorcycle', icon: '🏍️' },
    { id: 'VAN', name: 'Van', icon: '🚐' }
  ];

  if (authLoading || isLoading) {
    return <div className="text-center py-10">Loading Profile...</div>;
  }
  
  if (!userData) {
      return <div className="text-center py-10">Could not load profile.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
                {/* Profile Picture */}
                <div className="relative">
                  <img 
                    src={userData.profilePictureUrl || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&size=128`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500 ring-offset-2"
                  />
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-110">
                    <Camera className="w-5 h-5"/>
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={isEditing ? userData.firstName : userData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={isEditing ? userData.lastName : userData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={isEditing ? userData.email : userData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={isEditing ? userData.phone : userData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          value={isEditing ? userData.address : userData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows="3"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={isEditing ? userData.emergencyContact : userData.emergencyContact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
              
              <div className="space-y-6">
                {/* Vehicle Type Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Vehicle Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicleTypes.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'vehicleType', value: vehicle.id } })}
                        disabled={!isEditing}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          (isEditing ? userData.vehicleType : userData.vehicleType) === vehicle.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } disabled:opacity-50`}
                      >
                        <div className="text-xl mb-1">{vehicle.icon}</div>
                        <div className="text-sm font-medium">{vehicle.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive ride updates and promotions</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? userData.notifications : userData.notifications}
                        onChange={(e) => handleInputChange({ target: { name: 'notifications', value: e.target.checked } })}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Auto-Confirm Rides</p>
                        <p className="text-sm text-gray-600">Automatically confirm bookings</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? userData.autoConfirm : userData.autoConfirm}
                        onChange={(e) => handleInputChange({ target: { name: 'autoConfirm', value: e.target.checked } })}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Share Location</p>
                        <p className="text-sm text-gray-600">Share location with emergency contacts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing ? userData.shareLocation : userData.shareLocation}
                        onChange={(e) => handleInputChange({ target: { name: 'shareLocation', value: e.target.checked } })}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {userData.firstName} {userData.lastName}
                </h3>
                <p className="text-gray-600 mb-4">{userData.email}</p>
                <div className="text-sm text-gray-500">
                  Member since {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Methods</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <Shield className="w-5 h-5" />
                  <span>Privacy Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 