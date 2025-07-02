import React, { useEffect, useState } from 'react';
import { driverAPI } from '../api/driver';
import { DollarSign, MapPin, Navigation } from 'lucide-react';

const DriverEarnings = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const trips = await driverAPI.getMyTrips();
      setTrips(trips.filter(trip => trip.status === 'COMPLETED'));
      setLoading(false);
    };
    fetchTrips();
  }, []);

  const totalEarnings = trips.reduce((sum, trip) => sum + (trip.fare || 0), 0);

  if (loading) return <div className="text-center py-10">Loading earnings...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><DollarSign className="w-6 h-6 text-green-600" /> Total Earnings</h1>
      <div className="text-3xl font-extrabold text-green-700 mb-6">₹{totalEarnings.toLocaleString()}</div>
      {trips.length === 0 ? (
        <div className="text-gray-500">No completed trips found.</div>
      ) : (
        <div className="space-y-6">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-lg p-6 shadow flex flex-col gap-2 border-l-4 border-green-400">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Pickup:</span> {trip.pickupLocation}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Destination:</span> {trip.destination}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Fare:</span> ₹{trip.fare ? trip.fare.toFixed(2) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverEarnings; 