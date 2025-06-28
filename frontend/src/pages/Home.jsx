import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Clock, Star, Shield, Zap, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Book Your Ride
              <span className="text-blue-600 dark:text-blue-400"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience seamless taxi booking with real-time tracking, secure payments, and professional drivers. 
              Your journey starts with just one tap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                // Authenticated user - show booking options
                <>
                  <Link
                    to="/book"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Car className="w-5 h-5" />
                    Book Now
                  </Link>
                  <Link
                    to="/history"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    View History
                  </Link>
                </>
              ) : (
                // Unauthenticated user - show sign up options
                <>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Service?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We provide the best taxi booking experience with cutting-edge features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instant Booking</h3>
              <p className="text-gray-600 dark:text-gray-300">Book your ride in seconds with our streamlined booking process</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your driver's location in real-time for peace of mind</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Rated Drivers</h3>
              <p className="text-gray-600 dark:text-gray-300">All our drivers are verified and highly rated by customers</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safe & Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">Your safety is our priority with secure payment and ride tracking</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700">
              <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">Round-the-clock customer support for any assistance you need</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700">
              <div className="bg-indigo-100 dark:bg-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Multiple Vehicles</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose from sedan, SUV, luxury, or motorcycle based on your needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {user ? 'Ready for Your Next Ride?' : 'Ready to Start Your Journey?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {user 
              ? 'Book your ride now and experience seamless transportation'
              : 'Join thousands of satisfied customers who trust us for their daily commute'
            }
          </p>
          {user ? (
            <Link
              to="/book"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
            >
              Book Your Ride
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-block"
            >
              Get Started Today
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 