import React, { useState } from 'react';
import { Shield, Bell, Globe, Moon, Sun, Smartphone, Lock, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    account: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      language: 'en',
      timezone: 'UTC',
      currency: 'USD'
    },
    security: {
      twoFactorAuth: false,
      biometricLogin: true,
      sessionTimeout: 30,
      passwordChangeRequired: false
    },
    privacy: {
      shareLocation: true,
      shareTripHistory: false,
      allowAnalytics: true,
      allowCookies: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      reduceMotion: false
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'privacy', name: 'Privacy', icon: Lock },
    { id: 'appearance', name: 'Appearance', icon: Globe }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.account.emailNotifications}
                onChange={(e) => handleSettingChange('account', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.account.smsNotifications}
                onChange={(e) => handleSettingChange('account', 'smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Marketing Emails</p>
                <p className="text-sm text-gray-600">Receive promotional content</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.account.marketingEmails}
                onChange={(e) => handleSettingChange('account', 'marketingEmails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.account.language}
              onChange={(e) => handleSettingChange('account', 'language', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.account.currency}
              onChange={(e) => handleSettingChange('account', 'currency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Biometric Login</p>
                <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.biometricLogin}
                onChange={(e) => handleSettingChange('security', 'biometricLogin', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Share Location</p>
                <p className="text-sm text-gray-600">Allow location sharing during rides</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.shareLocation}
                onChange={(e) => handleSettingChange('privacy', 'shareLocation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Share Trip History</p>
                <p className="text-sm text-gray-600">Allow sharing trip data for analytics</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.shareTripHistory}
                onChange={(e) => handleSettingChange('privacy', 'shareTripHistory', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-600">Allow anonymous usage analytics</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.allowAnalytics}
                onChange={(e) => handleSettingChange('privacy', 'allowAnalytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  settings.appearance.theme === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  settings.appearance.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={settings.appearance.fontSize}
              onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-600">🎬</div>
              <div>
                <p className="font-medium text-gray-900">Reduce Motion</p>
                <p className="text-sm text-gray-600">Minimize animations and transitions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.reduceMotion}
                onChange={(e) => handleSettingChange('appearance', 'reduceMotion', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'account' && renderAccountSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 