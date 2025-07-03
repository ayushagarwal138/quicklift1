import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';
import { useToast } from '../context/ToastContext';
import { Users, Car, Map, CheckCircle, TrendingUp, UserCheck, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${color} flex items-center gap-4`}>
    <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Table = ({ title, columns, data }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-4 text-gray-400">No data</td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-sm text-gray-700">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { error } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
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
        setUsers(users);
        setDrivers(drivers);
        setTrips(trips);
      } catch (err) {
        error('Failed to fetch admin statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [error]);

  // Derived stats
  const totalUsers = users.length;
  const totalDrivers = drivers.length;
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;
  const activeDrivers = drivers.filter(d => d.status === 'ONLINE').length;
  const totalRevenue = trips.reduce((sum, t) => sum + (t.fare || 0), 0);

  // Recent data
  const recentUsers = users.slice(-5).reverse();
  const recentDrivers = drivers.slice(-5).reverse();
  const recentTrips = trips.slice(-5).reverse();

  if (isLoading) {
    return <div className="text-center py-10">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Users" value={totalUsers} icon={<Users className="w-6 h-6 text-blue-500" />} color="border-blue-400" />
          <StatCard title="Total Drivers" value={totalDrivers} icon={<Car className="w-6 h-6 text-green-500" />} color="border-green-400" />
          <StatCard title="Total Trips" value={totalTrips} icon={<Map className="w-6 h-6 text-purple-500" />} color="border-purple-400" />
          <StatCard title="Completed Trips" value={completedTrips} icon={<CheckCircle className="w-6 h-6 text-green-600" />} color="border-green-600" />
          <StatCard title="Active Drivers" value={activeDrivers} icon={<UserCheck className="w-6 h-6 text-yellow-500" />} color="border-yellow-400" />
          <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6 text-pink-500" />} color="border-pink-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Table
              title="Recent Users"
              columns={["Username", "Email", "Role", "Joined"]}
              data={recentUsers.map(u => [u.username, u.email, u.role, u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'])}
            />
          </div>
          <div className="lg:col-span-1">
            <Table
              title="Recent Drivers"
              columns={["Name", "Vehicle", "Status", "Rating", "Rides"]}
              data={recentDrivers.map(d => [
                d.user?.firstName + ' ' + d.user?.lastName,
                `${d.vehicleType} (${d.vehicleModel})`,
                d.status,
                d.rating?.toFixed(2),
                d.totalRides
              ])}
            />
          </div>
          <div className="lg:col-span-1">
            <Table
              title="Recent Trips"
              columns={["User", "Driver", "Status", "Fare", "Date"]}
              data={recentTrips.map(t => [
                t.user?.username,
                t.driver?.user?.username || '—',
                t.status,
                t.fare ? `₹${t.fare}` : '—',
                t.requestedAt ? new Date(t.requestedAt).toLocaleString() : '—'
              ])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 