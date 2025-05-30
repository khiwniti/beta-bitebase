"use client";

import React, { useState } from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import { motion } from 'framer-motion';
import { CustomChatInterface } from './CustomChatInterface';

interface CustomCopilotProviderProps {
  children: React.ReactNode;
  agent?: string;
  runtimeUrl?: string;
  publicApiKey?: string;
}

export function CustomCopilotProvider({
  children,
  agent = "restaurant",
  runtimeUrl,
  publicApiKey
}: CustomCopilotProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Log when chat is toggled
  const toggleChat = () => {
    const newState = !isChatOpen;
    console.log('Toggling chat:', { current: isChatOpen, new: newState });
    setIsChatOpen(newState);
  };

  return (
    <CopilotKit
      agent={agent}
      runtimeUrl={runtimeUrl}
      publicApiKey={publicApiKey}
    >
      {children}

      <CustomChatInterface
        isOpen={isChatOpen}
        onToggle={toggleChat}
      />

      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
      >
        <motion.div
          animate={{ rotate: isChatOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isChatOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    </CopilotKit>
  );
}
