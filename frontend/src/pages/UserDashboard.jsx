import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, Zap, MapPin, Star, Shield, UserCheck, Phone, Truck } from 'lucide-react';
import UserHeader from '../components/Header';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-blue-500 mx-auto" />,
    title: 'Instant Booking',
    desc: 'Book your ride in seconds with our streamlined booking process',
  },
  {
    icon: <MapPin className="w-8 h-8 text-green-500 mx-auto" />,
    title: 'Real-time Tracking',
    desc: 'Track your driver\'s location in real-time for peace of mind',
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-400 mx-auto" />,
    title: 'Rated Drivers',
    desc: 'All our drivers are verified and highly rated by customers',
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-500 mx-auto" />,
    title: 'Safe & Secure',
    desc: 'Your safety is our priority with secure payment and ride tracking',
  },
  {
    icon: <Phone className="w-8 h-8 text-red-400 mx-auto" />,
    title: '24/7 Support',
    desc: 'Round-the-clock customer support for any assistance you need',
  },
  {
    icon: <Truck className="w-8 h-8 text-indigo-400 mx-auto" />,
    title: 'Multiple Vehicles',
    desc: 'Choose from sedan, SUV, luxury, or motorcycle based on your needs',
  },
];

const UserDashboard = () => {
  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Book Your Ride <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Experience seamless taxi booking with real-time tracking, secure payments, and professional drivers. Your journey starts with just one tap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow"
            >
              <Car className="w-5 h-5" />
              Book Now
            </Link>
            <Link
              to="/history"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center gap-2 shadow"
            >
              <Clock className="w-5 h-5" />
              View History
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Why Choose Our Service?</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            We provide the best taxi booking experience with cutting-edge features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-blue-600 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready for Your Next Ride?</h2>
          <p className="text-lg text-blue-100 mb-8">Book your ride now and experience seamless transportation</p>
          <Link
            to="/book"
            className="bg-white hover:bg-blue-50 text-blue-600 font-bold px-8 py-4 rounded-lg text-lg shadow transition-colors"
          >
            Book Your Ride
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserDashboard; 