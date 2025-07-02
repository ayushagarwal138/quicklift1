import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../api/trips';
import { driverAPI } from '../api/driver';
import { useToast } from '../context/ToastContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SelectDriver = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const [trip, setTrip] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [rejectedByDriver, setRejectedByDriver] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await tripsAPI.getTripById(tripId);
        setTrip(data);
      } catch (err) {
        setTrip(null);
      }
    };
    const fetchDrivers = async () => {
      try {
        const data = await driverAPI.getOnlineDrivers();
        setDrivers(data);
      } catch (err) {
        setDrivers([]);
      }
    };
    fetchTrip();
    fetchDrivers();
  }, [tripId]);

  useEffect(() => {
    if (!tripId) return;
    const socketFactory = () => new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: socketFactory,
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    client.onConnect = () => {
      client.subscribe(`/topic/trip/${tripId}/status`, (message) => {
        try {
          const trip = JSON.parse(message.body);
          if (trip.status === 'ACCEPTED') {
            success('Your ride has been accepted by the driver!');
            navigate(`/trips/${tripId}/confirm`);
          } else if (trip.status === 'REJECTED') {
            setWaitingForResponse(false);
            setRejectedByDriver(true);
            setSelectedDriver(null);
          }
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
      await tripsAPI.requestToDriver({
        pickupLocation: trip.pickupLocation,
        destination: trip.destination,
        vehicleType: trip.requestedVehicleType,
        notes: trip.notes || '',
        pickupLatitude: trip.pickupLatitude,
        pickupLongitude: trip.pickupLongitude,
        destinationLatitude: trip.destinationLatitude,
        destinationLongitude: trip.destinationLongitude,
      }, driver.id);
      setRequestSuccess(driver.id);
    } catch (err) {
      setRequestSuccess(false);
      setWaitingForResponse(false);
    }
    setRequesting(false);
  };

  if (!trip) return <div className="text-center py-10">Loading trip details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Select a Driver for Your Ride</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Trip Details</h2>
          <div className="mb-2"><strong>Pickup:</strong> {trip.pickupLocation}</div>
          <div className="mb-2"><strong>Destination:</strong> {trip.destination}</div>
          <div className="mb-2"><strong>Vehicle Type:</strong> {trip.requestedVehicleType}</div>
          <div className="mb-2"><strong>Fare:</strong> ₹{trip.fare ? trip.fare.toFixed(2) : 'N/A'}</div>
          {trip.notes && <div className="mb-2"><strong>Notes:</strong> {trip.notes}</div>}
        </div>
        <h2 className="text-lg font-semibold mb-4">Available Drivers</h2>
        {waitingForResponse && selectedDriver && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-800 font-semibold flex items-center gap-2">
            Waiting for {selectedDriver.user.username} to accept your request...
          </div>
        )}
        {rejectedByDriver && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded text-red-800 font-semibold flex items-center gap-2">
            The driver rejected your request. Please select another driver.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drivers.length === 0 ? (
            <div className="col-span-full text-gray-500">No drivers online right now.</div>
          ) : (
            drivers.map(driver => (
              <div key={driver.id} className={`bg-white rounded-lg shadow p-4 flex flex-col items-center ${selectedDriver && selectedDriver.id === driver.id ? 'ring-2 ring-blue-400' : ''}`}>
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <span role="img" aria-label="car">🚗</span>
                </div>
                <div className="font-semibold">{driver.user.username}</div>
                <div className="text-xs text-gray-500">{driver.vehicleType} - {driver.vehiclePlateNumber}</div>
                <button
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  onClick={() => handleSendRequest(driver)}
                  disabled={requesting || waitingForResponse}
                >
                  {requestSuccess === driver.id ? 'Request Sent!' : 'Send Request'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectDriver; 