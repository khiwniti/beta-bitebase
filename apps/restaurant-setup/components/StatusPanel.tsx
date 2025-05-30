import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestaurantData } from '@/lib/hooks/use-restaurant-data';

interface ToolStatus {
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  lastUpdated: Date;
  details?: string;
}

export function StatusPanel() {
  const { loading, error } = useRestaurantData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tools, setTools] = useState<ToolStatus[]>([
    {
      name: 'Location Search',
      status: 'idle',
      lastUpdated: new Date(),
      details: 'Ready to search for locations'
    },
    {
      name: 'Restaurant Data',
      status: 'idle',
      lastUpdated: new Date(),
      details: 'Ready to fetch restaurant data'
    },
    {
      name: 'Buffer Analysis',
      status: 'idle',
      lastUpdated: new Date(),
      details: 'Ready to analyze buffer zone'
    },
    {
      name: 'Platform Matching',
      status: 'idle',
      lastUpdated: new Date(),
      details: 'Ready to match across platforms'
    },
  ]);

  // Update tool status based on loading state
  useEffect(() => {
    if (loading) {
      setTools(prev => prev.map(tool =>
        tool.name === 'Restaurant Data'
          ? { ...tool, status: 'loading', details: 'Fetching restaurant data...', lastUpdated: new Date() }
          : tool
      ));
    } else {
      setTools(prev => prev.map(tool =>
        tool.name === 'Restaurant Data' && tool.status === 'loading'
          ? { ...tool, status: 'success', details: 'Restaurant data fetched successfully', lastUpdated: new Date() }
          : tool
      ));
    }
  }, [loading]);

  // Update tool status based on error state
  useEffect(() => {
    if (error) {
      setTools(prev => prev.map(tool =>
        tool.name === 'Restaurant Data'
          ? { ...tool, status: 'error', details: error, lastUpdated: new Date() }
          : tool
      ));
    }
  }, [error]);

  // Simulate random tool status changes for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      const randomToolIndex = Math.floor(Math.random() * tools.length);
      const randomStatus: ToolStatus['status'] = ['idle', 'loading', 'success', 'error'][Math.floor(Math.random() * 4)] as ToolStatus['status'];

      setTools(prev => prev.map((tool, index) =>
        index === randomToolIndex
          ? {
              ...tool,
              status: randomStatus,
              lastUpdated: new Date(),
              details: getRandomStatusMessage(tool.name, randomStatus)
            }
          : tool
      ));
    }, 5000); // Change status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getRandomStatusMessage = (toolName: string, status: ToolStatus['status']): string => {
    const messages = {
      idle: [
        `${toolName} is ready`,
        `${toolName} is standing by`,
        `${toolName} is waiting for input`
      ],
      loading: [
        `${toolName} is processing data...`,
        `${toolName} is analyzing information...`,
        `${toolName} is working...`
      ],
      success: [
        `${toolName} completed successfully`,
        `${toolName} finished operation`,
        `${toolName} task completed`
      ],
      error: [
        `${toolName} encountered an error`,
        `${toolName} failed to complete`,
        `${toolName} operation failed`
      ]
    };

    return messages[status][Math.floor(Math.random() * messages[status].length)];
  };

  const getStatusColor = (status: ToolStatus['status']): string => {
    switch (status) {
      case 'idle': return 'bg-gray-500';
      case 'loading': return 'bg-emerald-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ToolStatus['status']) => {
    switch (status) {
      case 'idle':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'loading':
        return (
          <motion.svg
            className="w-4 h-4 text-white"
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
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        className="p-3 bg-gradient-to-r from-emerald-900 to-green-900 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-sm">Tool Status</h3>
            <p className="text-xs text-gray-300">Real-time monitoring</p>
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
            className="p-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  className="bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${getStatusColor(tool.status)} flex items-center justify-center`}>
                        {getStatusIcon(tool.status)}
                      </div>
                      <span className="font-medium text-sm">{tool.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {tool.lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{tool.details}</p>

                  {tool.status === 'loading' && (
                    <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: '0%' }}
                        animate={{
                          width: ['0%', '50%', '75%', '90%', '95%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
