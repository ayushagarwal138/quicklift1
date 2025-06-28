import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Clock, Search, Navigation } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import CitySelector from '../components/CitySelector';

const BookRide = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    vehicleType: 'SEDAN',
    notes: ''
  });

  const [pickupCity, setPickupCity] = useState(null);
  const [destinationCity, setDestinationCity] = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const vehicleTypes = [
    { id: 'SEDAN', name: 'Sedan', icon: '🚗', price: 'Base fare', description: 'Comfortable 4-seater' },
    { id: 'SUV', name: 'SUV', icon: '🚙', price: '+20%', description: 'Spacious 6-seater' },
    { id: 'LUXURY', name: 'Luxury', icon: '🏎️', price: '+50%', description: 'Premium experience' },
    { id: 'MOTORCYCLE', name: 'Motorcycle', icon: '🏍️', price: '-30%', description: 'Quick & economical' },
    { id: 'VAN', name: 'Van', icon: '🚐', price: '+40%', description: 'Group travel' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePickupCitySelect = (city) => {
    setPickupCity(city);
  };

  const handleDestinationCitySelect = (city) => {
    setDestinationCity(city);
  };

  const calculateDistance = (city1, city2) => {
    if (!city1 || !city2) return 0;
    
    const R = 6371; // Earth's radius in kilometers
    const lat1 = city1.latitude;
    const lon1 = city1.longitude;
    const lat2 = city2.latitude;
    const lon2 = city2.longitude;
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSearch = () => {
    if (!formData.pickupLocation || !formData.destination) {
      error('Please enter both pickup and destination locations');
      return;
    }
    
    setIsSearching(true);
    info('Searching for available rides...');
    
    // Calculate distance and fare based on selected cities
    setTimeout(() => {
      const distance = calculateDistance(pickupCity, destinationCity);
      const baseFare = Math.max(15, distance * 2); // Minimum fare of 15, 2 per km
      const vehicleMultiplier = {
        'SEDAN': 1,
        'SUV': 1.2,
        'LUXURY': 1.5,
        'MOTORCYCLE': 0.7,
        'VAN': 1.4
      };
      
      const fare = baseFare * vehicleMultiplier[formData.vehicleType];
      const vehicleCharge = baseFare * (vehicleMultiplier[formData.vehicleType] - 1);
      const taxes = Math.round((fare * 0.05) * 100) / 100; // 5% taxes rounded to 2 decimal places
      const totalFare = Math.round((fare + taxes) * 100) / 100; // Total rounded to 2 decimal places
      
      setEstimatedFare({
        distance: distance,
        duration: Math.ceil(distance * 2), // Rough estimate: 2 minutes per km
        fare: {
          base: Math.round(baseFare * 100) / 100,
          distance: Math.round(baseFare * 100) / 100,
          vehicle: Math.round(vehicleCharge * 100) / 100,
          taxes: taxes,
          total: totalFare
        }
      });
      setIsSearching(false);
      success('Rides found! Review your booking details.');
    }, 2000);
  };

  const handleBookRide = () => {
    if (!estimatedFare) {
      error('Please search for available rides first');
      return;
    }
    
    // Prepare booking details for confirmation page
    const bookingDetails = {
      pickupLocation: formData.pickupLocation,
      destination: formData.destination,
      vehicleType: vehicleTypes.find(v => v.id === formData.vehicleType)?.name,
      notes: formData.notes,
      distance: `${estimatedFare.distance.toFixed(1)} km`,
      duration: `${estimatedFare.duration} min`,
      fare: estimatedFare.fare
    };
    
    // Navigate to confirmation page with booking details
    navigate('/booking-confirmation', { 
      state: { bookingDetails } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-600">Enter your details and find the perfect ride</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pickup Location
                  </label>
                  <CitySelector
                    value={formData.pickupLocation}
                    onChange={(value) => setFormData({ ...formData, pickupLocation: value })}
                    placeholder="Select pickup city"
                    onCitySelect={handlePickupCitySelect}
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Destination
                  </label>
                  <CitySelector
                    value={formData.destination}
                    onChange={(value) => setFormData({ ...formData, destination: value })}
                    placeholder="Select destination city"
                    onCitySelect={handleDestinationCitySelect}
                  />
                </div>

                {/* Vehicle Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Car className="w-4 h-4 inline mr-1" />
                    Choose Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicleTypes.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, vehicleType: vehicle.id })}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.vehicleType === vehicle.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{vehicle.icon}</div>
                        <div className="text-sm font-semibold text-gray-900">{vehicle.name}</div>
                        <div className="text-xs text-gray-500">{vehicle.price}</div>
                        <div className="text-xs text-gray-400 mt-1">{vehicle.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for your driver..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search Available Rides
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Fare Estimation & Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fare Estimation</h3>
              
              {estimatedFare ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Estimated Fare</span>
                      <span className="text-2xl font-bold text-green-600">₹{estimatedFare.fare.total.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      *Final fare may vary based on actual distance and time
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base fare</span>
                      <span>₹{estimatedFare.fare.base.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle type</span>
                      <span>{vehicleTypes.find(v => v.id === formData.vehicleType)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance</span>
                      <span>~{estimatedFare.distance.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>~{estimatedFare.duration} min</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookRide}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Enter your pickup and destination to see fare estimation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide; 