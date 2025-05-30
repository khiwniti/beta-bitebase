import L from 'leaflet';

// Helper function to safely cleanup Leaflet map instances
export const cleanupMap = (mapInstance: L.Map | null) => {
  if (mapInstance) {
    // Remove all event listeners
    mapInstance.off();
    // Remove all layers
    mapInstance.eachLayer((layer) => {
      mapInstance.removeLayer(layer);
    });
    // Remove the map completely
    mapInstance.remove();
    return null;
  }
  return null;
};

// Helper to generate a unique ID for map containers
export const generateMapId = (prefix: string = 'map') => 
  `${prefix}-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`;

// Fix for default marker icons in Leaflet with React
export const fixLeafletIcons = () => {
  // Fix the default icon path issues with webpack
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};
