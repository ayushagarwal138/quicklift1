import React, { useEffect, useState } from 'react';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import DriverHeader from '../components/DriverHeader';
import DriverTripHistoryList from '../components/DriverTripHistoryList';

const DriverHistory = () => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const fetchedTrips = await driverAPI.getMyTrips();
                setTrips(fetchedTrips.filter(t => t.status === 'COMPLETED' || t.status === 'CANCELLED')
                                     .sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
            } catch (err) {
                error('Failed to fetch history.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [error]);

    return (
        <>
            <DriverHeader />
            <div className="page-container">
                <div className="page-content py-6 sm:py-8 max-w-4xl mx-auto">
                    <div className="page-header mb-8">
                        <h1 className="page-title">Trip History</h1>
                        <p className="page-subtitle">View your past rides and details</p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <DriverTripHistoryList trips={trips} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DriverHistory;