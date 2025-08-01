import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';
import { useToast } from '../context/ToastContext';
import { Users, Car, Map, CheckCircle, TrendingUp, UserCheck, Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
  const { error, success } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedDriverIds, setSelectedDriverIds] = useState([]);

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

  // User selection logic
  const toggleUser = (id) => {
    setSelectedUserIds((prev) => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };
  const selectAllUsers = () => {
    if (selectedUserIds.length === users.length) setSelectedUserIds([]);
    else setSelectedUserIds(users.map(u => u.id));
  };

  // Driver selection logic
  const toggleDriver = (id) => {
    setSelectedDriverIds((prev) => prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]);
  };
  const selectAllDrivers = () => {
    if (selectedDriverIds.length === drivers.length) setSelectedDriverIds([]);
    else setSelectedDriverIds(drivers.map(d => d.id));
  };

  // Bulk delete users
  const handleBulkDeleteUsers = async () => {
    if (selectedUserIds.length === 0) return error('No users selected.');
    if (!window.confirm('Delete selected users permanently?')) return;
    let successCount = 0;
    for (const id of selectedUserIds) {
      try {
        await adminAPI.deleteUser(id);
        successCount++;
      } catch {}
    }
    setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
    setSelectedUserIds([]);
    if (successCount > 0) {
      success(`Deleted ${successCount} user(s)`);
    }
  };

  // Bulk delete drivers
  const handleBulkDeleteDrivers = async () => {
    if (selectedDriverIds.length === 0) return error('No drivers selected.');
    if (!window.confirm('Delete selected drivers permanently?')) return;
    let successCount = 0;
    for (const id of selectedDriverIds) {
      try {
        await adminAPI.deleteDriver(id);
        successCount++;
      } catch {}
    }
    setDrivers(drivers.filter(d => !selectedDriverIds.includes(d.id)));
    setSelectedDriverIds([]);
    if (successCount > 0) success(`Deleted ${successCount} driver(s)`);
  };

  // Mock chart data (last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData = months.map((month, i) => ({
    month,
    users: Math.round(totalUsers * (0.5 + 0.1 * i)),
    drivers: Math.round(totalDrivers * (0.5 + 0.12 * i)),
    revenue: Math.round(totalRevenue * (0.5 + 0.15 * i)),
  }));

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
        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Platform Trends (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#2563eb" name="Users" strokeWidth={2} />
              <Line type="monotone" dataKey="drivers" stroke="#22c55e" name="Drivers" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e42" name="Revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
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
            <div className="flex items-center mb-2">
              <button onClick={handleBulkDeleteUsers} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded mr-2 disabled:opacity-50" disabled={selectedUserIds.length === 0}>Delete Selected</button>
              <span className="text-sm text-gray-500">{selectedUserIds.length} selected</span>
            </div>
            <Table
              title="All Users"
              columns={[<input type="checkbox" checked={selectedUserIds.length === users.length && users.length > 0} onChange={selectAllUsers} />, "Username", "Email", "Role", "Joined"]}
              data={users.map(u => [
                <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleUser(u.id)} />,
                u.username,
                u.email,
                u.role,
                u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '\u2014',
              ])}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="flex items-center mb-2">
              <button onClick={handleBulkDeleteDrivers} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded mr-2 disabled:opacity-50" disabled={selectedDriverIds.length === 0}>Delete Selected</button>
              <span className="text-sm text-gray-500">{selectedDriverIds.length} selected</span>
            </div>
            <Table
              title="All Drivers"
              columns={[<input type="checkbox" checked={selectedDriverIds.length === drivers.length && drivers.length > 0} onChange={selectAllDrivers} />, "Name", "Vehicle", "Status", "Rating", "Rides"]}
              data={drivers.map(d => [
                <input type="checkbox" checked={selectedDriverIds.includes(d.id)} onChange={() => toggleDriver(d.id)} />,
                d.user?.firstName + ' ' + d.user?.lastName,
                `${d.vehicleType} (${d.vehicleModel})`,
                d.status,
                d.rating?.toFixed(2),
                d.totalRides,
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