import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';
import { useToast } from '../context/ToastContext';
import { Users, Car, Map } from 'lucide-react';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { error } = useToast();
    const [stats, setStats] = useState({ users: 0, drivers: 0, trips: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const [users, drivers, trips] = await Promise.all([
                    adminAPI.getAllUsers(),
                    adminAPI.getAllDrivers(),
                    adminAPI.getAllTrips(),
                ]);
                setStats({
                    users: users.length,
                    drivers: drivers.length,
                    trips: trips.length,
                });
            } catch (err) {
                error('Failed to fetch admin statistics.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [error]);

    if (isLoading) {
        return <div className="text-center py-10">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Users" value={stats.users} icon={<Users className="w-6 h-6 text-blue-500" />} />
                    <StatCard title="Total Drivers" value={stats.drivers} icon={<Car className="w-6 h-6 text-blue-500" />} />
                    <StatCard title="Total Trips" value={stats.trips} icon={<Map className="w-6 h-6 text-blue-500" />} />
                </div>

                {/* Placeholder for future lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Users</h2>
                        <p className="text-gray-600">User management list will be here.</p>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Drivers</h2>
                        <p className="text-gray-600">Driver management list will be here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 