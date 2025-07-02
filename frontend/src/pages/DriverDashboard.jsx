import React, { useState, useEffect } from 'react';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import { Car, Check, Clock, List, Navigation, ShieldAlert, X, DollarSign, MapPin, Star, TrendingUp, LogOut, User as UserIcon, LayoutDashboard, History, Activity, UserCheck, Phone, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import DriverHeader from '../components/DriverHeader';

const driverIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const menuItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, section: 'dashboard' },
  { label: 'Active Trip', icon: <Activity className="w-5 h-5" />, section: 'activeTrip' },
  { label: 'Trip History', icon: <History className="w-5 h-5" />, section: 'history' },
  { label: 'Profile', icon: <UserIcon className="w-5 h-5" />, section: 'profile' },
];

const DriverDashboard = () => {
    const { success, error, info } = useToast();
    const { logout } = useAuth();
    const [driverStatus, setDriverStatus] = useState('ONLINE');
    const [pendingTrips, setPendingTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [pastTrips, setPastTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Placeholder for earnings and ratings
    const [earnings, setEarnings] = useState(12345);
    const [rating, setRating] = useState(4.8);
    const [selectedSection, setSelectedSection] = useState('dashboard');

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Fetch active trip
            const activeTripData = await driverAPI.getMyActiveTrip();
            if (activeTripData && Object.keys(activeTripData).length > 0) {
                setActiveTrip(activeTripData);
            } else {
                setActiveTrip(null);
            }
            // Fetch pending trips (REQUESTED, assigned to this driver)
            const myTrips = await driverAPI.getMyTrips();
            const sortedPendingTrips = [...myTrips.filter(trip => trip.status === 'REQUESTED')].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
            setPendingTrips(sortedPendingTrips);
            setPastTrips(myTrips.filter(trip => trip.status === 'COMPLETED' || trip.status === 'CANCELLED')
                .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
            // TODO: Fetch earnings and rating from backend
            setEarnings(12345); // Placeholder
            setRating(4.8); // Placeholder
        } catch (err) {
            error(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally {
            setIsLoading(false);
        }
    };

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
        try {
            await driverAPI.acceptTrip(tripId);
            success('Trip accepted!');
            await fetchAllData();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to accept trip.');
        }
    };

    const handleRejectTrip = async (tripId) => {
        info('Rejecting trip...');
        try {
            await driverAPI.rejectTrip(tripId);
            success('Trip rejected!');
            await fetchAllData();
        } catch (err) {
            error(err.response?.data?.message || 'Failed to reject trip.');
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
        return <div className="text-center py-10">Loading Driver Dashboard...</div>;
    }

    return (
        <>
            <DriverHeader />
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-gradient-to-b from-blue-700 to-blue-900 dark:from-gray-800 dark:to-gray-900 shadow-xl flex flex-col justify-between min-h-screen">
                        <div>
                            <div className="flex items-center gap-2 px-6 py-6 border-b border-blue-800 dark:border-gray-700">
                                <Car className="w-8 h-8 text-white" />
                                <span className="text-xl font-bold text-white">Driver Panel</span>
                            </div>
                            <div className="px-6 py-4 flex flex-col items-center">
                                <span className={`px-4 py-2 rounded-full text-lg font-semibold mb-2 ${driverStatus === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{driverStatus}</span>
                                <button
                                    onClick={handleStatusToggle}
                                    className={`mt-2 px-6 py-2 rounded-lg text-base font-bold transition-colors ${driverStatus === 'ONLINE' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} shadow-md`}
                                >
                                    {driverStatus === 'ONLINE' ? 'Go Offline' : 'Go Online'}
                                </button>
                            </div>
                            <nav className="mt-8 flex-1">
                                {menuItems.map(item => (
                                    <button
                                        key={item.section}
                                        onClick={() => setSelectedSection(item.section)}
                                        className={`w-full flex items-center gap-3 px-6 py-3 text-left text-white hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors font-medium ${selectedSection === item.section ? 'bg-blue-900 dark:bg-gray-700 text-yellow-300' : ''}`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-6 py-4 text-red-300 hover:bg-red-900/20 transition-colors font-semibold border-t border-blue-800 dark:border-gray-700"
                        >
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </aside>
                    {/* Main Content */}
                    <main className="flex-1 p-4 md:p-10 bg-gray-50 dark:bg-gray-900">
                        {/* Dashboard Summary Cards */}
                        {selectedSection === 'dashboard' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-green-400">
                                        <DollarSign className="w-10 h-10 text-green-500 mb-3" />
                                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{earnings.toLocaleString()}</div>
                                        <div className="text-gray-500 dark:text-gray-300 mt-2 text-lg">Earnings</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-yellow-400">
                                        <Star className="w-10 h-10 text-yellow-400 mb-3" />
                                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{rating.toFixed(2)}</div>
                                        <div className="text-gray-500 dark:text-gray-300 mt-2 text-lg">Rating</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-400">
                                        <UserCheck className="w-10 h-10 text-blue-500 mb-3" />
                                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{pendingTrips.length}</div>
                                        <div className="text-gray-500 dark:text-gray-300 mt-2 text-lg">Pending Requests</div>
                                    </div>
                                </div>
                                {/* Active Trip Preview in Dashboard */}
                                {activeTrip && (
                                    <section className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Activity className="w-6 h-6 text-green-500" /> Active Trip</h2>
                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                                            <div className="flex-1">
                                                <div className="mb-4">
                                                    <div className="font-semibold text-lg mb-2">Pickup: <span className="text-blue-600">{activeTrip.pickupLocation}</span></div>
                                                    <div className="font-semibold text-lg mb-2">Destination: <span className="text-green-600">{activeTrip.destination}</span></div>
                                                    <div className="text-gray-700 dark:text-gray-300 mb-2">Fare: ₹{activeTrip.fare ? activeTrip.fare.toFixed(2) : 'N/A'}</div>
                                                    <div className="text-gray-700 dark:text-gray-300 mb-2">Status: <span className="font-semibold">{activeTrip.status}</span></div>
                                                </div>
                                                <div className="flex gap-4 mt-4">
                                                    {activeTrip.status === 'ACCEPTED' && (
                                                        <button 
                                                            onClick={() => handleUpdateTripStatus(activeTrip.id, 'start')}
                                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
                                                        >
                                                            Start Trip
                                                        </button>
                                                    )}
                                                    {activeTrip.status === 'STARTED' && (
                                                        <button 
                                                            onClick={() => handleUpdateTripStatus(activeTrip.id, 'complete')}
                                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
                                                        >
                                                            Complete Trip
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <MapContainer center={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} zoom={13} style={{ height: '250px', width: '100%' }}>
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} icon={driverIcon}>
                                                        <Popup>Pickup: {activeTrip.pickupLocation}</Popup>
                                                    </Marker>
                                                    <Marker position={[activeTrip.destinationLatitude, activeTrip.destinationLongitude]}>
                                                        <Popup>Destination: {activeTrip.destination}</Popup>
                                                    </Marker>
                                                    <Polyline positions={[[activeTrip.pickupLatitude, activeTrip.pickupLongitude], [activeTrip.destinationLatitude, activeTrip.destinationLongitude]]} color="blue" />
                                                </MapContainer>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                        {selectedSection === 'activeTrip' && activeTrip && (
                            <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Activity className="w-6 h-6 text-green-500" /> Active Trip</h2>
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <div className="font-semibold text-lg mb-2">Pickup: <span className="text-blue-600">{activeTrip.pickupLocation}</span></div>
                                            <div className="font-semibold text-lg mb-2">Destination: <span className="text-green-600">{activeTrip.destination}</span></div>
                                            <div className="text-gray-700 dark:text-gray-300 mb-2">Fare: ₹{activeTrip.fare ? activeTrip.fare.toFixed(2) : 'N/A'}</div>
                                            <div className="text-gray-700 dark:text-gray-300 mb-2">Status: <span className="font-semibold">{activeTrip.status}</span></div>
                                        </div>
                                        <div className="flex gap-4 mt-4">
                                            {activeTrip.status === 'ACCEPTED' && (
                                                <button 
                                                    onClick={() => handleUpdateTripStatus(activeTrip.id, 'start')}
                                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
                                                >
                                                    Start Trip
                                                </button>
                                            )}
                                            {activeTrip.status === 'STARTED' && (
                                                <button 
                                                    onClick={() => handleUpdateTripStatus(activeTrip.id, 'complete')}
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
                                                >
                                                    Complete Trip
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <MapContainer center={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} zoom={13} style={{ height: '250px', width: '100%' }}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker position={[activeTrip.pickupLatitude, activeTrip.pickupLongitude]} icon={driverIcon}>
                                                <Popup>Pickup: {activeTrip.pickupLocation}</Popup>
                                            </Marker>
                                            <Marker position={[activeTrip.destinationLatitude, activeTrip.destinationLongitude]}>
                                                <Popup>Destination: {activeTrip.destination}</Popup>
                                            </Marker>
                                            <Polyline positions={[[activeTrip.pickupLatitude, activeTrip.pickupLongitude], [activeTrip.destinationLatitude, activeTrip.destinationLongitude]]} color="blue" />
                                        </MapContainer>
                                    </div>
                                </div>
                            </section>
                        )}
                        {selectedSection === 'activeTrip' && !activeTrip && (
                            <div className="text-center text-gray-500 dark:text-gray-400 text-lg py-10">No active trip at the moment.</div>
                        )}
                        {selectedSection === 'history' && (
                            <section>{/* ...trip history details... */}</section>
                        )}
                        {selectedSection === 'profile' && (
                            <section>{/* ...profile details... */}</section>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default DriverDashboard; 