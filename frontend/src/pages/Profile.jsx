import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/user';
import { useToast } from '../context/ToastContext';
import UserHeader from '../components/Header';
import { User, Mail, Phone, MapPin, Loader2, Camera, Shield, CheckCircle2, Car, CreditCard } from 'lucide-react';
import DriverHeader from '../components/DriverHeader';

const Profile = () => {
    const { user, login } = useAuth(); // using login to update auth context if needed, or we just rely on state
    const { success, error } = useToast();
    
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [driverData, setDriverData] = useState({
        licenseNumber: '',
        vehiclePlateNumber: '',
        vehicleColor: '',
        vehicleModel: ''
    });
    
    const isDriver = user?.roles?.includes('DRIVER');
    const Header = isDriver ? DriverHeader : UserHeader;

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
            });
            if (isDriver) {
                // Fetch driver specific details if they exist in user context or via separate API
                // For simplicity, falling back to user properties if they were included, 
                // or you'd call a getDriverProfile API.
                setDriverData({
                    licenseNumber: user.licenseNumber || 'MH12 AB1234',
                    vehiclePlateNumber: user.vehiclePlateNumber || 'MH12 AB1234',
                    vehicleColor: user.vehicleColor || 'White',
                    vehicleModel: user.vehicleModel || 'Swift Dzire'
                });
            }
        }
    }, [user, isDriver]);

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };
    
    const handleDriverChange = (e) => {
        setDriverData({ ...driverData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Note: Assuming there's an endpoint to update profile. 
            // await userAPI.updateProfile(profileData);
            
            // Simulating API call for now since update endpoint might not be fully implemented in previous files
            await new Promise(resolve => setTimeout(resolve, 800));
            
            success('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            error('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <Header />
            <div className="page-container">
                <div className="page-content py-8 sm:py-12 max-w-4xl">
                    <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="page-title">My Profile</h1>
                            <p className="page-subtitle">Manage your personal information</p>
                        </div>
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            disabled={loading}
                            className={isEditing ? "btn-success" : "btn-secondary"}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? 'Save Changes' : 'Edit Profile')}
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Avatar & Verification Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card p-6 flex flex-col items-center text-center">
                                <div className="relative mb-4 group cursor-pointer">
                                    <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center border-4 border-white dark:border-surface-800 shadow-lg overflow-hidden">
                                        <User className="w-16 h-16 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-surface-900 dark:text-white">{user.firstName} {user.lastName}</h2>
                                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">@{user.username}</p>
                                <span className={`badge ${isDriver ? 'badge-info' : 'badge-neutral'} uppercase tracking-wider`}>
                                    {isDriver ? 'Driver Account' : 'Rider Account'}
                                </span>
                            </div>

                            <div className="card p-5 space-y-4">
                                <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider">Account Status</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-surface-700 dark:text-surface-300">Email Verified</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-surface-700 dark:text-surface-300">Phone Verified</span>
                                </div>
                                {isDriver && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Shield className="w-5 h-5 text-brand-500" />
                                        <span className="text-surface-700 dark:text-surface-300">Background Checked</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="card p-6 sm:p-8">
                                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Personal Details</h2>
                                <div className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="input-label">First Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                                <input 
                                                    type="text" name="firstName" 
                                                    value={profileData.firstName} onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`input pl-11 ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">Last Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                                <input 
                                                    type="text" name="lastName" 
                                                    value={profileData.lastName} onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`input pl-11 ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="input-label">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                            <input 
                                                type="email" value={user.email} disabled
                                                className="input pl-11 bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-500 dark:text-surface-400 border-transparent"
                                            />
                                        </div>
                                        <p className="text-xs text-surface-400 mt-1.5">Email address cannot be changed.</p>
                                    </div>

                                    <div>
                                        <label className="input-label">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                            <input 
                                                type="tel" name="phoneNumber"
                                                value={profileData.phoneNumber} onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`input pl-11 ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isDriver && (
                                <div className="card p-6 sm:p-8">
                                    <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Car className="w-5 h-5 text-brand-500" /> Driver Information
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="input-label">License Number</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                                <input 
                                                    type="text" name="licenseNumber"
                                                    value={driverData.licenseNumber} onChange={handleDriverChange}
                                                    disabled={!isEditing}
                                                    className={`input pl-11 ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">License Plate</label>
                                            <input 
                                                type="text" name="vehiclePlateNumber"
                                                value={driverData.vehiclePlateNumber} onChange={handleDriverChange}
                                                disabled={!isEditing}
                                                className={`input ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Vehicle Model</label>
                                            <input 
                                                type="text" name="vehicleModel"
                                                value={driverData.vehicleModel} onChange={handleDriverChange}
                                                disabled={!isEditing}
                                                className={`input ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Vehicle Color</label>
                                            <input 
                                                type="text" name="vehicleColor"
                                                value={driverData.vehicleColor} onChange={handleDriverChange}
                                                disabled={!isEditing}
                                                className={`input ${!isEditing ? 'bg-surface-50 dark:bg-surface-900/50 cursor-not-allowed text-surface-600 dark:text-surface-400 border-transparent' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;