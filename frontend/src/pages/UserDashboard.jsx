import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, Zap, MapPin, Star, Shield, Phone, Truck } from 'lucide-react';
import UserHeader from '../components/Header';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Zap, title: 'Instant Booking', desc: 'Book your ride in seconds with our streamlined booking process', color: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' },
  { icon: MapPin, title: 'Real-time Tracking', desc: "Track your driver's location in real-time for peace of mind", color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
  { icon: Star, title: 'Rated Drivers', desc: 'All our drivers are verified and highly rated by customers', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
  { icon: Shield, title: 'Safe & Secure', desc: 'Your safety is our priority with secure payment and ride tracking', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
  { icon: Phone, title: '24/7 Support', desc: 'Round-the-clock customer support for any assistance you need', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
  { icon: Truck, title: 'Multiple Vehicles', desc: 'Choose from sedan, SUV, luxury, or motorcycle based on your needs', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
];

const UserDashboard = () => {
  const { user } = useAuth();
  
  return (
    <>
      <UserHeader />
      <div className="page-container">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-indigo-50 dark:from-surface-900 dark:via-surface-900 dark:to-surface-800" />
          <div className="absolute inset-0 bg-hero-pattern opacity-50" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-3">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''} 👋
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-5 leading-tight">
              Book Your Ride{' '}
              <span className="text-gradient from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">Instantly</span>
            </h1>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-10 max-w-2xl mx-auto">
              Experience seamless taxi booking with real-time tracking, secure payments, and professional drivers. Your journey starts with just one tap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="btn-primary btn-lg group">
                <Car className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                Book Now
              </Link>
              <Link to="/history" className="btn-secondary btn-lg">
                <Clock className="w-5 h-5" />
                View History
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="page-content py-16 sm:py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-3">
              Why Choose Our Service?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              We provide the best taxi booking experience with cutting-edge features
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card-hover p-6 text-center group">
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700" />
          <div className="absolute inset-0 bg-hero-pattern opacity-10" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready for Your Next Ride?
            </h2>
            <p className="text-lg text-brand-100 mb-8 max-w-lg mx-auto">
              Book your ride now and experience seamless transportation
            </p>
            <Link to="/book" className="inline-flex items-center gap-2 bg-white hover:bg-surface-50 text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
              Book Your Ride
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;