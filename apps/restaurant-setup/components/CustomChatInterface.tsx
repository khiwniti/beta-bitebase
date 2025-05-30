"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomChatInterfaceProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CustomChatInterface({ isOpen = true, onToggle }: CustomChatInterfaceProps) {
  // Initialize the chat hook with proper options
  const {
    visibleMessages,
    appendMessage,
    setMessages,
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
    reset
  } = useCopilotChat({
    id: "restaurant-chat", // Unique ID for this chat instance
    initialMessages: [] // Start with an empty chat
  });

  const [isMinimized, setIsMinimized] = useState(!isOpen);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update minimized state when isOpen prop changes
  useEffect(() => {
    setIsMinimized(!isOpen);
  }, [isOpen]);

  // Toggle the chatbot
  const toggleChatbot = () => {
    setIsMinimized(!isMinimized);
    if (onToggle) onToggle();
  };

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!chatInputRef.current) return;

    const content = chatInputRef.current.value.trim();
    if (content === '') return;

    try {
      // Send the message to the CopilotRuntime
      await appendMessage(new TextMessage({ content, role: Role.User }));

      // Clear the input field
      chatInputRef.current.value = '';
      chatInputRef.current.style.height = 'auto';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [appendMessage]);

  // Auto-resize textarea
  const handleTextareaInput = () => {
    if (!chatInputRef.current) return;
    chatInputRef.current.style.height = 'auto';
    chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (!isMinimized && visibleMessages.length === 0) {
      appendMessage(new TextMessage({
        content: "Hi! 👋 I'm your restaurant industry research assistant. I can help you analyze market trends, competitors, locations, and provide insights for your restaurant business.",
        role: Role.Assistant
      }));
    }
  }, [isMinimized, visibleMessages.length, appendMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return `Today, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Log state for debugging
  useEffect(() => {
    console.log('Chat interface state:', {
      isOpen,
      isMinimized,
      messagesCount: visibleMessages.length,
      isLoading
    });
  }, [isOpen, isMinimized, visibleMessages.length, isLoading]);

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          className="fixed bottom-20 right-4 z-40 w-96 h-[600px] rounded-lg overflow-hidden shadow-2xl bg-white flex flex-col"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {/* Chat Header */}
          <div className="gradient-bg text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-lg">BiteBase Intelligence</h1>
                <p className="text-emerald-100 text-xs flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 pulse-animation"></span>
                  Market Research Assistant
                </p>
              </div>
            </div>
            <button
              onClick={toggleChatbot}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-gray-100 space-y-4">
            {visibleMessages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.role === Role.User ? 'justify-end' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.role !== Role.User && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="max-w-[80%]">
                  <div className={`${
                    message.role === Role.User
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-xl rounded-tl-none border border-gray-200'
                  } px-4 py-3 shadow-sm`}>
                    <p>{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.role === Role.User ? 'text-right' : ''}`}>
                    {formatTime(new Date())}
                  </p>
                </div>

                {message.role === Role.User && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white flex items-center justify-center ml-2 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                className="flex"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="max-w-[80%]">
                  <div className="px-4 py-3 rounded-xl rounded-tl-none shadow-sm bg-white text-gray-800 border border-gray-200">
                    <div className="typing-indicator flex space-x-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-opacity-50">
                <textarea
                  ref={chatInputRef}
                  rows={1}
                  className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none text-gray-800 placeholder-gray-500"
                  placeholder="Type your message..."
                  onInput={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                ></textarea>
              </div>
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
              <button
                onClick={() => {
                  reset();
                  // Add a system message to indicate the chat has been reset
                  setTimeout(() => {
                    appendMessage(new TextMessage({
                      content: "Chat history has been reset. How can I help you today?",
                      role: Role.Assistant
                    }));
                  }, 500);
                }}
                className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                title="Reset conversation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  if (chatInputRef.current) {
                    chatInputRef.current.value = 'What are the popular cuisines in this area?';
                    chatInputRef.current.focus();
                  }
                }}
                className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              >
                Popular cuisines
              </button>
              <button
                onClick={() => {
                  if (chatInputRef.current) {
                    chatInputRef.current.value = 'What price range is most common for restaurants here?';
                    chatInputRef.current.focus();
                  }
                }}
                className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              >
                Price ranges
              </button>
              <button
                onClick={() => {
                  if (chatInputRef.current) {
                    chatInputRef.current.value = 'What are the busiest times for restaurants in this area?';
                    chatInputRef.current.focus();
                  }
                }}
                className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              >
                Busy hours
              </button>
              <button
                onClick={() => {
                  if (chatInputRef.current) {
                    chatInputRef.current.value = 'What restaurant concepts are missing in this area?';
                    chatInputRef.current.focus();
                  }
                }}
                className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
              >
                Market gaps
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
