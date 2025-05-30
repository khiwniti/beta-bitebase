import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiCall {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
  duration?: number; // in milliseconds
  requestData?: any;
  responseData?: any;
}

export function ApiMonitor() {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  // Generate random API calls for demonstration
  useEffect(() => {
    const endpoints = [
      '/api/restaurants',
      '/api/restaurants/match',
      '/api/geocode',
      '/api/analytics',
      '/api/reviews',
      '/api/platforms',
      '/api/search'
    ];

    const methods: ApiCall['method'][] = ['GET', 'POST', 'PUT', 'DELETE'];

    // Initial API calls
    setApiCalls([
      {
        id: '1',
        endpoint: '/api/restaurants',
        method: 'GET',
        status: 'success',
        timestamp: new Date(Date.now() - 5000),
        duration: 320,
        requestData: { latitude: 13.7563, longitude: 100.5018, radius: 1.0 },
        responseData: { count: 15, data: '[...]' }
      }
    ]);

    // Add new API calls periodically
    const interval = setInterval(() => {
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];

      const newCall: ApiCall = {
        id: Date.now().toString(),
        endpoint: randomEndpoint,
        method: randomMethod,
        status: 'pending',
        timestamp: new Date(),
        requestData: {
          latitude: 13.7563 + (Math.random() * 0.01),
          longitude: 100.5018 + (Math.random() * 0.01),
          radius: Math.round(Math.random() * 5 * 10) / 10
        }
      };

      setApiCalls(prev => [...prev, newCall]);

      // Simulate API response after a random delay
      setTimeout(() => {
        const duration = Math.floor(Math.random() * 1000) + 200; // 200-1200ms
        const status: ApiCall['status'] = Math.random() > 0.1 ? 'success' : 'error';

        setApiCalls(prev =>
          prev.map(call =>
            call.id === newCall.id
              ? {
                  ...call,
                  status,
                  duration,
                  responseData: status === 'success'
                    ? { count: Math.floor(Math.random() * 20), data: '[...]' }
                    : { error: 'Request failed', code: 500 }
                }
              : call
          )
        );
      }, Math.floor(Math.random() * 1000) + 500); // 500-1500ms delay

    }, 5000); // Add new API call every 5 seconds

    // Cleanup old API calls
    const cleanupInterval = setInterval(() => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      setApiCalls(prev => prev.filter(call => call.timestamp > fiveMinutesAgo));
    }, 60000); // Clean up every minute

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, []);

  const getMethodColor = (method: ApiCall['method']) => {
    switch (method) {
      case 'GET': return 'bg-blue-500 text-white';
      case 'POST': return 'bg-green-500 text-white';
      case 'PUT': return 'bg-yellow-500 text-white';
      case 'DELETE': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: ApiCall['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: ApiCall['status']) => {
    switch (status) {
      case 'pending':
        return (
          <motion.svg
            className="w-4 h-4 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg shadow-xl backdrop-blur-sm text-white overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', height: '100%' }}
    >
      <div
        className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-md border border-gray-600">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-sm">API Monitor</h3>
            <p className="text-xs text-gray-400">
              {apiCalls.length} calls • {apiCalls.filter(c => c.status === 'pending').length} pending
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="max-h-96 overflow-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-2 space-y-2">
              {apiCalls.map((call) => (
                <motion.div
                  key={call.id}
                  className={`bg-black/20 rounded-lg p-2 cursor-pointer ${selectedCall === call.id ? 'ring-1 ring-blue-500' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedCall(selectedCall === call.id ? null : call.id)}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(call.method)}`}>
                        {call.method}
                      </span>
                      <span className="text-sm font-mono truncate max-w-[150px]">{call.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(call.status)}
                      <span className="text-xs">{call.duration ? `${call.duration}ms` : '...'}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedCall === call.id && (
                      <motion.div
                        className="mt-2 pt-2 border-t border-gray-700 text-xs"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="mb-2">
                          <div className="text-gray-400 mb-1">Request:</div>
                          <pre className="bg-black/30 p-2 rounded overflow-auto max-h-20">
                            {JSON.stringify(call.requestData, null, 2)}
                          </pre>
                        </div>

                        {call.status !== 'pending' && call.responseData && (
                          <div>
                            <div className="text-gray-400 mb-1">Response:</div>
                            <pre className="bg-black/30 p-2 rounded overflow-auto max-h-20">
                              {JSON.stringify(call.responseData, null, 2)}
                            </pre>
                          </div>
                        )}

                        <div className="mt-2 text-gray-400">
                          {call.timestamp.toLocaleTimeString()} • {call.status}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
