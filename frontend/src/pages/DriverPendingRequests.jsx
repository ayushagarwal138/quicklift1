import React, { useState, useEffect } from 'react';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import DriverHeader from '../components/DriverHeader';
import { MapPin, Navigation, Clock, IndianRupee, Car } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthenticatedWsUrl, getStompConnectHeaders } from '../api/ws';
import { useAuth } from '../context/AuthContext';

const DriverPendingRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const { success, error, info } = useToast();

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const trips = await driverAPI.getMyTrips();
            setRequests(trips.filter(t => t.status === 'REQUESTED').sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
        } catch (err) {
            error('Failed to fetch pending requests.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'DRIVER' || !user.driverId) return;
        const client = new Client({
            webSocketFactory: () => new SockJS(getAuthenticatedWsUrl()),
            connectHeaders: getStompConnectHeaders(),
            reconnectDelay: 5000,
        });
        client.onConnect = () => {
            client.subscribe(`/topic/driver/${user.driverId}/requests`, () => {
                fetchRequests();
                info('New trip request received!');
            });
        };
        client.activate();
        return () => client.deactivate();
    }, [user, info]);

    const handleAccept = async (tripId) => {
        setActionLoading(tripId);
        try {
            await driverAPI.acceptTrip(tripId);
            success('Trip accepted successfully!');
            fetchRequests();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to accept trip.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (tripId) => {
        setActionLoading(tripId);
        try {
            await driverAPI.rejectTrip(tripId);
            success('Trip rejected.');
            fetchRequests();
        } catch (err) {
            error('Failed to reject trip.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <>
            <DriverHeader />
            <div className="page-container">
                <div className="page-content py-6 sm:py-8">
                    <div className="page-header mb-8">
                        <h1 className="page-title">Pending Requests</h1>
                        <p className="page-subtitle">Rides waiting for your approval</p>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {[1,2,3,4].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="card p-12 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-brand-500/10 rounded-full animate-ping" />
                                <Car className="w-10 h-10 text-surface-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">No pending requests</h3>
                            <p className="text-surface-500 dark:text-surface-400">Keep your app open to receive new ride requests.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map((trip) => (
                                <div key={trip.id} className="card p-5 animate-fade-in-up border-2 border-transparent hover:border-brand-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-4 border-b border-surface-100 dark:border-surface-700/50 pb-4">
                                        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(trip.requestedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                                            <IndianRupee className="w-5 h-5" />{trip.fare ? trip.fare.toFixed(2) : 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Pickup</p>
                                                <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2">{trip.pickupLocation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Destination</p>
                                                <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2">{trip.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleReject(trip.id)} 
                                            disabled={actionLoading === trip.id} 
                                            className="btn-danger flex-1"
                                        >
                                            Decline
                                        </button>
                                        <button 
                                            onClick={() => handleAccept(trip.id)} 
                                            disabled={actionLoading === trip.id} 
                                            className="btn-success flex-1"
                                        >
                                            {actionLoading === trip.id ? 'Accepting...' : 'Accept'}
                                        </button>
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

export default DriverPendingRequests;
