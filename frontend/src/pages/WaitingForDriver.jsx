import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WaitingForDriver = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const client = new Client({
      brokerURL: undefined, // Use SockJS
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_BASE_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        client.subscribe(`/topic/trip/${tripId}/status`, (message) => {
          const trip = JSON.parse(message.body);
          if (trip.status === 'ACCEPTED') {
            client.deactivate();
            navigate(`/trips/${tripId}/confirm`);
          }
        });
      },
    });
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [tripId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Waiting for a driver...</h1>
        <p className="text-gray-600">Your ride request has been sent. Please wait while we connect you to a driver.</p>
      </div>
    </div>
  );
};

export default WaitingForDriver; 