import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';
import { useToast } from '../context/ToastContext';
import { Users, Car, Map, CheckCircle, TrendingUp, UserCheck, Trash2, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card">
    <div className={`stat-icon ${color}`}>{icon}</div>
    <div>
      <p className="stat-label">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const DataTable = ({ title, columns, data, renderRow }) => (
  <div className="card overflow-hidden">
    <div className="p-5 border-b border-surface-100 dark:border-surface-700/50">
      <h2 className="section-title">{title}</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-800/50">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-surface-400">No data available</td></tr>
          ) : (
            data.map((row, i) => renderRow(row, i))
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

  const totalUsers = users.length;
  const totalDrivers = drivers.length;
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;
  const activeDrivers = drivers.filter(d => d.status === 'ONLINE').length;
  const totalRevenue = trips.reduce((sum, t) => sum + (t.fare || 0), 0);

  const recentTrips = trips.slice(-10).reverse();

  const toggleUser = (id) => setSelectedUserIds((prev) => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  const selectAllUsers = () => { if (selectedUserIds.length === users.length) setSelectedUserIds([]); else setSelectedUserIds(users.map(u => u.id)); };
  const toggleDriver = (id) => setSelectedDriverIds((prev) => prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]);
  const selectAllDrivers = () => { if (selectedDriverIds.length === drivers.length) setSelectedDriverIds([]); else setSelectedDriverIds(drivers.map(d => d.id)); };

  const handleBulkDeleteUsers = async () => {
    if (selectedUserIds.length === 0) return error('No users selected.');
    if (!window.confirm('Delete selected users permanently?')) return;
    let successCount = 0;
    for (const id of selectedUserIds) { try { await adminAPI.deleteUser(id); successCount++; } catch {} }
    setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
    setSelectedUserIds([]);
    if (successCount > 0) success(`Deleted ${successCount} user(s)`);
  };

  const handleBulkDeleteDrivers = async () => {
    if (selectedDriverIds.length === 0) return error('No drivers selected.');
    if (!window.confirm('Delete selected drivers permanently?')) return;
    let successCount = 0;
    for (const id of selectedDriverIds) { try { await adminAPI.deleteDriver(id); successCount++; } catch {} }
    setDrivers(drivers.filter(d => !selectedDriverIds.includes(d.id)));
    setSelectedDriverIds([]);
    if (successCount > 0) success(`Deleted ${successCount} driver(s)`);
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData = months.map((month, i) => ({
    month,
    users: Math.round(totalUsers * (0.5 + 0.1 * i)),
    drivers: Math.round(totalDrivers * (0.5 + 0.12 * i)),
    revenue: Math.round(totalRevenue * (0.5 + 0.15 * i)),
  }));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      case 'REQUESTED': return 'badge-warning';
      case 'ACCEPTED': case 'STARTED': return 'badge-info';
      case 'ONLINE': return 'badge-success';
      case 'OFFLINE': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-content py-8">
          <div className="skeleton h-10 w-48 rounded-xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-700/40">
        <div className="page-content">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-surface-900 dark:text-white">Admin Panel</h1>
                <p className="text-xs text-surface-500 dark:text-surface-400">QuickLift Management</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="btn-ghost text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="page-content py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Users" value={totalUsers} icon={<Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />} color="bg-brand-50 dark:bg-brand-900/20" />
          <StatCard title="Drivers" value={totalDrivers} icon={<Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} color="bg-emerald-50 dark:bg-emerald-900/20" />
          <StatCard title="Trips" value={totalTrips} icon={<Map className="w-5 h-5 text-purple-600 dark:text-purple-400" />} color="bg-purple-50 dark:bg-purple-900/20" />
          <StatCard title="Completed" value={completedTrips} icon={<CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />} color="bg-teal-50 dark:bg-teal-900/20" />
          <StatCard title="Active" value={activeDrivers} icon={<UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />} color="bg-amber-50 dark:bg-amber-900/20" />
          <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5 text-pink-600 dark:text-pink-400" />} color="bg-pink-50 dark:bg-pink-900/20" />
        </div>

        {/* Chart */}
        <div className="card p-6 mb-8">
          <h2 className="section-title mb-6">Platform Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-200 dark:text-surface-700" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', backgroundColor: 'white' }} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3366ff" name="Users" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="drivers" stroke="#10b981" name="Drivers" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" name="Revenue" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Users Table */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={handleBulkDeleteUsers} className="btn-danger btn-sm" disabled={selectedUserIds.length === 0}>
                <Trash2 className="w-4 h-4" /> Delete ({selectedUserIds.length})
              </button>
            </div>
            <DataTable
              title="All Users"
              columns={['', 'Username', 'Email', 'Role']}
              data={users}
              renderRow={(u, i) => (
                <tr key={u.id || i} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleUser(u.id)} className="rounded border-surface-300 text-brand-600 focus:ring-brand-500" /></td>
                  <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">{u.username}</td>
                  <td className="px-4 py-3 text-sm text-surface-500 dark:text-surface-400">{u.email}</td>
                  <td className="px-4 py-3"><span className="badge-neutral">{u.role}</span></td>
                </tr>
              )}
            />
          </div>

          {/* Drivers Table */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={handleBulkDeleteDrivers} className="btn-danger btn-sm" disabled={selectedDriverIds.length === 0}>
                <Trash2 className="w-4 h-4" /> Delete ({selectedDriverIds.length})
              </button>
            </div>
            <DataTable
              title="All Drivers"
              columns={['', 'Name', 'Vehicle', 'Status', 'Rating']}
              data={drivers}
              renderRow={(d, i) => (
                <tr key={d.id || i} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedDriverIds.includes(d.id)} onChange={() => toggleDriver(d.id)} className="rounded border-surface-300 text-brand-600 focus:ring-brand-500" /></td>
                  <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">{d.user?.firstName} {d.user?.lastName}</td>
                  <td className="px-4 py-3 text-sm text-surface-500 dark:text-surface-400">{d.vehicleType} ({d.vehicleModel})</td>
                  <td className="px-4 py-3"><span className={getStatusBadge(d.status)}>{d.status}</span></td>
                  <td className="px-4 py-3 text-sm text-surface-900 dark:text-white">{d.rating?.toFixed(2)}</td>
                </tr>
              )}
            />
          </div>
        </div>

        {/* Recent Trips */}
        <DataTable
          title="Recent Trips"
          columns={['User', 'Driver', 'Status', 'Fare', 'Date']}
          data={recentTrips}
          renderRow={(t, i) => (
            <tr key={t.id || i} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">{t.user?.username}</td>
              <td className="px-4 py-3 text-sm text-surface-500 dark:text-surface-400">{t.driver?.user?.username || '—'}</td>
              <td className="px-4 py-3"><span className={getStatusBadge(t.status)}>{t.status}</span></td>
              <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">{t.fare ? `₹${t.fare}` : '—'}</td>
              <td className="px-4 py-3 text-sm text-surface-500 dark:text-surface-400">{t.requestedAt ? new Date(t.requestedAt).toLocaleString() : '—'}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;