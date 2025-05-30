"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatbotIframeProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ChatbotIframe({ isOpen = true, onToggle }: ChatbotIframeProps) {
  const [isMinimized, setIsMinimized] = useState(!isOpen);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'minimize-chat') {
        setIsMinimized(true);
        if (onToggle) onToggle();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onToggle]);

  // Update isMinimized when isOpen changes
  useEffect(() => {
    setIsMinimized(!isOpen);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          style={{
            position: 'fixed',
            bottom: '5rem',
            right: '1rem',
            zIndex: 40,
            width: '24rem',
            height: '600px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* Chatbot Header - For visual consistency when loading */}
          <div className="absolute top-0 left-0 right-0 gradient-bg text-white p-4 flex items-center justify-between z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-lg">BiteBase Intelligence</h1>
                <p className="text-blue-100 text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Market Research Assistant
                </p>
              </div>
            </div>
          </div>

          <iframe
            ref={iframeRef}
            src="/@chatbot.html"
            className="w-full h-full border-0"
            title="BiteBase Chatbot"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
