import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { tripsAPI } from '../api/trips';
import { getAuthenticatedWsUrl, getStompConnectHeaders } from '../api/ws';
import { useToast } from '../context/ToastContext';
import { MapPin, Navigation, User, Send, IndianRupee, Phone } from 'lucide-react';
import UserHeader from '../components/Header';
import MapResizer from '../components/MapResizer';
import { configureLeafletIcons } from '../utils/leafletIcons';

configureLeafletIcons();

const driverIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/car.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const TripTracking = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { error, info } = useToast();
  
  const [trip, setTrip] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const stompClient = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripData = await tripsAPI.getTripById(tripId);
        setTrip(tripData);
        if (tripData.driver) {
           setDriverLocation({ 
               lat: tripData.driver.currentLatitude || tripData.pickupLatitude,
               lng: tripData.driver.currentLongitude || tripData.pickupLongitude
            });
        }
        setIsLoading(false);
      } catch (err) {
        error('Could not fetch trip details.');
        setIsLoading(false);
      }
    };

    fetchTripData();
    
    const socketFactory = () => new SockJS(getAuthenticatedWsUrl());
    const client = new Client({
        webSocketFactory: socketFactory,
        connectHeaders: getStompConnectHeaders(),
        debug: () => {},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
        info('Connected to trip tracking!');
        client.subscribe(`/topic/trip/${tripId}/location`, (message) => {
            const locationUpdate = JSON.parse(message.body);
            setDriverLocation({ lat: locationUpdate.latitude, lng: locationUpdate.longitude });
        });
        client.subscribe(`/topic/trip/${tripId}/status`, (message) => {
            const updatedTrip = JSON.parse(message.body);
            setTrip(updatedTrip);
        });
        client.subscribe(`/topic/trip/${tripId}/chat`, (message) => {
            setChatMessages((prev) => [...prev, { sender: 'driver', text: message.body, time: new Date() }]);
        });
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [tripId, error, info]);
  
  useEffect(() => {
    if (trip && trip.status === 'COMPLETED' && !trip.paid) {
      navigate(`/payment/${trip.id}`);
    }
  }, [trip, navigate]);

  const sendChatMessage = () => {
    if (chatInput.trim() && stompClient.current?.connected) {
      stompClient.current.publish({ destination: `/app/chat/${tripId}`, body: chatInput });
      setChatMessages((prev) => [...prev, { sender: 'me', text: chatInput, time: new Date() }]);
      setChatInput('');
    }
  };
  
  if (isLoading) return (
    <>
      <UserHeader />
      <div className="page-container"><div className="page-content py-8"><div className="skeleton h-[500px] rounded-2xl" /></div></div>
    </>
  );
  if (!trip) return (
    <>
      <UserHeader />
      <div className="page-container flex items-center justify-center min-h-[60vh]"><p className="text-surface-500">Trip not found.</p></div>
    </>
  );
  
  const pickupPosition = [trip.pickupLatitude, trip.pickupLongitude];
  const destinationPosition = [trip.destinationLatitude, trip.destinationLongitude];
  const driverPosition = driverLocation ? [driverLocation.lat, driverLocation.lng] : null;
  const bounds = [pickupPosition, destinationPosition];
  if (driverPosition) bounds.push(driverPosition);

  const getStatusStep = (status) => {
    switch(status) {
      case 'REQUESTED': return 1;
      case 'ACCEPTED': return 2;
      case 'STARTED': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };
  const statusSteps = ['Requested', 'Accepted', 'In Progress', 'Completed'];
  const currentStep = getStatusStep(trip.status);

  return (
    <>
      <UserHeader />
      <div className="page-container">
        <div className="page-content py-6 sm:py-8">
          {/* Status Steps */}
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i + 1 <= currentStep 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-400'
                    }`}>
                      {i + 1 <= currentStep ? '✓' : i + 1}
                    </div>
                    <span className="text-xs mt-1.5 text-surface-500 dark:text-surface-400 hidden sm:block">{label}</span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i + 1 < currentStep ? 'bg-brand-500' : 'bg-surface-200 dark:bg-surface-700'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map + Chat */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card overflow-hidden h-[320px] sm:h-[400px]">
                <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }} boundsOptions={{ padding: [50, 50] }}>
                    <MapResizer watch={`${trip.status}-${driverLocation?.lat || ''}-${driverLocation?.lng || ''}`} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={pickupPosition}><Popup>Pickup: {trip.pickupLocation}</Popup></Marker>
                    <Marker position={destinationPosition}><Popup>Destination: {trip.destination}</Popup></Marker>
                    {driverPosition && <Marker position={driverPosition} icon={driverIcon}><Popup>Your driver</Popup></Marker>}
                    <Polyline positions={[pickupPosition, destinationPosition]} color="#3366ff" />
                </MapContainer>
              </div>

              {/* Chat */}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-surface-100 dark:border-surface-700/50">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Chat with Driver</h3>
                </div>
                <div className="h-48 overflow-y-auto p-4 space-y-2 bg-surface-50 dark:bg-surface-800/50">
                  {chatMessages.length === 0 && (
                    <p className="text-center text-sm text-surface-400 py-8">No messages yet</p>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        msg.sender === 'me'
                          ? 'bg-brand-600 text-white rounded-br-md'
                          : 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white border border-surface-200 dark:border-surface-600 rounded-bl-md'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-surface-100 dark:border-surface-700/50 flex gap-2">
                  <input
                    type="text" value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
                    className="input flex-1" placeholder="Type a message..."
                  />
                  <button onClick={sendChatMessage} className="btn-primary btn-icon">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Trip Info */}
              <div className="card p-5">
                <h3 className="section-title mb-4 flex items-center gap-2">
                  <span className="badge-info">{trip.status}</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-surface-500 uppercase">From</p>
                      <p className="text-sm text-surface-900 dark:text-white">{trip.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-surface-500 uppercase">To</p>
                      <p className="text-sm text-surface-900 dark:text-white">{trip.destination}</p>
                    </div>
                  </div>
                </div>
                {trip.fare && (
                  <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700/50 flex items-center justify-between">
                    <span className="text-sm text-surface-500">Fare</span>
                    <span className="flex items-center gap-1 text-lg font-bold text-surface-900 dark:text-white">
                      <IndianRupee className="w-4 h-4" />{trip.fare.toFixed(2)}
                    </span>
                  </div>
                )}
                {trip.status === 'COMPLETED' && !trip.paid && (
                  <button className="btn-primary w-full mt-4" onClick={() => navigate(`/payment/${trip.id}`)}>
                    Pay Now
                  </button>
                )}
                {trip.status === 'COMPLETED' && trip.paid && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 text-center">
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Payment completed</p>
                  </div>
                )}
              </div>

              {/* Driver Info */}
              {trip.driver && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Driver</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-surface-500 dark:text-surface-400" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">{trip.driver.user.username}</p>
                      <p className="text-xs text-surface-500">{trip.driver.vehicleType} • {trip.driver.vehiclePlateNumber}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripTracking;
