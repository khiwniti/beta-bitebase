import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatEvent {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  duration?: number; // in milliseconds, how long to show the event
}

export function ChatEvents() {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Generate random events for demonstration
  useEffect(() => {
    const eventTypes: ChatEvent['type'][] = ['info', 'success', 'warning', 'error'];
    const messages = [
      'Searching for restaurants...',
      'Found 15 restaurants in the area',
      'Analyzing competitor data',
      'Matching restaurants across platforms',
      'Calculating buffer zone',
      'Processing location data',
      'Fetching menu information',
      'Analyzing customer reviews',
      'Generating market insights',
      'Updating location pins',
      'Calculating distance metrics',
      'Optimizing search results',
      'Applying filters to results',
      'Checking for duplicates',
      'Validating restaurant data',
      'Preparing visualization',
      'Updating map markers',
      'Refreshing data cache',
      'Connecting to API endpoints',
      'Processing user request'
    ];

    // Initial events
    setEvents([
      {
        id: '1',
        type: 'info',
        message: 'System initialized and ready',
        timestamp: new Date(),
        duration: 5000
      },
      {
        id: '2',
        type: 'success',
        message: 'Connected to restaurant database',
        timestamp: new Date(),
        duration: 5000
      }
    ]);

    // Add new events periodically
    const interval = setInterval(() => {
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const newEvent: ChatEvent = {
        id: Date.now().toString(),
        type: randomType,
        message: randomMessage,
        timestamp: new Date(),
        duration: 5000 // Show for 5 seconds
      };

      setEvents(prev => [...prev, newEvent]);

      // Remove events after their duration
      setTimeout(() => {
        setEvents(prev => prev.filter(event => event.id !== newEvent.id));
      }, newEvent.duration);

    }, 3000); // Add new event every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: ChatEvent['type']) => {
    switch (type) {
      case 'info':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getEventColor = (type: ChatEvent['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-500';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg shadow-xl backdrop-blur-sm text-white overflow-hidden w-full h-full">
      <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md border border-gray-600">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-sm">Event Log</h3>
            <p className="text-xs text-gray-400">
              {events.length} events • {events.filter(e => e.type === 'error').length} errors
            </p>
          </div>
        </div>
        <motion.button
          className="bg-gray-800/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1"
          onClick={() => setIsVisible(!isVisible)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isVisible ? (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide Events
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Show Events ({events.length})
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="space-y-2 p-3 max-h-[calc(100vh-200px)] overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                className={`p-2 rounded-lg border backdrop-blur-sm text-xs flex items-start gap-2 ${getEventColor(event.type)}`}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                layout
              >
                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="font-medium">{event.message}</div>
                  <div className="text-[10px] opacity-70">{event.timestamp.toLocaleTimeString()}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
