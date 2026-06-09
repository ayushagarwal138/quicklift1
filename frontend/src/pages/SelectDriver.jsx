import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../api/trips';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthenticatedWsUrl, getStompConnectHeaders } from '../api/ws';
import UserHeader from '../components/Header';
import { MapPin, Navigation, Car, User, Loader2, IndianRupee } from 'lucide-react';

const SelectDriver = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [trip, setTrip] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [rejectedByDriver, setRejectedByDriver] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => { try { const data = await tripsAPI.getTripById(tripId); setTrip(data); } catch { setTrip(null); } };
    const fetchDrivers = async () => { try { const data = await driverAPI.getOnlineDrivers(); setDrivers(data); } catch { setDrivers([]); } };
    fetchTrip();
    fetchDrivers();
  }, [tripId]);

  useEffect(() => {
    if (!tripId) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(getAuthenticatedWsUrl()),
      connectHeaders: getStompConnectHeaders(),
      debug: () => {},
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      client.subscribe(`/topic/trip/${tripId}/status`, (message) => {
        try {
          const trip = JSON.parse(message.body);
          if (trip.status === 'ACCEPTED') { success('Your ride has been accepted!'); navigate(`/trips/${tripId}/confirm`); }
          else if (trip.status === 'REJECTED') { setWaitingForResponse(false); setRejectedByDriver(true); setSelectedDriver(null); }
        } catch {}
      });
    };
    client.activate();
    return () => client.deactivate();
  }, [tripId, navigate, success]);

  const handleSendRequest = async (driver) => {
    setRequesting(true);
    setSelectedDriver(driver);
    setWaitingForResponse(true);
    setRejectedByDriver(false);
    try {
      const updatedTrip = await tripsAPI.requestExistingTripToDriver(trip.id, driver.id);
      setTrip(updatedTrip);
      setRequestSuccess(driver.id);
    } catch (err) {
      setRequestSuccess(false);
      setWaitingForResponse(false);
      error('Failed to send request.');
    }
    setRequesting(false);
  };

  if (!trip) return (
    <>
      <UserHeader />
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    </>
  );

  return (
    <>
      <UserHeader />
      <div className="page-container">
        <div className="page-content py-6 sm:py-8">
          <div className="page-header">
            <h1 className="page-title">Select a Driver</h1>
            <p className="page-subtitle">Choose from available drivers for your ride</p>
          </div>

          {/* Trip Summary */}
          <div className="card p-5 mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase">Pickup</p>
                  <p className="text-sm text-surface-900 dark:text-white">{trip.pickupLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                  <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 uppercase">Destination</p>
                  <p className="text-sm text-surface-900 dark:text-white">{trip.destination}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-100 dark:border-surface-700/50">
              <span className="badge-info">{trip.requestedVehicleType}</span>
              <span className="flex items-center gap-1 font-bold text-surface-900 dark:text-white">
                <IndianRupee className="w-4 h-4" />{trip.fare ? trip.fare.toFixed(2) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {waitingForResponse && selectedDriver && (
            <div className="card p-4 mb-6 bg-brand-50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-800/30 animate-fade-in">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-brand-600 dark:text-brand-400" />
                <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  Waiting for {selectedDriver.user.username} to respond...
                </p>
              </div>
            </div>
          )}
          {rejectedByDriver && (
            <div className="card p-4 mb-6 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 animate-fade-in">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Driver declined your request. Please try another driver.
              </p>
            </div>
          )}

          {/* Driver Grid */}
          <h2 className="section-title mb-4">Available Drivers</h2>
          {drivers.length === 0 ? (
            <div className="card p-12 text-center">
              <Car className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No drivers online</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">Please wait for drivers to come online.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map(driver => (
                <div key={driver.id} className={`card-hover p-5 text-center ${selectedDriver?.id === driver.id ? 'ring-2 ring-brand-500' : ''}`}>
                  <div className="w-14 h-14 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-7 h-7 text-surface-500 dark:text-surface-400" />
                  </div>
                  <h3 className="font-semibold text-surface-900 dark:text-white">{driver.user.username}</h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{driver.vehicleType} • {driver.vehiclePlateNumber}</p>
                  <button
                    className="btn-primary btn-sm w-full mt-4"
                    onClick={() => handleSendRequest(driver)}
                    disabled={requesting || waitingForResponse}
                  >
                    {requestSuccess === driver.id ? '✓ Request Sent' : 'Send Request'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectDriver;
