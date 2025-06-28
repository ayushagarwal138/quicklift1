import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Car, 
  Phone, 
  MessageCircle, 
  Navigation,
  User,
  Star,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const TripTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState('driver-assigned'); // driver-assigned, driver-arriving, trip-started, trip-completed
  const [driverInfo, setDriverInfo] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    vehicleNumber: 'MH-12-AB-1234',
    vehicleModel: 'Swift Dzire',
    rating: 4.8,
    totalRides: 1250,
    eta: '5 min',
    distance: '1.2 km'
  });
  const [tripProgress, setTripProgress] = useState({
    pickupLocation: '',
    destination: '',
    distance: '8.5 km',
    duration: '15 min',
    fare: 0
  });

  useEffect(() => {
    if (location.state?.bookingDetails) {
      const details = location.state.bookingDetails;
      setTripProgress({
        pickupLocation: details.pickupLocation,
        destination: details.destination,
        distance: details.distance || '8.5 km',
        duration: details.duration || '15 min',
        fare: details.fare?.total || 0
      });
    }

    // Simulate trip progress
    const progressInterval = setInterval(() => {
      setTripStatus(prevStatus => {
        switch (prevStatus) {
          case 'driver-assigned':
            return 'driver-arriving';
          case 'driver-arriving':
            setTimeout(() => setTripStatus('trip-started'), 5000);
            return 'driver-arriving';
          case 'trip-started':
            setTimeout(() => setTripStatus('trip-completed'), 10000);
            return 'trip-started';
          default:
            return prevStatus;
        }
      });
    }, 3000);

    return () => clearInterval(progressInterval);
  }, [location.state]);

  const getStatusMessage = () => {
    switch (tripStatus) {
      case 'driver-assigned':
        return 'Driver has been assigned to your trip';
      case 'driver-arriving':
        return 'Driver is on the way to pickup location';
      case 'trip-started':
        return 'Trip in progress - heading to destination';
      case 'trip-completed':
        return 'Trip completed successfully';
      default:
        return 'Processing your request';
    }
  };

  const getStatusIcon = () => {
    switch (tripStatus) {
      case 'driver-assigned':
        return <Car className="w-6 h-6 text-blue-600" />;
      case 'driver-arriving':
        return <Navigation className="w-6 h-6 text-orange-600" />;
      case 'trip-started':
        return <MapPin className="w-6 h-6 text-green-600" />;
      case 'trip-completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const handleCallDriver = () => {
    window.open(`tel:${driverInfo.phone}`, '_self');
  };

  const handleMessageDriver = () => {
    // In a real app, this would open a chat interface
    alert('Chat feature coming soon!');
  };

  const handleEmergency = () => {
    // In a real app, this would trigger emergency protocols
    alert('Emergency contact: 100 (Police) or 108 (Ambulance)');
  };

  if (tripStatus === 'trip-completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Completed!</h2>
          <p className="text-gray-600 mb-6">Thank you for choosing our service.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Fare:</span>
              <span className="font-bold text-lg">₹{tripProgress.fare?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Distance: {tripProgress.distance}</span>
              <span>Duration: {tripProgress.duration}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/book')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              Book Another Ride
            </button>
            <button
              onClick={() => navigate('/history')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              View Trip History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Trip in Progress</h1>
                <p className="text-sm text-gray-600">{getStatusMessage()}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/book')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Book New Ride
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Live Map View</p>
                  <p className="text-sm text-gray-500">Real-time driver location</p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-medium">Pickup</span>
                  </div>
                  <span className="text-gray-600">{tripProgress.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="font-medium">Destination</span>
                  </div>
                  <span className="text-gray-600">{tripProgress.destination}</span>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety & Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleEmergency}
                  className="flex items-center p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-red-900">Emergency</div>
                    <div className="text-sm text-red-700">Get immediate help</div>
                  </div>
                </button>
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Trip Protection</div>
                    <div className="text-sm text-gray-600">24/7 safety monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Driver Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Driver</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{driverInfo.name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {driverInfo.rating} ({driverInfo.totalRides} rides)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Car className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{driverInfo.vehicleModel}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{driverInfo.vehicleNumber}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-900">ETA to pickup:</span>
                    <span className="font-medium text-blue-900">{driverInfo.eta}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-blue-700">Distance:</span>
                    <span className="text-blue-700">{driverInfo.distance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Driver</h3>
              <div className="space-y-3">
                <button
                  onClick={handleCallDriver}
                  className="w-full flex items-center justify-center p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Driver
                </button>
                <button
                  onClick={handleMessageDriver}
                  className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message Driver
                </button>
              </div>
            </div>

            {/* Trip Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{tripProgress.distance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{tripProgress.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fare:</span>
                  <span className="font-medium text-green-600">₹{tripProgress.fare?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripTracking; 