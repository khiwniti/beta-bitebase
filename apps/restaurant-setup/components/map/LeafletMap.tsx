import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cleanupMap, fixLeafletIcons, generateMapId } from '@/lib/utils/map-utils';
import { createDynamicMapComponent } from './DynamicMap';

// Component to update map center when coordinates change
export const ChangeMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: L.LeafletMouseEvent) => void;
  children?: React.ReactNode;
}

const LeafletMapComponent = ({ 
  center, 
  zoom = 13, 
  className = '', 
  style = {}, 
  onClick,
  children 
}: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapId] = useState(() => generateMapId('leaflet'));
  
  // Fix Leaflet icons
  useEffect(() => {
    fixLeafletIcons();
    
    // Cleanup when component unmounts
    return () => {
      mapRef.current = cleanupMap(mapRef.current);
    };
  }, []);
  
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onClick) onClick(e);
  };
  
  return (
    <div className={`relative ${className}`} style={{ height: '100%', width: '100%', ...style }}>
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
        {children}
      </MapContainer>
    </div>
  );
};

// Export the dynamic version that handles SSR correctly
const DynamicLeafletMap = createDynamicMapComponent(LeafletMapComponent);
export default DynamicLeafletMap;
