import React, { useEffect, useState } from 'react';
import { driverAPI } from '../api/driver';
import { MapPin, Navigation, Car, Clock } from 'lucide-react';

const DriverHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const trips = await driverAPI.getMyTrips();
      setTrips(trips.filter(trip => trip.status === 'COMPLETED' || trip.status === 'CANCELLED'));
      setLoading(false);
    };
    fetchTrips();
  }, []);

  if (loading) return <div className="text-center py-10">Loading trip history...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Trip History</h1>
      {trips.length === 0 ? (
        <div className="text-gray-500">No trips found.</div>
      ) : (
        <div className="space-y-6">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-lg p-6 shadow flex flex-col gap-2 border-l-4 border-blue-400">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Pickup:</span> {trip.pickupLocation}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Destination:</span> {trip.destination}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">Vehicle:</span> {trip.requestedVehicleType}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold">Requested At:</span> {new Date(trip.requestedAt).toLocaleString()}
              </div>
              <div className="flex gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{trip.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverHistory; 