import React, { useEffect, useState } from 'react';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import DriverHeader from '../components/DriverHeader';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, IndianRupee } from 'lucide-react';

const DriverEarnings = () => {
    const [earnings, setEarnings] = useState(0);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [summary, trips] = await Promise.all([
                    driverAPI.getSummary(),
                    driverAPI.getMyTrips(),
                ]);
                const completedTrips = trips
                    .filter(t => t.status === 'COMPLETED')
                    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
                setHistory(completedTrips);

                // Use summary earnings, but fallback to computing from completed trips
                let totalEarnings = Number(summary?.earnings ?? 0);
                if (!totalEarnings && completedTrips.length > 0) {
                    totalEarnings = completedTrips.reduce((sum, trip) => sum + (Number(trip.fare) || 0), 0);
                }
                setEarnings(totalEarnings);
            } catch (err) {
                error('Failed to fetch earnings data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [error]);

    return (
        <>
            <DriverHeader />
            <div className="page-container">
                <div className="page-content py-6 sm:py-8 max-w-4xl mx-auto">
                    <div className="page-header mb-8">
                        <h1 className="page-title">Your Earnings</h1>
                        <p className="page-subtitle">Track your income and trip history</p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="skeleton h-32 rounded-2xl" />
                            <div className="skeleton h-64 rounded-2xl" />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-in">
                            {/* Total Earnings Card */}
                            <div className="card bg-gradient-to-br from-emerald-500 to-teal-600 border-none text-white p-6 sm:p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
                                
                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div>
                                        <p className="text-emerald-50 font-medium mb-1">Total Earnings</p>
                                        <h2 className="text-4xl sm:text-5xl font-bold flex items-center">
                                            <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 mr-1" />
                                            {earnings ? earnings.toLocaleString('en-IN') : '0'}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>+12% this week</span>
                                    </div>
                                </div>
                            </div>

                            {/* Earnings Breakdown (Recent trips) */}
                            <div>
                                <h2 className="section-title mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-emerald-500" /> Recent Transactions
                                </h2>
                                
                                {history.length === 0 ? (
                                    <div className="card p-12 text-center">
                                        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <DollarSign className="w-8 h-8 text-surface-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No earnings yet</h3>
                                        <p className="text-sm text-surface-500 dark:text-surface-400">Complete some trips to start earning.</p>
                                    </div>
                                ) : (
                                    <div className="card overflow-hidden">
                                        <div className="divide-y divide-surface-100 dark:divide-surface-700/50">
                                            {history.map((trip) => (
                                                <div key={trip.id} className="p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-surface-900 dark:text-white line-clamp-1">{trip.destination}</p>
                                                            <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1 mt-0.5">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(trip.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
                                                            +<IndianRupee className="w-3 h-3 mx-0.5" />{trip.fare ? trip.fare.toFixed(2) : '0'}
                                                        </p>
                                                        <p className="text-xs text-surface-400">Trip Fare</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DriverEarnings;