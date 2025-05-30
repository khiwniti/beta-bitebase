
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../restaurant-setup/components/ui/card";
import { Layers, Filter, Ruler, MapPin } from "lucide-react";
import { Button } from "../restaurant-setup/components/ui/button";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapMetric } from "../restaurant-setup/types";
import MapMetricsDisplay from "../restaurant-setup/MapMetricsDisplay";
import { geocodeAddress, searchNearbyPlaces, PlaceSearchResult } from "../../../../lib/mapbox";

// Get Mapbox token from environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY203cm1oaWtyMWI4ejJpcHVuN2U2bHB6MiJ9.w9KWAvFEvF7bCdX-8Povkg";

interface MapContainerProps {
  formData: any;
  metrics: MapMetric[];
}

const MapContainer = ({ formData, metrics }: MapContainerProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([100.5018, 13.7563]); // Default to Bangkok

  // Geocode address and update map
  const handleAddressGeocode = async (address: string) => {
    setIsLoading(true);
    try {
      const result = await geocodeAddress(address);
      if (result && mapRef.current) {
        const newLocation: [number, number] = [result.longitude, result.latitude];
        setCurrentLocation(newLocation);

        // Update map center
        mapRef.current.flyTo({
          center: newLocation,
          zoom: 14,
          duration: 2000
        });

        // Add marker for the location
        new mapboxgl.Marker({ color: '#10B981' })
          .setLngLat(newLocation)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${formData.restaurantName || 'Restaurant Location'}</h3><p>${result.formatted_address}</p>`))
          .addTo(mapRef.current);

        // Search for nearby restaurants
        const places = await searchNearbyPlaces(result.latitude, result.longitude, 'restaurant', 2000, 10);
        setNearbyPlaces(places);

        // Add markers for nearby places
        places.forEach(place => {
          const marker = new mapboxgl.Marker({ color: '#EF4444', scale: 0.8 })
            .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h4>${place.name}</h4><p>${place.address}</p><p>Category: ${place.category}</p>`))
            .addTo(mapRef.current!);
        });
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: currentLocation,
      zoom: 12
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Handle address changes
  useEffect(() => {
    if (formData.streetAddress && formData.city) {
      const fullAddress = `${formData.streetAddress}, ${formData.city}`;
      handleAddressGeocode(fullAddress);
    }
  }, [formData.streetAddress, formData.city]);

  return (
    <div className="md:col-span-3 relative">
      <div className="w-full h-full rounded-lg overflow-hidden border border-border shadow-md">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-10">
          <Card className="shadow-md border border-border">
            <CardContent className="p-3 flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-1" />
                Layers
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Ruler className="h-4 w-4 mr-1" />
                Measure
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Floating Metrics */}
        <MapMetricsDisplay metrics={metrics} />
      </div>
    </div>
  );
};

export default MapContainer;
