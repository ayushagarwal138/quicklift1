import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../api/trips';
import { CheckCircle, MapPin, Navigation, Car, User, IndianRupee } from 'lucide-react';

const ConfirmBooking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const fetchTrip = async () => {
      try { const data = await tripsAPI.getTripById(tripId); setTrip(data); }
      catch { setError('Could not load trip details.'); }
      finally { setLoading(false); }
    };
    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    if (!trip) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); navigate(`/trips/${tripId}`); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [trip, tripId, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="skeleton w-80 h-96 rounded-2xl" />
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"><p className="text-red-500">{error}</p></div>;
  if (!trip) return <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"><p className="text-surface-500">Trip not found.</p></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 p-6">
      <div className="card p-8 max-w-md w-full text-center animate-fade-in-up">
        {/* Animated checkmark */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 rounded-full animate-ping opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Booking Confirmed!</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-6">Your ride has been confirmed by a driver</p>

        <div className="text-left space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
              <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase">Pickup</p>
              <p className="text-sm text-surface-900 dark:text-white">{trip.pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
              <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-surface-500 uppercase">Dropoff</p>
              <p className="text-sm text-surface-900 dark:text-white">{trip.destination}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700/50">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-600 dark:text-surface-400">{trip.vehicleType}</span>
            </div>
            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-4 h-4" />{trip.fare ? trip.fare.toFixed(2) : 'N/A'}
            </span>
          </div>
          {trip.driver && (
            <div className="flex items-center gap-3 pt-3 border-t border-surface-100 dark:border-surface-700/50">
              <div className="w-10 h-10 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-surface-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{trip.driver.user.username}</p>
                <p className="text-xs text-surface-500">Your driver</p>
              </div>
            </div>
          )}
        </div>

        <button className="btn-primary w-full" onClick={() => navigate(`/trips/${tripId}`)}>
          Track Your Ride
        </button>
        <p className="text-xs text-surface-400 mt-3">
          Redirecting in {countdown}s...
        </p>
      </div>
    </div>
  );
};

export default ConfirmBooking;