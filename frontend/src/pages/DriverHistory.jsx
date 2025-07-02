import React, { useEffect, useState } from 'react';
import { driverAPI } from '../api/driver';
import DriverTripHistoryList from '../components/DriverTripHistoryList';

const DriverHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const trips = await driverAPI.getMyTrips();
      setTrips(trips.filter(trip => trip.status === 'COMPLETED' || trip.status === 'CANCELLED'));
      setLoading(false);
    };
    fetchTrips();
  }, []);

  if (loading) return <div className="text-center py-10">Loading trip history...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Trip History</h1>
      <DriverTripHistoryList trips={trips} />
    </div>
  );
};

export default DriverHistory; 