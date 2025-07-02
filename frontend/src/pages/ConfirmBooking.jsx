import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../api/trips';
import { CheckCircle, MapPin, Navigation, Car, User } from 'lucide-react';

const ConfirmBooking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await tripsAPI.getTripById(tripId);
        setTrip(data);
      } catch (err) {
        setError('Could not load trip details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  if (loading) return <div className="text-center py-10">Loading booking confirmation...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!trip) return <div className="text-center py-10">Trip not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your ride has been confirmed by a driver. Here are your trip details:</p>
        <div className="text-left space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Pickup:</span>
            <span>{trip.pickupLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Dropoff:</span>
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-gray-700" />
            <span className="font-semibold">Vehicle:</span>
            <span>{trip.vehicleType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Fare:</span>
            <span className="text-green-600 font-bold">₹{trip.fare ? trip.fare.toFixed(2) : 'N/A'}</span>
          </div>
          {trip.driver && (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-700" />
              <span className="font-semibold">Driver:</span>
              <span>{trip.driver.user.username}</span>
            </div>
          )}
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mt-4"
          onClick={() => navigate(`/trips/${tripId}`)}
        >
          Track Your Ride
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking; 