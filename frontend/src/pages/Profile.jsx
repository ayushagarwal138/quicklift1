import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Bell, Shield, CreditCard, Settings, LogOut } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown, City, State 12345',
    emergencyContact: '+1 (555) 987-6543',
    preferences: {
      vehicleType: 'SEDAN',
      notifications: true,
      autoConfirm: false,
      shareLocation: true
    }
  });

  const [tempData, setTempData] = useState({ ...userData });

  const handleEdit = () => {
    setTempData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData({
      ...tempData,
      [field]: value
    });
  };

  const handlePreferenceChange = (preference, value) => {
    setTempData({
      ...tempData,
      preferences: {
        ...tempData.preferences,
        [preference]: value
      }
    });
  };

  const vehicleTypes = [
    { id: 'SEDAN', name: 'Sedan', icon: '🚗' },
    { id: 'SUV', name: 'SUV', icon: '🚙' },
    { id: 'LUXURY', name: 'Luxury', icon: '🏎️' },
    { id: 'MOTORCYCLE', name: 'Motorcycle', icon: '🏍️' },
    { id: 'VAN', name: 'Van', icon: '🚐' }
  ];

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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
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
                    value={isEditing ? tempData.firstName : userData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={isEditing ? tempData.lastName : userData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                      value={isEditing ? tempData.email : userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      value={isEditing ? tempData.phone : userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
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
                      value={isEditing ? tempData.address : userData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
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
                    value={isEditing ? tempData.emergencyContact : userData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
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
                        onClick={() => handlePreferenceChange('vehicleType', vehicle.id)}
                        disabled={!isEditing}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          (isEditing ? tempData.preferences.vehicleType : userData.preferences.vehicleType) === vehicle.id
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
                        checked={isEditing ? tempData.preferences.notifications : userData.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
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
                        checked={isEditing ? tempData.preferences.autoConfirm : userData.preferences.autoConfirm}
                        onChange={(e) => handlePreferenceChange('autoConfirm', e.target.checked)}
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
                        checked={isEditing ? tempData.preferences.shareLocation : userData.preferences.shareLocation}
                        onChange={(e) => handlePreferenceChange('shareLocation', e.target.checked)}
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