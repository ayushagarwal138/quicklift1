import React, { useState } from 'react';
import CitySelector from './CitySelector';

const CitySelectorTest = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedPickupCity, setSelectedPickupCity] = useState(null);
  const [selectedDestinationCity, setSelectedDestinationCity] = useState(null);

  const handlePickupCitySelect = (city) => {
    setSelectedPickupCity(city);
    console.log('Selected pickup city:', city);
  };

  const handleDestinationCitySelect = (city) => {
    setSelectedDestinationCity(city);
    console.log('Selected destination city:', city);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">City Selector Test</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <CitySelector
            value={pickupLocation}
            onChange={setPickupLocation}
            placeholder="Select pickup city"
            onCitySelect={handlePickupCitySelect}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <CitySelector
            value={destination}
            onChange={setDestination}
            placeholder="Select destination city"
            onCitySelect={handleDestinationCitySelect}
          />
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Selected Cities:</h3>
          <div className="space-y-2">
            <div>
              <strong>Pickup:</strong> {pickupLocation}
              {selectedPickupCity && (
                <div className="text-sm text-gray-600">
                  Lat: {selectedPickupCity.latitude}, Lng: {selectedPickupCity.longitude}
                </div>
              )}
            </div>
            <div>
              <strong>Destination:</strong> {destination}
              {selectedDestinationCity && (
                <div className="text-sm text-gray-600">
                  Lat: {selectedDestinationCity.latitude}, Lng: {selectedDestinationCity.longitude}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelectorTest; 