import React, { useState, useEffect } from 'react';
import { tripsAPI } from '../api/trips';
import { useToast } from '../context/ToastContext';
import { Calendar, MapPin, Clock, DollarSign, Star, Car, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TripHistory = () => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        const fetchTrips = async () => {
            setIsLoading(true);
            try {
                const fetchedTrips = await tripsAPI.getMyTrips();
                setTrips(fetchedTrips.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
            } catch (err) {
                error('Failed to fetch trip history.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrips();
    }, [error]);
    
    const getStatusPill = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
        switch (status) {
            case 'COMPLETED': return `${baseClasses} bg-green-100 text-green-800`;
            case 'CANCELLED': return `${baseClasses} bg-red-100 text-red-800`;
            case 'REQUESTED': return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'ACCEPTED':
            case 'STARTED':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Trips</h1>

                {isLoading ? (
                    <div className="text-center py-10">Loading your trip history...</div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
                        <p className="text-gray-500 mb-6">You haven't booked any rides with us yet.</p>
                        <Link to="/book" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                            Book Your First Ride
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trips.map((trip) => (
                            <div key={trip.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {new Date(trip.requestedAt).toLocaleDateString()}
                                            </p>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {trip.destination}
                                            </h3>
                                        </div>
                                        <div className={getStatusPill(trip.status)}>{trip.status}</div>
                                    </div>
                                    
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 text-green-500" />
                                            <span>From: {trip.pickupLocation}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <span className="text-lg font-bold text-gray-800">
                                                 ₹{trip.fare ? trip.fare.toFixed(2) : 'N/A'}
                                            </span>
                                        </div>
                                        <Link to={`/trips/${trip.id}`} className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripHistory; 