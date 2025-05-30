import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../restaurant-setup/components/ui/tabs";
import { MarketAnalysis } from './restaurant/MarketAnalysis';
import { CompetitorAnalysis } from './restaurant/CompetitorAnalysis';
import { LocationAnalysis } from './restaurant/LocationAnalysis';
import { MenuAnalysis } from './restaurant/MenuAnalysis';
import { CustomerInsights } from './restaurant/CustomerInsights';
import { FinancialMetrics } from './restaurant/FinancialMetrics';
import { ChatbotIframe } from './ChatbotIframe';
import { RestaurantDashboard } from './RestaurantDashboard';
import { SettingsSidebar } from './SettingsSidebar';

export function ToolsManager() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Animation variants
  const containerVariants = {
    expanded: {
      width: '100vw',
      height: '100vh',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: 60,
      height: 60,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Tool positions - these will be used to position the tools
  const toolPositions = {
    dashboard: { top: '0', left: '0', width: '100%', height: '100%' },
    analysis: { top: '0', left: '0', width: '100%', height: '100%' }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
    >
      {/* Welcome Overlay - Styled like @chatbot.html */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 gradient-bg z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="max-w-2xl p-8 text-center text-white message-animation"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4">BiteBase Intelligence</h1>
              <p className="text-xl mb-8 text-blue-100">Comprehensive market research tools for the restaurant industry</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="px-6 py-3 bg-white text-indigo-900 rounded-full font-medium hover:shadow-lg transition-all scale-on-hover"
                >
                  Get Started
                </button>
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setActiveTab("analysis");
                  }}
                  className="px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all scale-on-hover"
                >
                  View Research Tools
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-6 flex items-center justify-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Powered by advanced market research algorithms
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tools Container */}
      <div className="relative w-full h-full pointer-events-none">
        {/* Dashboard */}
        <div
          className="absolute pointer-events-auto"
          style={{
            top: toolPositions.dashboard.top,
            left: toolPositions.dashboard.left,
            width: toolPositions.dashboard.width,
            height: toolPositions.dashboard.height,
            zIndex: activeTab === "dashboard" ? 30 : 20,
            display: activeTab === "dashboard" ? 'block' : 'none'
          }}
        >
          <RestaurantDashboard />
        </div>

        {/* Analysis Tools - Styled like @chatbot.html */}
        <div
          className="absolute pointer-events-auto bg-white overflow-auto card-shadow"
          style={{
            top: toolPositions.analysis.top,
            left: toolPositions.analysis.left,
            width: toolPositions.analysis.width,
            height: toolPositions.analysis.height,
            zIndex: activeTab === "analysis" ? 30 : 0,
            display: activeTab === "analysis" ? 'block' : 'none'
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header with gradient background like @chatbot.html */}
            <div className="gradient-bg text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-lg">Restaurant Market Research</h1>
                  <p className="text-blue-100 text-xs flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    Comprehensive analysis tools
                  </p>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                onClick={() => setActiveTab("dashboard")}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs with modern styling */}
            <Tabs defaultValue="market" className="flex-1 flex flex-col">
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4">
                  <TabsList className="flex space-x-1 overflow-x-auto py-2">
                    <TabsTrigger value="market" className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Market
                    </TabsTrigger>
                    <TabsTrigger value="competitor" className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Competitors
                    </TabsTrigger>
                    <TabsTrigger value="location" className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </TabsTrigger>
                    <TabsTrigger value="menu" className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Menu
                    </TabsTrigger>
                    <TabsTrigger value="customer" className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="financial" className="px-4 py-2 rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Financial
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="container mx-auto">
                  <TabsContent value="market" className="mt-0">
                    <MarketAnalysis />
                  </TabsContent>
                  <TabsContent value="competitor" className="mt-0">
                    <CompetitorAnalysis />
                  </TabsContent>
                  <TabsContent value="location" className="mt-0">
                    <LocationAnalysis />
                  </TabsContent>
                  <TabsContent value="menu" className="mt-0">
                    <MenuAnalysis />
                  </TabsContent>
                  <TabsContent value="customer" className="mt-0">
                    <CustomerInsights />
                  </TabsContent>
                  <TabsContent value="financial" className="mt-0">
                    <FinancialMetrics />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Chatbot Iframe */}
      <ChatbotIframe isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />

      {/* Settings Sidebar */}
      <SettingsSidebar isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Chat Toggle Button - Styled like @chatbot.html */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
        {/* Main Research Button */}
        <button
          className={`p-4 rounded-full shadow-lg gradient-bg text-white hover:shadow-xl transition-all scale-on-hover ${activeTab === "analysis" ? 'pulse-animation' : ''}`}
          onClick={() => setActiveTab("analysis")}
          title="Market Research Tools"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>

        {/* Secondary Buttons */}
        <div className="flex flex-col items-end space-y-3">
          {/* Map/Dashboard Button */}
          <button
            className={`p-3 rounded-full shadow-md ${activeTab === "dashboard" ? 'gradient-bg text-white' : 'bg-white text-gray-700'} hover:shadow-lg transition-all scale-on-hover`}
            onClick={() => setActiveTab("dashboard")}
            title="Map View"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>

          {/* Assistant Button */}
          <button
            className={`p-3 rounded-full shadow-md ${isChatbotOpen ? 'gradient-bg text-white' : 'bg-white text-gray-700'} hover:shadow-lg transition-all scale-on-hover`}
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            title="Research Assistant"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>

          {/* Settings Button */}
          <button
            className={`p-3 rounded-full shadow-md ${isSettingsOpen ? 'gradient-bg text-white' : 'bg-white text-gray-700'} hover:shadow-lg transition-all scale-on-hover relative`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Settings & Tools"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
