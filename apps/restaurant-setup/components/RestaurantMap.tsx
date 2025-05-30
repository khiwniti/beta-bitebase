import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RestaurantData } from '../types/restaurant';
import BufferRadiusControl from './BufferRadiusControl';
import PlatformSelector from './PlatformSelector';

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

// Custom icons for different platforms
const platformIcons = {
  foodpanda: L.icon({
    iconUrl: '/foodpanda-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  wongnai: L.icon({
    iconUrl: '/wongnai-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  robinhood: L.icon({
    iconUrl: '/robinhood-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  google_maps: L.icon({
    iconUrl: '/google-maps-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  default: DefaultIcon,
};

// Component to update map center when coordinates change
const ChangeMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface RestaurantMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  restaurants?: RestaurantData[];
  matchedRestaurants?: any[];
  loading?: boolean;
  onSearch?: (params: {
    latitude: number;
    longitude: number;
    radius_km: number;
    platforms: string[];
    showMatched: boolean;
  }) => void;
  onLocationSearch?: (address: string) => Promise<{ latitude: number; longitude: number } | null>;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  initialCenter = [13.7563, 100.5018], // Bangkok by default
  initialZoom = 14,
  restaurants = [],
  matchedRestaurants = [],
  loading = false,
  onSearch,
  onLocationSearch,
}) => {
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [bufferRadius, setBufferRadius] = useState<number>(1); // in kilometers
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'foodpanda',
    'wongnai',
    'robinhood',
    'google_maps',
  ]);
  const [showMatched, setShowMatched] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantData | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Generate a unique ID for the map container
  const mapId = useMemo(() => `restaurant-map-${Math.random().toString(36).substring(2, 11)}`, []);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Function to search for restaurants
  const handleSearchRestaurants = () => {
    if (onSearch) {
      onSearch({
        latitude: center[0],
        longitude: center[1],
        radius_km: bufferRadius,
        platforms: selectedPlatforms,
        showMatched,
      });
    }
  };

  // Function to handle location search
  const handleLocationSearch = async () => {
    if (!searchLocation || !onLocationSearch) return;

    try {
      const result = await onLocationSearch(searchLocation);
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
  };

  // Function to get icon based on platform
  const getIconForPlatform = (platform: string) => {
    return platformIcons[platform as keyof typeof platformIcons] || platformIcons.default;
  };

  // Get all visible restaurants based on selected platforms and match status
  const visibleRestaurants = showMatched
    ? matchedRestaurants.flatMap((matched) => {
        // Include the base restaurant
        const restaurants: RestaurantData[] = [matched.base_data];
        
        // Include matched restaurants from selected platforms
        Object.entries(matched.matches).forEach(([platform, match]: [string, any]) => {
          if (selectedPlatforms.includes(platform)) {
            restaurants.push(match.data);
          }
        });
        
        return restaurants;
      })
    : restaurants.filter((restaurant) => selectedPlatforms.includes(restaurant.source));

  return (
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-lg z-10 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Restaurant Research</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Search Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter address or place..."
                className="px-3 py-2 border rounded flex-1 text-sm"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
              />
              <button
                onClick={handleLocationSearch}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <BufferRadiusControl 
              bufferRadius={bufferRadius}
              setBufferRadius={setBufferRadius}
            />
          </div>
          
          <div className="mb-4">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              setSelectedPlatforms={setSelectedPlatforms}
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMatched}
                onChange={(e) => setShowMatched(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Show matched restaurants</span>
            </label>
          </div>
          
          <button
            onClick={handleSearchRestaurants}
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span>Find Restaurants</span>
              </>
            )}
          </button>
        </div>
        
        {/* Restaurant list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex justify-between items-center">
            <h2 className="font-semibold">
              {visibleRestaurants.length} Restaurants Found
            </h2>
            <div className="text-xs text-gray-500">
              {bufferRadius} km radius
            </div>
          </div>
          
          <div className="space-y-3">
            {visibleRestaurants.map((restaurant) => (
              <div 
                key={`${restaurant.source}-${restaurant.id}`}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRestaurant && selectedRestaurant.id === restaurant.id && selectedRestaurant.source === restaurant.source
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{restaurant.name}</h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${
                    restaurant.source === 'foodpanda' ? 'bg-pink-100 text-pink-800' :
                    restaurant.source === 'wongnai' ? 'bg-blue-100 text-blue-800' :
                    restaurant.source === 'robinhood' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.source.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{restaurant.address}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="ml-1 text-xs text-gray-700">
                      {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-700">
                    {restaurant.price_level ? '$'.repeat(restaurant.price_level) : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
            
            {visibleRestaurants.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>No restaurants found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toggle sidebar button (when closed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          key={mapId}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          whenReady={(event) => {
            mapRef.current = event.target;
            event.target.on('click', handleMapClick);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView center={center} zoom={zoom} />

          {/* Buffer Radius Circle */}
          <Circle
            center={center}
            radius={bufferRadius * 1000} // Convert km to meters
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />

          {/* Center Marker */}
          <Marker position={center}>
            <Popup>
              <div>
                <h3 className="font-bold">Search Center</h3>
                <p>
                  Lat: {center[0].toFixed(6)}, Lng: {center[1].toFixed(6)}
                </p>
                <p>Buffer Radius: {bufferRadius} km</p>
              </div>
            </Popup>
          </Marker>

          {/* Restaurant Markers */}
          {visibleRestaurants.map((restaurant) => (
            <Marker
              key={`${restaurant.source}-${restaurant.id}`}
              position={[restaurant.latitude, restaurant.longitude]}
              icon={getIconForPlatform(restaurant.source)}
              eventHandlers={{
                click: () => {
                  setSelectedRestaurant(restaurant);
                },
              }}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                  <div className="mt-2">
                    <p>
                      <span className="font-semibold">Rating:</span> {restaurant.rating} (
                      {restaurant.reviews_count} reviews)
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span>{' '}
                      {'$'.repeat(restaurant.price_level)}
                    </p>
                    <p>
                      <span className="font-semibold">Cuisine:</span>{' '}
                      {restaurant.cuisine_types?.join(', ') || 'N/A'}
                    </p>
                    {restaurant.phone && (
                      <p>
                        <span className="font-semibold">Phone:</span> {restaurant.phone}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="capitalize text-sm text-blue-600">
                      Source: {restaurant.source.replace('_', ' ')}
                    </span>
                    <a
                      href={restaurant.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Map overlay controls */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Search Center</span>
            </div>
            <div className="space-y-1">
              {['foodpanda', 'wongnai', 'robinhood', 'google_maps'].map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    platform === 'foodpanda' ? 'bg-pink-500' :
                    platform === 'wongnai' ? 'bg-blue-500' :
                    platform === 'robinhood' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-xs capitalize">{platform.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMap;
