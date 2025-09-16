import React from 'react';
import { MapPin, Navigation, Car, Clock, IndianRupee, Star, MessageSquare } from 'lucide-react';

const DriverTripHistoryList = ({ trips }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Car className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No trips found</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400">Your completed trips will appear here.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  const renderStars = (rating) => {
    const numRating = Number(rating);
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= numRating
                ? 'text-amber-400 fill-amber-400'
                : 'text-surface-200 dark:text-surface-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <div key={trip.id} className="card-hover p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
              <Clock className="w-4 h-4" />
              <span>{new Date(trip.requestedAt).toLocaleString()}</span>
            </div>
            <span className={getStatusBadge(trip.status)}>{trip.status}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">Pickup</p>
                <p className="text-sm text-surface-900 dark:text-surface-100">{trip.pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">Destination</p>
                <p className="text-sm text-surface-900 dark:text-surface-100">{trip.destination}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100 dark:border-surface-700/50">
            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
              <Car className="w-4 h-4" />
              <span>{trip.requestedVehicleType}</span>
            </div>
            {trip.fare && (
              <div className="flex items-center gap-1 font-semibold text-surface-900 dark:text-white">
                <IndianRupee className="w-4 h-4" />
                <span>{trip.fare.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Rating & Review section */}
          {trip.status === 'COMPLETED' && (
            <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700/50">
              {trip.rating != null ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {renderStars(trip.rating)}
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                      {Number(trip.rating).toFixed(1)}
                    </span>
                    <span className="text-xs text-surface-400">from rider</span>
                  </div>
                  {trip.review && (
                    <div className="flex items-start gap-2 mt-2">
                      <MessageSquare className="w-4 h-4 text-surface-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-surface-600 dark:text-surface-300 italic leading-relaxed">
                        "{trip.review}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-surface-400 dark:text-surface-500 italic">No review yet</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DriverTripHistoryList;