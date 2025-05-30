import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, LayerGroup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map-canvas.css'; // Import custom map styles
import L from 'leaflet';
import { RestaurantData, SearchParams } from '../types/restaurant';
import { useRestaurantData } from '../lib/hooks/use-restaurant-data';
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { RestaurantInsights } from './RestaurantInsights';
import { useDebounce } from '../lib/hooks/use-debounce';

// Mapbox API key
const MAPBOX_API_KEY = 'pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Platform-specific colors and configuration
const platformConfig = {
  foodpanda: { color: 'pink-500', label: 'Foodpanda' },
  wongnai: { color: 'yellow-500', label: 'Wongnai' },
  robinhood: { color: 'green-500', label: 'Robinhood' },
  google_maps: { color: 'blue-500', label: 'Google Maps' },
  default: { color: 'gray-500', label: 'Unknown' }
};

// Function to get platform color
const getPlatformColor = (platform: string): string => {
  return (platformConfig[platform as keyof typeof platformConfig] || platformConfig.default).color;
};

// Component to update map center when coordinates change
const ChangeMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface MapCanvasProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  mode?: 'restaurant' | 'location';
  onLocationSelected?: (latitude: number, longitude: number) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  initialCenter = [13.7563, 100.5018], // Bangkok by default
  initialZoom = 14,
  mode = 'restaurant',
  onLocationSelected,
}) => {
  // State for map controls
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [bufferRadius, setBufferRadius] = useState<number>(1); // in kilometers
  const debouncedBufferRadius = useDebounce(bufferRadius, 500);
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    Object.keys(platformConfig).filter(p => p !== 'default')
  );
  const [showMatched, setShowMatched] = useState<boolean>(false);

  // UI state
  const [isControlPanelExpanded, setIsControlPanelExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'search' | 'filter' | 'results'>('search');
  const [showBufferControls, setShowBufferControls] = useState<boolean>(false);
  const [showInsights, setShowInsights] = useState<boolean>(false);

  // Refs
  const mapRef = useRef<L.Map | null>(null);

  // Use the restaurant data hook
  const {
    restaurants,
    matchedRestaurants,
    loading,
    error,
    searchRestaurants,
    matchRestaurants,
    geocodeAddress,
  } = useRestaurantData();

  // Function to search for restaurants
  const handleSearchRestaurants = async () => {
    const params: SearchParams = {
      latitude: center[0],
      longitude: center[1],
      radius_km: debouncedBufferRadius,
      platforms: selectedPlatforms,
    };

    try {
      if (showMatched) {
        await matchRestaurants(params);
      } else {
        await searchRestaurants(params);
      }
      // Auto-switch to results tab after successful search
      setActiveTab('results');
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Auto-search when debounced buffer radius changes
  useEffect(() => {
    if (mapRef.current && selectedPlatforms.length > 0) {
      handleSearchRestaurants();
    }
  }, [debouncedBufferRadius, center, selectedPlatforms, showMatched]);

  // Function to handle location search
  const handleLocationSearch = async () => {
    if (!searchLocation) return;

    try {
      const result = await geocodeAddress(searchLocation);
      if (result && result.latitude && result.longitude) {
        setCenter([result.latitude, result.longitude]);
        setZoom(15);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  // Function to handle map click
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    setCenter([e.latlng.lat, e.latlng.lng]);

    // If in location mode and onLocationSelected is provided, call it
    if (mode === 'location' && onLocationSelected) {
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    }
  };

  // Use useEffect for map cleanup
  useEffect(() => {
    return () => {
      // Clean up map when component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Generate a unique ID for the map container
  const mapId = useMemo(() => `map-canvas-${Math.random().toString(36).substring(2, 11)}`, []);

  // No longer needed as we're using custom HTML markers

  // Get all visible restaurants based on selected platforms and match status
  const visibleRestaurants = showMatched
    ? matchedRestaurants.flatMap((matched) => {
        // Include the base restaurant
        const restaurants: RestaurantData[] = [matched.base_data];

        // Include matched restaurants from selected platforms
        Object.entries(matched.matches).forEach(([platform, match]) => {
          if (selectedPlatforms.includes(platform)) {
            restaurants.push(match.data);
          }
        });

        return restaurants;
      })
    : restaurants.filter((restaurant) => selectedPlatforms.includes(restaurant.source));

  return (
    <div className="h-full w-full flex flex-col" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {/* Modern Control Panel - Styled like @chatbot.html */}
      <motion.div
        className="absolute bottom-4 right-4 bg-white shadow-xl rounded-xl overflow-hidden"
        style={{
          zIndex: 50,
          width: isControlPanelExpanded ? '360px' : '48px',
          height: isControlPanelExpanded ? 'auto' : '48px'
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          width: isControlPanelExpanded ? '360px' : '48px',
          height: isControlPanelExpanded ? 'auto' : '48px'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.3
        }}
      >
        {/* Header with gradient background like @chatbot.html */}
        <div className={`bg-gradient-to-r from-emerald-600 to-green-600 text-white ${isControlPanelExpanded ? 'p-4' : 'p-0'} transition-all duration-300`}>
          {isControlPanelExpanded ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-lg">Restaurant Research</h1>
                  <p className="text-blue-100 text-xs flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    {loading ? 'Searching...' : `${visibleRestaurants.length} results found`}
                  </p>
                </div>
              </div>
              <motion.button
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                onClick={() => setIsControlPanelExpanded(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          ) : (
            <motion.button
              className="w-12 h-12 flex items-center justify-center"
              onClick={() => setIsControlPanelExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Panel Content */}
        <AnimatePresence>
          {isControlPanelExpanded && (
            <motion.div
              className="p-4 pt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Tabs Navigation - Styled like @chatbot.html */}
              <div className="flex border-b mb-4 bg-gray-50">
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'search'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('search')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'filter'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('filter')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
                <button
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === 'results'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('results')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Results
                </button>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'search' && (
                  <motion.div
                    key="search-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 px-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Location Search</label>
                      <div className="relative">
                        <div className="flex-1 bg-gray-100 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-opacity-50 overflow-hidden">
                          <Input
                            type="text"
                            placeholder="Enter address or place name..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                            className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                        <button
                          onClick={handleLocationSearch}
                          disabled={loading || !searchLocation}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-1.5 rounded-full hover:shadow-md transition-all disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Buffer Radius: {bufferRadius.toFixed(1)} km</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setShowBufferControls(!showBufferControls)}
                        >
                          {showBufferControls ? 'Hide' : 'Adjust'}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showBufferControls && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <Slider
                              value={[bufferRadius]}
                              min={0.1}
                              max={5}
                              step={0.1}
                              onValueChange={(value) => setBufferRadius(value[0])}
                              className="py-4"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>0.1 km</span>
                              <span>5 km</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                        onClick={handleSearchRestaurants}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                            <span>Searching...</span>
                          </div>
                        ) : (
                          <span>Find Restaurants</span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'filter' && (
                  <motion.div
                    key="filter-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Data Sources</label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setSelectedPlatforms(Object.keys(platformConfig).filter(p => p !== 'default'))}
                          >
                            All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setSelectedPlatforms([])}
                          >
                            None
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(platformConfig).filter(p => p !== 'default').map((platform) => {
                          const isSelected = selectedPlatforms.includes(platform);
                          const config = platformConfig[platform as keyof typeof platformConfig];

                          return (
                            <motion.div
                              key={platform}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                                } else {
                                  setSelectedPlatforms([...selectedPlatforms, platform]);
                                }
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`w-4 h-4 rounded-full bg-${config.color}`}></div>
                              <span className="text-sm">{config.label}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Match Restaurants</label>
                      <div
                        className={`p-3 rounded-lg border cursor-pointer ${
                          showMatched
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        onClick={() => setShowMatched(!showMatched)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 mr-2 rounded ${showMatched ? 'bg-emerald-600' : 'border border-gray-300'} flex items-center justify-center`}>
                            {showMatched && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Match across platforms</div>
                            <div className="text-xs text-gray-500">Find the same restaurant listed on different platforms</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                        onClick={handleSearchRestaurants}
                        disabled={loading}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'results' && (
                  <motion.div
                    key="results-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Results Summary</h3>
                          <p className="text-xs text-gray-500">
                            Found <span className="font-bold text-gray-900">{visibleRestaurants.length}</span> restaurants within <span className="font-bold text-gray-900">{bufferRadius.toFixed(1)}</span> km
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Button
                          onClick={() => setShowInsights(true)}
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                          disabled={visibleRestaurants.length === 0}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Generate Market Insights
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {Object.keys(platformConfig).filter(p => p !== 'default').map((platform) => {
                          const count = restaurants.filter((r) => r.source === platform).length;
                          const platformColor = getPlatformColor(platform);
                          const config = platformConfig[platform as keyof typeof platformConfig];
                          const isSelected = selectedPlatforms.includes(platform);

                          return (
                            <motion.div
                              key={platform}
                              className={`flex items-center gap-2 p-2 rounded-md ${isSelected ? 'bg-gray-100' : 'opacity-50'}`}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                                } else {
                                  setSelectedPlatforms([...selectedPlatforms, platform]);
                                }
                              }}
                            >
                              <div className={`w-3 h-3 rounded-full bg-${platformColor}`}></div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium">{config.label}</span>
                                  <Badge variant="outline" className="text-xs h-5 px-1.5">{count}</Badge>
                                </div>
                                <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                                  <div
                                    className={`h-full bg-${platformColor} rounded-full`}
                                    style={{ width: `${count > 0 ? (count / Math.max(1, restaurants.length)) * 100 : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {showMatched && matchedRestaurants.length > 0 && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-indigo-900 flex items-center">
                            <svg className="w-4 h-4 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Matched Restaurants
                          </span>
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                            {matchedRestaurants.length}
                          </Badge>
                        </div>

                        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                          {matchedRestaurants.slice(0, 5).map((matched, index) => (
                            <div key={index} className="bg-white p-2 rounded-md text-xs shadow-sm">
                              <div className="font-medium text-indigo-900 mb-1">{matched.base_data.name}</div>
                              <div className="flex flex-wrap gap-1">
                                {Object.keys(matched.matches).map(platform => (
                                  <Badge key={platform} variant="outline" className="text-[10px] h-4 px-1">
                                    {platform.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                          {matchedRestaurants.length > 5 && (
                            <div className="text-center text-xs text-indigo-600">
                              + {matchedRestaurants.length - 5} more matches
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab('search')}
                      >
                        New Search
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modern Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm flex items-center border-l-4 border-red-500"
            style={{ zIndex: 60 }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="mr-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Error Occurred</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <motion.button
              className="ml-4 bg-gray-100 rounded-full p-1.5 hover:bg-gray-200 text-gray-500"
              onClick={() => setError(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Loading Indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="map-loading-indicator"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Loading restaurant data...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <MapContainer
          key={mapId}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 5 }}
          zoomControl={false} // We'll add custom zoom control
          attributionControl={true}
          minZoom={3}
          maxZoom={18}
          whenReady={(event) => {
            mapRef.current = event.target;
            event.target.on('click', handleMapClick);
          }}
        >
          <ZoomControl position="bottomright" />
          {/* Mapbox Styled Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`}
          />
          <ChangeMapView center={center} zoom={zoom} />

          {/* Modern Buffer Radius Circle with Pulse Effect */}
          <LayerGroup>
            {/* Outer pulse effect */}
            <Circle
              center={center}
              radius={bufferRadius * 1000} // Convert km to meters
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.05,
                weight: 1.5,
                dashArray: '5, 5',
              }}
            />

            {/* Main buffer circle */}
            <Circle
              center={center}
              radius={bufferRadius * 1000 - 50} // Slightly smaller for layered effect
              pathOptions={{
                color: '#059669',
                fillColor: '#059669',
                fillOpacity: 0.08,
                weight: 1,
              }}
            />

            {/* Inner circle for visual effect */}
            <Circle
              center={center}
              radius={100} // Small inner circle
              pathOptions={{
                color: '#047857',
                fillColor: '#047857',
                fillOpacity: 0.2,
                weight: 1
              }}
            />

            {/* Tiny dot at center */}
            <Circle
              center={center}
              radius={5}
              pathOptions={{
                color: '#065f46',
                fillColor: '#065f46',
                fillOpacity: 1,
                weight: 1
              }}
            />
          </LayerGroup>

          {/* Modern Center Marker with Custom Icon */}
          <Marker
            position={center}
            draggable={true}
            icon={L.divIcon({
              className: "custom-pin-marker",
              html: `
                <div class="relative">
                  <div class="absolute -top-12 -left-12 w-24 h-24 flex items-center justify-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="absolute -bottom-1 w-16 h-1 bg-black/20 rounded-full blur-sm"></div>
                  </div>
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            })}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                setCenter([position.lat, position.lng]);
              },
              dragstart: () => {
                // Add any animation or effect when drag starts
              }
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold text-emerald-800 border-b pb-1 mb-2">Search Center</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      Lat: <span className="font-mono text-xs font-medium">{center[0].toFixed(6)}</span>,
                      Lng: <span className="font-mono text-xs font-medium">{center[1].toFixed(6)}</span>
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>Buffer Radius: <span className="font-semibold text-emerald-700">{bufferRadius.toFixed(1)} km</span></span>
                  </div>
                </div>
                <div className="mt-3 bg-emerald-50 p-2 rounded-md text-xs text-emerald-800 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Drag this pin to change the search location</span>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Modern Restaurant Markers */}
          {visibleRestaurants.map((restaurant) => {
            // Get platform-specific styling using our centralized config
            const platformColor = getPlatformColor(restaurant.source);

            // Create a modern custom icon
            const customIcon = L.divIcon({
              className: "restaurant-marker",
              html: `
                <div class="relative">
                  <div class="absolute -top-8 -left-8 w-16 h-16 flex items-center justify-center">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-${platformColor} transform hover:scale-110 transition-all duration-200">
                      <div class="w-6 h-6 rounded-full bg-${platformColor} flex items-center justify-center">
                        <span class="text-white text-xs font-bold">${restaurant.source.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div class="absolute -bottom-1 w-8 h-1 bg-black/20 rounded-full blur-sm"></div>
                  </div>
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            });

            // Determine rating color based on rating value
            const getRatingColor = (rating: number) => {
              if (rating >= 4.5) return 'text-green-500';
              if (rating >= 4.0) return 'text-teal-500';
              if (rating >= 3.5) return 'text-yellow-500';
              if (rating >= 3.0) return 'text-orange-500';
              return 'text-red-500';
            };

            return (
              <Marker
                key={`${restaurant.source}-${restaurant.id}`}
                position={[restaurant.latitude, restaurant.longitude]}
                icon={customIcon}
              >
                <Popup className="restaurant-popup" maxWidth={300}>
                  <div className="p-3">
                    {/* Header with restaurant name and platform */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{restaurant.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(restaurant.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                            ))}
                          </div>
                          <span className={`text-xs ml-1 font-medium ${getRatingColor(restaurant.rating || 0)}`}>
                            {restaurant.rating?.toFixed(1) || 'N/A'}
                          </span>
                          <span className="text-xs ml-1 text-gray-400">
                            ({restaurant.reviews_count || 0} reviews)
                          </span>
                        </div>
                      </div>
                      <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium bg-${platformColor}/10 text-${platformColor} capitalize`}>
                        {restaurant.source.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start mb-3 bg-gray-50 p-2 rounded-md">
                      <svg className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{restaurant.address}</span>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Price level */}
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Price Level</div>
                        <div className="font-medium text-gray-900">
                          {restaurant.price_level ? (
                            <span className="text-green-600 font-medium">{'$'.repeat(restaurant.price_level)}</span>
                          ) : (
                            <span className="text-gray-400">Not available</span>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="bg-gray-50 p-2 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Phone</div>
                        <div className="font-medium text-gray-900 truncate">
                          {restaurant.phone ? (
                            <span>{restaurant.phone}</span>
                          ) : (
                            <span className="text-gray-400">Not available</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cuisine types */}
                    {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Cuisine Types</div>
                        <div className="flex flex-wrap gap-1">
                          {restaurant.cuisine_types.map((cuisine, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs">
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer with action button */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                      <a
                        href={restaurant.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 bg-emerald-600 text-white text-xs rounded-md hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on {restaurant.source.replace('_', ' ')}
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Modern Floating Status Bar */}
      <motion.div
        className="absolute left-4 top-4 bg-white/95 p-3 rounded-xl shadow-lg backdrop-blur-sm"
        style={{ zIndex: 50, maxWidth: '320px' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.5
        }}
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">BiteBase</h3>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-xs">
                {loading ? 'Searching...' : `${visibleRestaurants.length} results`}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 flex items-center">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {bufferRadius.toFixed(1)} km radius
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                {selectedPlatforms.length} platforms
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Restaurant Insights Modal */}
      <AnimatePresence>
        {showInsights && (
          <RestaurantInsights
            restaurantData={{ restaurants: visibleRestaurants }}
            onClose={() => setShowInsights(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapCanvas;
