import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { tripsAPI } from '../api/trips';
import { useToast } from '../context/ToastContext';
import { Car, MapPin, Navigation, User, CheckCircle, Clock, Send } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripData = await tripsAPI.getTripById(tripId);
        setTrip(tripData);
        if (tripData.driver) {
           // Set initial driver location if available, otherwise use pickup location
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
    
    // Setup WebSocket connection
    const socketFactory = () => new SockJS(import.meta.env.VITE_WS_BASE_URL);
    
    const client = new Client({
        webSocketFactory: socketFactory,
        debug: (str) => {
            console.log(new Date(), str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
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
            setChatMessages((prev) => [...prev, { sender: 'other', text: message.body }]);
        });
    };

    client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [tripId, error, info]);
  
  useEffect(() => {
    if (trip && trip.status === 'COMPLETED' && !trip.paid) {
      navigate(`/payment/${trip.id}`);
    }
  }, [trip, navigate]);
  
  if (isLoading) return <div className="text-center py-10">Loading Trip Details...</div>;
  if (!trip) return <div className="text-center py-10">Trip not found.</div>;
  
  const pickupPosition = [trip.pickupLatitude, trip.pickupLongitude];
  const destinationPosition = [trip.destinationLatitude, trip.destinationLongitude];
  const driverPosition = driverLocation ? [driverLocation.lat, driverLocation.lng] : null;
  
  const bounds = [pickupPosition, destinationPosition];
  if (driverPosition) {
      bounds.push(driverPosition);
  }

  const sendChatMessage = () => {
    if (chatInput.trim() && stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: `/app/chat/${tripId}`,
        body: chatInput,
      });
      setChatMessages((prev) => [...prev, { sender: 'me', text: chatInput }]);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracking Your Trip</h1>
                <p className="text-gray-600">Trip ID: {trip.id}</p>
            </div>
            
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-2 h-[600px] flex flex-col">
                    <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }} boundsOptions={{ padding: [50, 50] }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={pickupPosition}>
                            <Popup>Pickup: {trip.pickupLocation}</Popup>
                        </Marker>
                        <Marker position={destinationPosition}>
                            <Popup>Destination: {trip.destination}</Popup>
                        </Marker>
                        {driverPosition && (
                             <Marker position={driverPosition} icon={driverIcon}>
                                <Popup>Your driver is here.</Popup>
                            </Marker>
                        )}
                        <Polyline positions={[pickupPosition, destinationPosition]} color="blue" />
                    </MapContainer>
                    {/* Chat Box */}
                    <div className="mt-4 flex flex-col flex-grow justify-end">
                      <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto flex flex-col-reverse">
                        {[...chatMessages].reverse().map((msg, idx) => (
                          <div key={idx} className={`mb-2 flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'}`}>{msg.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex mt-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
                          className="flex-grow px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-blue-500"
                          placeholder="Type a message..."
                        />
                        <button
                          onClick={sendChatMessage}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Trip Status: {trip.status}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="font-semibold text-sm">From</p>
                                    <p className="text-xs text-gray-600">{trip.pickupLocation}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Navigation className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="font-semibold text-sm">To</p>
                                    <p className="text-xs text-gray-600">{trip.destination}</p>
                                </div>
                            </div>
                        </div>
                        {trip.status === 'COMPLETED' && !trip.paid && trip.paymentMethod !== 'CASH' && (
                          <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mt-4"
                            onClick={() => navigate(`/payment/${trip.id}`)}
                          >
                            Pay Now
                          </button>
                        )}
                        {trip.status === 'COMPLETED' && trip.paid && (
                          <div className="text-green-600 font-semibold mt-4">Payment completed</div>
                        )}
                    </div>
                     {trip.driver && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Driver Details</h3>
                             <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{trip.driver.user.username}</p>
                                    <p className="text-sm text-gray-500">{trip.driver.vehicleType} - {trip.driver.vehiclePlateNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default TripTracking; 