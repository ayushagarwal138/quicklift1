import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserHeader from '../components/Header';
import DriverHeader from '../components/DriverHeader';
import { Bell, Shield, Key, CreditCard, Moon, Globe, Trash2, Smartphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const Settings = () => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { success } = useToast();
    
    const [notifications, setNotifications] = useState({
        push: true,
        email: true,
        sms: false,
        promotions: false
    });

    const isDriver = user?.roles?.includes('DRIVER');
    const Header = isDriver ? DriverHeader : UserHeader;

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        success('Preferences updated');
    };

    const sections = [
        {
            title: 'Notifications',
            icon: Bell,
            items: [
                { id: 'push', label: 'Push Notifications', desc: 'Receive real-time updates about your rides on your device' },
                { id: 'email', label: 'Email Receipts', desc: 'Get ride receipts and trip summaries in your inbox' },
                { id: 'sms', label: 'SMS Alerts', desc: 'Receive text messages for driver arrival and delays' },
                { id: 'promotions', label: 'Promotions & Offers', desc: 'Get notified about discounts and special events' },
            ]
        },
        {
            title: 'Appearance',
            icon: Moon,
            content: (
                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                    <div>
                        <p className="font-semibold text-surface-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">Toggle dark theme for the application</p>
                    </div>
                    <div className={`toggle-track ${isDark ? 'toggle-track-active' : ''}`} onClick={toggleTheme}>
                        <div className={`toggle-thumb ${isDark ? 'toggle-thumb-active' : 'toggle-thumb-inactive'}`} />
                    </div>
                </div>
            )
        },
        {
            title: 'Security',
            icon: Shield,
            content: (
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Key className="w-5 h-5 text-surface-400" />
                            <div className="text-left">
                                <p className="font-semibold text-surface-900 dark:text-white">Change Password</p>
                                <p className="text-sm text-surface-500 dark:text-surface-400">Update your account password</p>
                            </div>
                        </div>
                        <span className="text-surface-400">→</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-surface-400" />
                            <div className="text-left">
                                <p className="font-semibold text-surface-900 dark:text-white">Two-Factor Authentication</p>
                                <p className="text-sm text-surface-500 dark:text-surface-400">Add an extra layer of security</p>
                            </div>
                        </div>
                        <span className="badge badge-neutral">Disabled</span>
                    </button>
                </div>
            )
        },
        {
            title: 'Danger Zone',
            icon: Trash2,
            content: (
                <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Delete Account</h4>
                    <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
                        Delete Account
                    </button>
                </div>
            )
        }
    ];

    if (!user) return null;

    return (
        <>
            <Header />
            <div className="page-container">
                <div className="page-content py-8 sm:py-12 max-w-3xl">
                    <div className="page-header mb-8">
                        <h1 className="page-title">Settings</h1>
                        <p className="page-subtitle">Manage your account preferences and settings</p>
                    </div>

                    <div className="space-y-8">
                        {sections.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <h3 className="text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-brand-500" />
                                        {section.title}
                                    </h3>
                                    
                                    {section.items ? (
                                        <div className="space-y-3">
                                            {section.items.map(item => (
                                                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                                                    <div>
                                                        <p className="font-semibold text-surface-900 dark:text-white">{item.label}</p>
                                                        <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
                                                    </div>
                                                    <div 
                                                        className={`toggle-track ${notifications[item.id] ? 'toggle-track-active' : ''}`} 
                                                        onClick={() => handleToggle(item.id)}
                                                    >
                                                        <div className={`toggle-thumb ${notifications[item.id] ? 'toggle-thumb-active' : 'toggle-thumb-inactive'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        section.content
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;