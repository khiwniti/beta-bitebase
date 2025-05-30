'use client';

import React, { useState } from 'react';
import { Bot, X, Maximize2, Minimize2, Send } from 'lucide-react';

interface AIAssistantProps {
  contextualHelp?: string;
}

export function AIAssistant({ contextualHelp = "I'm your AI assistant for setting up your restaurant in Bangkok. How can I help you today?" }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: contextualHelp }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: inputValue }]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you with that! For restaurants in Bangkok, you'll need to consider local regulations and cuisine preferences.",
        "That's a great question about the Bangkok market. The most popular areas for restaurants are Sukhumvit, Silom, and Thonglor.",
        "For your restaurant setup, I recommend focusing on authentic Thai cuisine with a modern twist, as that's trending in Bangkok right now.",
        "Based on market research, the average startup cost for a mid-sized restaurant in Bangkok is approximately 1-2 million baht.",
        "Local permits for restaurants in Bangkok typically include food safety certification, alcohol licenses if applicable, and building permits."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
    
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all z-50"
          aria-label="Open AI Assistant"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed right-6 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 border border-gray-200 flex flex-col
            ${isMinimized 
              ? 'bottom-6 w-72 h-14' 
              : 'bottom-6 w-80 sm:w-96 h-[500px] max-h-[80vh]'
            }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-medium">Bangkok Restaurant AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleMinimize} className="p-1 hover:bg-primary-dark rounded-full">
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button onClick={toggleOpen} className="p-1 hover:bg-primary-dark rounded-full">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about Bangkok restaurant setup..."
                    className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={1}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
