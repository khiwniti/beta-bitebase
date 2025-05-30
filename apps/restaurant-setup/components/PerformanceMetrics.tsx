import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

export function PerformanceMetrics() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      name: 'Response Time',
      value: 250,
      unit: 'ms',
      trend: 'stable',
      history: [240, 245, 255, 250, 248, 252, 250]
    },
    {
      name: 'Memory Usage',
      value: 42,
      unit: 'MB',
      trend: 'up',
      history: [35, 38, 40, 41, 42, 42, 42]
    },
    {
      name: 'CPU Usage',
      value: 15,
      unit: '%',
      trend: 'down',
      history: [25, 22, 20, 18, 16, 15, 15]
    },
    {
      name: 'API Calls',
      value: 12,
      unit: '/min',
      trend: 'up',
      history: [5, 7, 8, 10, 11, 12, 12]
    }
  ]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        // Generate a random change
        const change = Math.random() > 0.5
          ? Math.random() * 5
          : -Math.random() * 5;

        // Calculate new value
        let newValue = Math.max(0, metric.value + change);

        // Round to appropriate precision
        if (metric.unit === '%' || metric.unit === '/min') {
          newValue = Math.round(newValue);
        } else if (metric.unit === 'ms') {
          newValue = Math.round(newValue);
        } else {
          newValue = Math.round(newValue * 10) / 10;
        }

        // Determine trend
        const lastValue = metric.history[metric.history.length - 1];
        let trend: Metric['trend'] = 'stable';
        if (newValue > lastValue + 1) {
          trend = 'up';
        } else if (newValue < lastValue - 1) {
          trend = 'down';
        }

        // Update history (keep last 10 values)
        const newHistory = [...metric.history, newValue].slice(-10);

        return {
          ...metric,
          value: newValue,
          trend,
          history: newHistory
        };
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Function to render a mini sparkline chart
  const renderSparkline = (history: number[]) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1; // Avoid division by zero

    const points = history.map((value, index) => {
      const x = (index / (history.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-400"
        />
      </svg>
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-lg shadow-xl backdrop-blur-sm text-white overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{ width: '100%', height: '100%' }}
    >
      <div
        className="p-3 bg-gradient-to-r from-indigo-900 to-purple-900 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-sm">Performance Metrics</h3>
            <p className="text-xs text-gray-300">Real-time system monitoring</p>
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
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.name}
                  className="bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold">{metric.value}</span>
                      <span className="text-xs ml-1 text-gray-400">{metric.unit}</span>
                    </div>
                    <div className="text-right">
                      {renderSparkline(metric.history)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
