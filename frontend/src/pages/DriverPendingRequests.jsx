import React, { useEffect, useState } from 'react';
import { driverAPI } from '../api/driver';
import { Check, X, MapPin, Navigation, Car, Clock } from 'lucide-react';

const DriverPendingRequests = () => {
  const [pendingTrips, setPendingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    setLoading(true);
    const trips = await driverAPI.getMyTrips();
    // Sort by requestedAt descending (latest first)
    const pending = trips.filter(trip => trip.status === 'REQUESTED')
      .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    setPendingTrips(pending);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAccept = async (tripId) => {
    await driverAPI.acceptTrip(tripId);
    fetchTrips();
  };
  const handleReject = async (tripId) => {
    await driverAPI.rejectTrip(tripId);
    fetchTrips();
  };

  if (loading) return <div className="text-center py-10">Loading pending requests...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Ride Requests</h1>
      {pendingTrips.length === 0 ? (
        <div className="text-gray-500">No pending ride requests.</div>
      ) : (
        <div className="space-y-6">
          {pendingTrips.map(trip => (
            <div key={trip.id} className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-2 border-l-4 border-blue-400">
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
                <button
                  onClick={() => handleAccept(trip.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
                >
                  <Check className="inline w-4 h-4 mr-1" /> Accept
                </button>
                <button
                  onClick={() => handleReject(trip.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
                >
                  <X className="inline w-4 h-4 mr-1" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverPendingRequests; 