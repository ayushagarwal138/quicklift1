import React, { useState } from 'react';
import { Calendar, MapPin, Clock, DollarSign, Star, Filter, Search, Car } from 'lucide-react';

const TripHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Mock trip data
  const trips = [
    {
      id: 1,
      pickupLocation: '123 Main St, Downtown',
      destination: '456 Oak Ave, Uptown',
      date: '2024-01-15',
      time: '14:30',
      status: 'COMPLETED',
      fare: 25.50,
      driverName: 'John Smith',
      vehicleType: 'SEDAN',
      rating: 5,
      distance: '8.5 km',
      duration: '15 min'
    },
    {
      id: 2,
      pickupLocation: '789 Pine St, Midtown',
      destination: '321 Elm St, Westside',
      date: '2024-01-14',
      time: '09:15',
      status: 'COMPLETED',
      fare: 18.75,
      driverName: 'Sarah Johnson',
      vehicleType: 'SUV',
      rating: 4,
      distance: '6.2 km',
      duration: '12 min'
    },
    {
      id: 3,
      pickupLocation: '555 Cedar Ave, Eastside',
      destination: '777 Maple Dr, Northside',
      date: '2024-01-13',
      time: '16:45',
      status: 'CANCELLED',
      fare: 0,
      driverName: 'Mike Wilson',
      vehicleType: 'LUXURY',
      rating: null,
      distance: '12.1 km',
      duration: '20 min'
    },
    {
      id: 4,
      pickupLocation: '999 Birch Rd, Southside',
      destination: '111 Spruce Ln, Central',
      date: '2024-01-12',
      time: '11:20',
      status: 'COMPLETED',
      fare: 32.00,
      driverName: 'Lisa Brown',
      vehicleType: 'VAN',
      rating: 5,
      distance: '10.8 km',
      duration: '18 min'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'ONGOING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'SEDAN': return '🚗';
      case 'SUV': return '🚙';
      case 'LUXURY': return '🏎️';
      case 'MOTORCYCLE': return '🏍️';
      case 'VAN': return '🚐';
      default: return '🚗';
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip History</h1>
          <p className="text-gray-600">View and manage your past and upcoming trips</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search trips by location or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="ONGOING">Ongoing</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trip Cards */}
        <div className="space-y-6">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Trip Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getVehicleIcon(trip.vehicleType)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Trip #{trip.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {trip.vehicleType} • {trip.driverName}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup</p>
                            <p className="text-sm text-gray-600">{trip.pickupLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Destination</p>
                            <p className="text-sm text-gray-600">{trip.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(trip.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{trip.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📏</span>
                          <span>{trip.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>⏱️</span>
                          <span>{trip.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trip Actions and Fare */}
                    <div className="lg:ml-6 mt-4 lg:mt-0">
                      <div className="text-right mb-4">
                        {trip.status === 'COMPLETED' && (
                          <div className="flex items-center justify-end gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (trip.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">({trip.rating})</span>
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">
                          {trip.status === 'CANCELLED' ? 'Cancelled' : `₹${trip.fare.toFixed(2)}`}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          View Details
                        </button>
                        {trip.status === 'COMPLETED' && (
                          <button className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                            Book Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {trips.filter(t => t.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-600">Completed Trips</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              ₹{trips.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.fare, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {(trips.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / trips.filter(t => t.rating).length || 0).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {trips.filter(t => t.status === 'CANCELLED').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled Trips</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripHistory; 