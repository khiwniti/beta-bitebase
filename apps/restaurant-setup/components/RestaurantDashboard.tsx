import { useState, useEffect } from "react";
import { MarketAnalysis } from "../restaurant-setup/restaurant/MarketAnalysis";
import { CompetitorAnalysis } from "../restaurant-setup/restaurant/CompetitorAnalysis";
import { LocationAnalysis } from "../restaurant-setup/restaurant/LocationAnalysis";
import { MenuAnalysis } from "../restaurant-setup/restaurant/MenuAnalysis";
import { CustomerInsights } from "../restaurant-setup/restaurant/CustomerInsights";
import { FinancialMetrics } from "../restaurant-setup/restaurant/FinancialMetrics";
import { useRestaurantData } from "../restaurant-setup/lib/hooks/use-restaurant-data";
import { motion, AnimatePresence } from "framer-motion";

export function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("location");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [bufferRadius, setBufferRadius] = useState(1.0);
  const { restaurants } = useRestaurantData();

  // Sample data for demonstration
  const demoLocations = [
    {
      name: "Empire State Building",
      address: "20 W 34th St, New York, NY 10001",
      description: "A famous building in New York City",
      rating: 4.8
    },
    {
      name: "Central Park",
      address: "New York, NY 10024",
      description: "A famous park in New York City",
      rating: 4.7
    },
    {
      name: "Times Square",
      address: "Manhattan, NY 10036",
      description: "The heart of NYC's entertainment district",
      rating: 4.5
    },
    {
      name: "Statue of Liberty",
      address: "New York, NY 10004",
      description: "Iconic symbol of freedom and democracy",
      rating: 4.6
    },
    {
      name: "Brooklyn Bridge",
      address: "Brooklyn Bridge, New York, NY 10038",
      description: "Historic bridge connecting Manhattan and Brooklyn",
      rating: 4.7
    }
  ];

  // Combine real data with demo data
  const displayLocations = restaurants.length > 0
    ? restaurants.slice(0, 5)
    : demoLocations;

  // Animation variants
  const containerVariants = {
    expanded: {
      width: 350,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    collapsed: {
      width: 60,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-black/90 to-gray-800/90 text-white shadow-2xl rounded-lg overflow-hidden flex flex-col backdrop-blur-sm"
      style={{
        maxHeight: 'calc(100vh - 40px)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: '100%'
      }}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={containerVariants}
    >
      <motion.div
        className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-3 flex justify-between items-center"
        whileHover={{ backgroundColor: "rgba(30, 64, 175, 0.9)" }}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              className="text-lg font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              Business Trip to NYC
            </motion.h2>
          )}
        </AnimatePresence>
        <motion.button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
        >
          <motion.span
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? "→" : "←"}
          </motion.span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="flex-1 overflow-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={itemVariants}
          >
            <motion.div
              className="p-3"
              variants={itemVariants}
            >
              <motion.button
                className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md mb-2 flex items-center justify-center shadow-md"
                whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ y: 0, boxShadow: "none" }}
              >
                <span className="text-sm font-medium">Add New Location</span>
              </motion.button>
            </motion.div>

            <div className="locations-list">
              {displayLocations.map((location, index) => (
                <motion.div
                  key={index}
                  className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors ${selectedLocation === index ? 'bg-white/10' : ''}`}
                  onClick={() => setSelectedLocation(index)}
                  variants={itemVariants}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: { duration: 0.1 }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.3
                    }
                  }}
                >
                  <div className="flex items-center">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mr-3 font-bold shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{location.name || `Location ${index + 1}`}</h3>
                      <p className="text-xs text-gray-300">{location.address || `Address ${index + 1}`}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(location.rating || 4.5) ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-xs ml-1 text-gray-400">{location.rating || 4.5}</span>
                      </div>
                    </div>
                    <motion.button
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg">⋮</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="tools p-4 mt-2 bg-black/20 rounded-md mx-3 mb-3"
              variants={itemVariants}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Buffer Radius</label>
                  <span className="text-sm font-bold text-blue-400">{bufferRadius.toFixed(1)} km</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={bufferRadius}
                  onChange={(e) => setBufferRadius(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.1</span>
                  <span>5.0</span>
                </div>
              </div>

              <motion.button
                className="w-full p-2 mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md flex items-center justify-center shadow-md"
                whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ y: 0, boxShadow: "none" }}
              >
                <span className="text-sm font-medium">Apply Changes</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
