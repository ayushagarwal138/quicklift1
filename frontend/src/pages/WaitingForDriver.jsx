import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getAuthenticatedWsUrl, getStompConnectHeaders } from '../api/ws';
import { Car } from 'lucide-react';

const WaitingForDriver = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const client = new Client({
      brokerURL: undefined,
      webSocketFactory: () => new SockJS(getAuthenticatedWsUrl()),
      connectHeaders: getStompConnectHeaders(),
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
    return () => client.deactivate();
  }, [tripId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 p-6">
      <div className="card p-10 max-w-md w-full text-center">
        {/* Animated car */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-brand-100 dark:bg-brand-900/20 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-2 bg-brand-50 dark:bg-brand-900/30 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-10 h-10 text-brand-600 dark:text-brand-400 animate-bounce-subtle" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
          Finding your driver...
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mb-6">
          Your ride request has been sent. We're connecting you with a nearby driver.
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
