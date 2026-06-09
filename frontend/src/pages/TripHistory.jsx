import React, { useState, useEffect } from 'react';
import { tripsAPI } from '../api/trips';
import { useToast } from '../context/ToastContext';
import { Calendar, MapPin, DollarSign, Car, Navigation, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserHeader from '../components/Header';

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
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED': return 'badge-success';
            case 'CANCELLED': return 'badge-danger';
            case 'REQUESTED': return 'badge-warning';
            case 'ACCEPTED': case 'STARTED': return 'badge-info';
            default: return 'badge-neutral';
        }
    };

    return (
        <>
            <UserHeader />
            <div className="page-container">
                <div className="page-content py-6 sm:py-8">
                    <div className="page-header">
                        <h1 className="page-title">Your Trips</h1>
                        <p className="page-subtitle">View your ride history and trip details</p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="card p-12 text-center">
                            <Car className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">No trips yet</h3>
                            <p className="text-surface-500 dark:text-surface-400 mb-6">Book your first ride to get started</p>
                            <Link to="/book" className="btn-primary">Book Your First Ride</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {trips.map((trip) => (
                                <div key={trip.id} className="card-hover p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(trip.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
                                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">From</p>
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
                                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">To</p>
                                                <p className="text-sm text-surface-900 dark:text-surface-100">{trip.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100 dark:border-surface-700/50">
                                        <div className="flex items-center gap-1 font-bold text-surface-900 dark:text-white">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>{trip.fare ? trip.fare.toFixed(2) : 'N/A'}</span>
                                        </div>
                                        <Link to={`/trips/${trip.id}`} className="btn-ghost text-sm text-brand-600 dark:text-brand-400">
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TripHistory;