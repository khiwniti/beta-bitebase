"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RestaurantInsightsProps {
  restaurantData?: any;
  onClose?: () => void;
}

export function RestaurantInsights({ restaurantData, onClose }: RestaurantInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const insightsRef = useRef<HTMLDivElement>(null);

  // Function to generate insights
  const generateInsights = async () => {
    if (!restaurantData) {
      setError('No restaurant data provided');
      return;
    }

    setIsLoading(true);
    setError(null);
    setInsights('');

    try {
      const response = await fetch('/api/restaurants/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurant_data: restaurantData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      setError(`Failed to generate insights: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to stream insights
  const streamInsights = async () => {
    if (!restaurantData) {
      setError('No restaurant data provided');
      return;
    }

    setIsLoading(true);
    setError(null);
    setInsights('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/restaurants/insights/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurant_data: restaurantData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (done) {
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              setIsStreaming(false);
              break;
            }
            
            try {
              const parsedData = JSON.parse(data);
              if (parsedData.chunk) {
                setInsights((prev) => prev + parsedData.chunk);
              } else if (parsedData.error) {
                setError(parsedData.error);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      setError(`Failed to stream insights: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // Auto-scroll to bottom when insights update
  useEffect(() => {
    if (insightsRef.current) {
      insightsRef.current.scrollTop = insightsRef.current.scrollHeight;
    }
  }, [insights]);

  // Generate insights when component mounts
  useEffect(() => {
    if (restaurantData) {
      streamInsights();
    }
  }, [restaurantData]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg">Restaurant Market Insights</h1>
              <p className="text-emerald-100 text-xs flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                {isStreaming ? 'Generating insights...' : 'Analysis complete'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          ref={insightsRef}
          className="flex-1 p-6 overflow-y-auto custom-scrollbar"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {isLoading && !insights && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Generating market insights...</p>
            </div>
          )}

          {insights ? (
            <div className="prose prose-emerald max-w-none">
              <div className="whitespace-pre-wrap">{insights}</div>
            </div>
          ) : !isLoading && (
            <div className="text-center text-gray-500 py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No insights available. Click "Generate Insights" to analyze the restaurant data.</p>
            </div>
          )}

          {isStreaming && (
            <div className="flex items-center mt-4 text-emerald-600">
              <div className="typing-indicator flex space-x-1 mr-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-300"></span>
              </div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-between">
          <div className="text-sm text-gray-500">
            {restaurantData?.restaurants?.length 
              ? `Based on ${restaurantData.restaurants.length} restaurants` 
              : 'No restaurant data available'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={streamInsights}
              disabled={isLoading || !restaurantData}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Regenerate Insights'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
