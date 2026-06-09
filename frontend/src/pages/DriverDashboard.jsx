import React, { useState, useEffect } from 'react';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import { Car, Clock, DollarSign, MapPin, Star, Activity, UserCheck, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import DriverHeader from '../components/DriverHeader';
import DriverTripHistoryList from '../components/DriverTripHistoryList';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthenticatedWsUrl, getStompConnectHeaders } from '../api/ws';
import MapResizer from '../components/MapResizer';
import { configureLeafletIcons } from '../utils/leafletIcons';

configureLeafletIcons();

const driverIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: Activity },
  { id: 'activeTrip', label: 'Active Trip', icon: Navigation },
  { id: 'history', label: 'History', icon: Clock },
];

const DriverDashboard = () => {
    const { success, error, info } = useToast();
    const { user } = useAuth();
    const [driverStatus, setDriverStatus] = useState('ONLINE');
    const [pendingTrips, setPendingTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [pastTrips, setPastTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [earnings, setEarnings] = useState(0);
    const [rating, setRating] = useState(0);
    const [selectedSection, setSelectedSection] = useState('dashboard');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const activeTripData = await driverAPI.getMyActiveTrip();
            if (activeTripData && Object.keys(activeTripData).length > 0) {
                setActiveTrip(activeTripData);
            } else {
                setActiveTrip(null);
            }
            const myTrips = await driverAPI.getMyTrips();
            const sortedPendingTrips = [...myTrips.filter(trip => trip.status === 'REQUESTED')].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
            setPendingTrips(sortedPendingTrips);
            setPastTrips(myTrips.filter(trip => trip.status === 'COMPLETED' || trip.status === 'CANCELLED')
                .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
        } catch (err) {
            error(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'DRIVER' || !user.driverId) return;
        const socketFactory = () => new SockJS(getAuthenticatedWsUrl());
        const client = new Client({
            webSocketFactory: socketFactory,
            connectHeaders: getStompConnectHeaders(),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        client.onConnect = () => {
            client.subscribe(`/topic/driver/${user.driverId}/requests`, () => {
                fetchAllData();
                info('New trip request received!');
            });
        };
        client.activate();
        return () => client.deactivate();
    }, [user]);

    useEffect(() => {
        fetchAllData();
        const fetchSummary = async () => {
            try {
                const summary = await driverAPI.getSummary();
                setEarnings(summary.earnings);
                setRating(summary.rating);
            } catch (err) {
                setEarnings(0);
                setRating(0);
            }
        };
        fetchSummary();
    }, []);

    const handleStatusToggle = async () => {
        const newStatus = driverStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        try {
            await driverAPI.setStatus(newStatus);
            setDriverStatus(newStatus);
            if (newStatus === 'ONLINE') {
                await fetchAllData();
            } else {
                setPendingTrips([]);
            }
        } catch (err) {
            error('Failed to update status.');
        }
    };

    const handleAcceptTrip = async (tripId) => {
        info('Accepting trip...');
        setActionLoading(true);
        try {
            await driverAPI.acceptTrip(tripId);
            success('Trip accepted!');
            await fetchAllData();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to accept trip.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectTrip = async (tripId) => {
        info('Rejecting trip...');
        setActionLoading(true);
        try {
            await driverAPI.rejectTrip(tripId);
            success('Trip rejected!');
            await fetchAllData();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to reject trip.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateTripStatus = async (tripId, action) => {
        info('Updating trip status...');
        try {
            if (action === 'start') {
                await driverAPI.startTrip(tripId);
            } else if (action === 'complete') {
                const finalFare = activeTrip.fare; 
                await driverAPI.completeTrip(tripId, finalFare);
            }
            success(`Trip ${action === 'start' ? 'started' : 'completed'}!`);
            await fetchAllData();
        } catch (err) {
            error(err.response?.data?.message || `Failed to ${action} trip.`);
        }
    };

    if (isLoading) {
        return (
            <>
                <DriverHeader />
                <div className="page-container">
                    <div className="page-content py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
                        </div>
                        <div className="skeleton h-64 rounded-2xl" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DriverHeader />
            <div className="page-container">
                <div className="page-content py-6 sm:py-8">
                    {/* Status & Tab Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <h1 className="page-title">Dashboard</h1>
                            <button
                                onClick={handleStatusToggle}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                    driverStatus === 'ONLINE'
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                        : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                                }`}
                            >
                                <span className={driverStatus === 'ONLINE' ? 'status-online' : 'status-offline'} />
                                {driverStatus}
                            </button>
                        </div>
                        {/* Tab Navigation */}
                        <div className="flex gap-1 bg-surface-100 dark:bg-surface-800 rounded-xl p-1 w-full sm:w-auto overflow-x-auto">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedSection(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                            selectedSection === tab.id
                                                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                                                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dashboard Overview */}
                    {selectedSection === 'dashboard' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <div className="stat-card">
                                    <div className="stat-icon bg-emerald-50 dark:bg-emerald-900/20">
                                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="stat-label">Earnings</p>
                                        <p className="stat-value">₹{(earnings || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon bg-amber-50 dark:bg-amber-900/20">
                                        <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="stat-label">Rating</p>
                                        <p className="stat-value">{(rating || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon bg-brand-50 dark:bg-brand-900/20">
                                        <UserCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <div>
                                        <p className="stat-label">Pending Requests</p>
                                        <p className="stat-value">{pendingTrips.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Active Trip Preview */}
                            {activeTrip && (
                                <div>
                                    <h2 className="section-title flex items-center gap-2 mb-4">
                                        <Activity className="w-5 h-5 text-emerald-500" /> Active Trip
                                    </h2>
                                    <div className="card p-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                                                        <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Pickup</p>
                                                        <p className="text-sm font-medium text-surface-900 dark:text-white">{activeTrip.pickupLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                                                        <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Destination</p>
                                                        <p className="text-sm font-medium text-surface-900 dark:text-white">{activeTrip.destination}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <span className="text-lg font-bold text-surface-900 dark:text-white">₹{activeTrip.fare ? activeTrip.fare.toFixed(2) : 'N/A'}</span>
                                                    <span className="badge-info">{activeTrip.status}</span>
                                                </div>
                                                <div className="flex gap-3 pt-2">
                                                    {activeTrip.status === 'ACCEPTED' && (
                                                        <button onClick={() => handleUpdateTripStatus(activeTrip.id, 'start')} className="btn-success flex-1">
                                                            Start Trip
                                                        </button>
                                                    )}
                                                    {activeTrip.status === 'STARTED' && (
                                                        <button onClick={() => handleUpdateTripStatus(activeTrip.id, 'complete')} className="btn-primary flex-1">
                                                            Complete Trip
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-h-[250px] rounded-xl overflow-hidden">
                                                <MapContainer center={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} zoom={13} style={{ height: '100%', width: '100%', minHeight: '250px' }}>
                                                    <MapResizer watch={`${selectedSection}-${activeTrip.status}`} />
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} icon={driverIcon}>
                                                        <Popup>Pickup: {activeTrip.pickupLocation}</Popup>
                                                    </Marker>
                                                    <Marker position={[activeTrip.destinationLatitude, activeTrip.destinationLongitude]}>
                                                        <Popup>Destination: {activeTrip.destination}</Popup>
                                                    </Marker>
                                                    <Polyline positions={[[activeTrip.pickupLatitude, activeTrip.pickupLongitude], [activeTrip.destinationLatitude, activeTrip.destinationLongitude]]} color="#3366ff" />
                                                </MapContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Latest Pending Request */}
                            {pendingTrips.length > 0 && (
                                <div>
                                    <h2 className="section-title flex items-center gap-2 mb-4">
                                        <Clock className="w-5 h-5 text-amber-500" /> Latest Pending Request
                                    </h2>
                                    <div className="card p-6">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                                                    <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Pickup</p>
                                                    <p className="text-sm font-medium text-surface-900 dark:text-white">{pendingTrips[0].pickupLocation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                                                    <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Destination</p>
                                                    <p className="text-sm font-medium text-surface-900 dark:text-white">{pendingTrips[0].destination}</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-bold text-surface-900 dark:text-white pt-1">₹{pendingTrips[0].fare ? pendingTrips[0].fare.toFixed(2) : 'N/A'}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => handleAcceptTrip(pendingTrips[0].id)} disabled={actionLoading} className="btn-success flex-1">
                                                {actionLoading ? 'Processing...' : 'Accept'}
                                            </button>
                                            <button onClick={() => handleRejectTrip(pendingTrips[0].id)} disabled={actionLoading} className="btn-danger flex-1">
                                                {actionLoading ? 'Processing...' : 'Reject'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Active Trip Tab */}
                    {selectedSection === 'activeTrip' && activeTrip && (
                        <div className="animate-fade-in">
                            <h2 className="section-title flex items-center gap-2 mb-6">
                                <Activity className="w-5 h-5 text-emerald-500" /> Active Trip
                            </h2>
                            <div className="card p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                                                <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Pickup</p>
                                                <p className="text-sm font-medium text-surface-900 dark:text-white">{activeTrip.pickupLocation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                                                <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">Destination</p>
                                                <p className="text-sm font-medium text-surface-900 dark:text-white">{activeTrip.destination}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 pt-2">
                                            <span className="text-lg font-bold text-surface-900 dark:text-white">₹{activeTrip.fare ? activeTrip.fare.toFixed(2) : 'N/A'}</span>
                                            <span className="badge-info">{activeTrip.status}</span>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            {activeTrip.status === 'ACCEPTED' && (
                                                <button onClick={() => handleUpdateTripStatus(activeTrip.id, 'start')} className="btn-success flex-1">Start Trip</button>
                                            )}
                                            {activeTrip.status === 'STARTED' && (
                                                <button onClick={() => handleUpdateTripStatus(activeTrip.id, 'complete')} className="btn-primary flex-1">Complete Trip</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-h-[300px] rounded-xl overflow-hidden">
                                        <MapContainer center={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} zoom={13} style={{ height: '100%', width: '100%', minHeight: '300px' }}>
                                            <MapResizer watch={`${selectedSection}-${activeTrip.status}-detail`} />
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker position={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} icon={driverIcon}>
                                                <Popup>Pickup: {activeTrip.pickupLocation}</Popup>
                                            </Marker>
                                            <Marker position={[activeTrip.destinationLatitude, activeTrip.destinationLongitude]}>
                                                <Popup>Destination: {activeTrip.destination}</Popup>
                                            </Marker>
                                            <Polyline positions={[[activeTrip.pickupLatitude, activeTrip.pickupLongitude], [activeTrip.destinationLatitude, activeTrip.destinationLongitude]]} color="#3366ff" />
                                        </MapContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedSection === 'activeTrip' && !activeTrip && (
                        <div className="card p-12 text-center animate-fade-in">
                            <Car className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No Active Trip</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">You don't have an active trip at the moment.</p>
                        </div>
                    )}

                    {/* History Tab */}
                    {selectedSection === 'history' && (
                        <div className="animate-fade-in">
                            <h2 className="section-title mb-6">Trip History</h2>
                            <DriverTripHistoryList trips={pastTrips} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DriverDashboard;
