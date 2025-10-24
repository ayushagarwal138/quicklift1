import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Navigation, DollarSign, Clock, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useToast } from '../context/ToastContext';
import { tripsAPI } from '../api/trips';
import { api, publicApi } from '../api/api';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const vehicleTypes = [
  { id: 'SEDAN', name: 'Sedan', icon: '🚗', description: 'Comfortable for 4' },
  { id: 'SUV', name: 'SUV', icon: '🚙', description: 'Spacious 6-seater' },
  { id: 'MOTORCYCLE', name: 'Motorcycle', icon: '🏍️', description: 'Quick & economical' },
];

const LocationMarker = ({ position, text }) => {
  return position === null ? null : (
    <Marker position={position}>
      <Popup>{text}</Popup>
    </Marker>
  );
};

const MapFlyTo = ({ center, zoom }) => {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const BookRide = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  
  const [vehicleType, setVehicleType] = useState('SEDAN');
  const [notes, setNotes] = useState('');
  
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to center of India

  const [pickupSearchText, setPickupSearchText] = useState("");
  const [destinationSearchText, setDestinationSearchText] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (!pickupCoords) {
          setPickupCoords(e.latlng);
          info('Pickup location set. Now click on the map to set your destination.');
        } else if (!destinationCoords) {
          setDestinationCoords(e.latlng);
          info('Destination set. You can now estimate the fare.');
        } else {
            info('To change location, please reset.');
        }
      },
    });
    return null;
  };

  const handleSearch = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await publicApi.get(`/api/locations/search?q=${query}`);
      setSuggestions(response.data);
    } catch (err) {
      error('Failed to search for location.');
    }
  };
  
  const handleSuggestionClick = (suggestion, type) => {
    const coords = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
    if (type === 'pickup') {
      setPickupCoords(coords);
      setPickupSearchText(suggestion.display_name);
      setPickupSuggestions([]);
    } else {
      setDestinationCoords(coords);
      setDestinationSearchText(suggestion.display_name);
      setDestinationSuggestions([]);
    }
    setMapCenter([coords.lat, coords.lng]);
  };

  const fetchAddress = async (coords, setAddress, setSearchText) => {
    if (!coords) return;
    
    console.log('Fetching address for coordinates:', coords);
    
    try {
      // Try backend API first
      console.log('Trying backend API...');
      const response = await publicApi.get(`/api/locations/reverse?lat=${coords.lat}&lon=${coords.lng}`);
      const data = response.data;
      const address = data.display_name || 'Address not found';
      console.log('Backend API success:', address);
      setAddress(address);
      if(setSearchText) setSearchText(address);
      return;
    } catch (err) {
      console.log('Backend API failed:', err.response?.status, err.message);
    }
    
    // Fallback: Use BigDataCloud API directly (skip CORS proxy as it's not reliable)
    try {
      console.log('Trying BigDataCloud API...');
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=en`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('BigDataCloud API response:', data);
      
      // Extract address from BigDataCloud response with more specific details
      let address = 'Address not found';
      
      if (data.localityInfo?.administrative) {
        const admin = data.localityInfo.administrative;
        const parts = [];
        
        // Try to get the most specific location first
        if (data.locality && data.locality !== data.city) {
          parts.push(data.locality);
        }
        if (data.city && !parts.includes(data.city)) {
          parts.push(data.city);
        }
        
        // Add administrative divisions (state, country)
        if (admin.length > 1) {
          // Get state/province (usually index 1)
          const state = admin.find(a => a.adminLevel === 4 || a.order === 5);
          if (state && !parts.includes(state.name)) {
            parts.push(state.name);
          }
        }
        
        // Add country if we have space
        if (admin.length > 0 && parts.length < 3) {
          const country = admin[0];
          if (country && !parts.includes(country.name)) {
            parts.push(country.name);
          }
        }
        
        address = parts.join(', ');
      } else if (data.city && data.countryName) {
        address = `${data.city}, ${data.countryName}`;
      } else if (data.locality) {
        address = data.locality;
      }
      
      // If we still don't have a good address, try alternative fields
      if (address === 'Address not found' || address.length < 3) {
        if (data.principalSubdivision && data.countryName) {
          address = `${data.principalSubdivision}, ${data.countryName}`;
        } else if (data.continent && data.countryName) {
          address = `${data.countryName}`;
        }
      }
      
      console.log('BigDataCloud API success:', address);
      setAddress(address);
      if(setSearchText) setSearchText(address);
      return;
    } catch (fallbackErr) {
      console.log('BigDataCloud API failed:', fallbackErr);
    }
    
    // Final fallback: Show coordinates
    console.log('All APIs failed, using coordinates');
    const address = `Location: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    setAddress(address);
    if(setSearchText) setSearchText(address);
    error('Could not fetch detailed address. Using coordinates instead.');
  };

  useEffect(() => {
    if (pickupCoords) {
      fetchAddress(pickupCoords, setPickupAddress, setPickupSearchText);
    }
  }, [pickupCoords]);

  useEffect(() => {
    if (destinationCoords) {
      fetchAddress(destinationCoords, setDestinationAddress, setDestinationSearchText);
    }
  }, [destinationCoords]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(pickupSearchText, setPickupSuggestions);
    }, 500); // Debounce search
    return () => clearTimeout(handler);
  }, [pickupSearchText]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(destinationSearchText, setDestinationSuggestions);
    }, 500); // Debounce search
    return () => clearTimeout(handler);
  }, [destinationSearchText]);

  const handleEstimateFare = async () => {
    if (!pickupCoords || !destinationCoords) {
      error('Please set both pickup and destination points on the map.');
      return;
    }
    setIsEstimating(true);
    setEstimatedFare(null);
    info('Estimating fare...');

    const tripData = {
      pickupLatitude: pickupCoords.lat,
      pickupLongitude: pickupCoords.lng,
      destinationLatitude: destinationCoords.lat,
      destinationLongitude: destinationCoords.lng,
      vehicleType,
      pickupLocation: pickupAddress,
      destination: destinationAddress
    };

    try {
      const data = await tripsAPI.estimateFare(tripData);
      setEstimatedFare(data);
      success('Fare estimated successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to estimate fare.');
    } finally {
      setIsEstimating(false);
    }
  };
  
  const handleBookRide = async () => {
    if (!estimatedFare) {
        error('Please estimate the fare before booking.');
        return;
    }
    setIsBooking(true);
    info('Booking your ride...');

    const tripData = {
        pickupLocation: pickupAddress,
        destination: destinationAddress,
        pickupLatitude: pickupCoords.lat,
        pickupLongitude: pickupCoords.lng,
        destinationLatitude: destinationCoords.lat,
        destinationLongitude: destinationCoords.lng,
        vehicleType,
        notes,
        paymentMethod,
    };

    try {
        const data = await tripsAPI.bookTrip(tripData);
        success(`Ride booked successfully! Your trip ID is ${data.id}.`);
        navigate(`/waiting-for-driver/${data.id}`);
    } catch (err) {
        error(err.response?.data?.message || 'Failed to book ride.');
    } finally {
        setIsBooking(false);
    }
  };

  const resetLocations = () => {
    setPickupCoords(null);
    setDestinationCoords(null);
    setPickupAddress('');
    setDestinationAddress('');
    setEstimatedFare(null);
    info('Locations reset. Click on the map to set a new pickup point.');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-600">Click on the map to set your pickup and destination</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-2 h-[600px] flex flex-col">
              <div id="map" className="flex-grow rounded-md">
                <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapEvents />
                  <LocationMarker position={pickupCoords} text="Pickup Location" />
                  <LocationMarker position={destinationCoords} text="Destination" />
                  <MapFlyTo center={mapCenter} zoom={13} />
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Select Locations</h3>
                <div className="space-y-3 relative">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-2.5 text-blue-500"/>
                        <div className="w-full">
                            <label className="font-semibold text-sm">Pickup</label>
                            <input 
                              type="text"
                              value={pickupSearchText}
                              onChange={(e) => setPickupSearchText(e.target.value)}
                              placeholder="Type a pickup location"
                              className="w-full text-xs p-1 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                            />
                            {pickupSuggestions.length > 0 && (
                              <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full z-10 max-h-40 overflow-y-auto">
                                {pickupSuggestions.map(s => (
                                  <li key={s.place_id} onClick={() => handleSuggestionClick(s, 'pickup')} className="p-2 text-xs cursor-pointer hover:bg-gray-100">
                                    {s.display_name}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Navigation className="w-5 h-5 mt-2.5 text-green-500"/>
                        <div className="w-full">
                           <label className="font-semibold text-sm">Destination</label>
                            <input 
                              type="text"
                              value={destinationSearchText}
                              onChange={(e) => setDestinationSearchText(e.target.value)}
                              placeholder="Type a destination location"
                              className="w-full text-xs p-1 border-b-2 border-gray-200 focus:border-green-500 outline-none"
                            />
                             {destinationSuggestions.length > 0 && (
                              <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full z-10 max-h-40 overflow-y-auto">
                                {destinationSuggestions.map(s => (
                                  <li key={s.place_id} onClick={() => handleSuggestionClick(s, 'destination')} className="p-2 text-xs cursor-pointer hover:bg-gray-100">
                                    {s.display_name}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                    </div>
                </div>
                 <button onClick={resetLocations} className="text-xs text-blue-500 hover:underline mt-2">Reset Locations</button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Choose Vehicle</h3>
                 <div className="grid grid-cols-3 gap-2">
                    {vehicleTypes.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setVehicleType(vehicle.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                          vehicleType === vehicle.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xl">{vehicle.icon}</div>
                        <div className="text-xs font-semibold text-gray-800">{vehicle.name}</div>
                      </button>
                    ))}
                  </div>
              </div>
              
               <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Get Fare Estimate</h3>
                <button
                  onClick={handleEstimateFare}
                  disabled={isEstimating || !pickupCoords || !destinationCoords}
                  className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isEstimating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Estimating...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Estimate Fare
                    </>
                  )}
                </button>
                {estimatedFare && (
                   <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estimated Fare</span>
                      <span className="text-xl font-bold text-green-600">₹{estimatedFare.estimatedFare.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Distance: {estimatedFare.distance.toFixed(2)} km
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" name="paymentMethod" value="CASH" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} />
                    <span className="ml-2">Cash</span>
                  </label>
                  <label>
                    <input type="radio" name="paymentMethod" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
                    <span className="ml-2">Credit/Debit Card</span>
                  </label>
                  <label>
                    <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                    <span className="ml-2">UPI</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Book Your Ride</h3>
                 <button
                    onClick={handleBookRide}
                    disabled={isBooking || !estimatedFare}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    {isBooking ? 'Booking...' : 'Confirm & Book Ride'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide; 