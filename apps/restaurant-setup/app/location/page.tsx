"use client";

import { useState } from 'react';
import dynamic from "next/dynamic";
import { TooltipProvider } from "../restaurant-setup/components/ui/tooltip";
import { RestaurantProvider } from "../restaurant-setup/lib/hooks/use-restaurant";
import { LocationIntelligence } from "../restaurant-setup/components/LocationIntelligence";
import { Button } from "../restaurant-setup/components/ui/button";
import Link from "next/link";

// Disable server-side rendering for the MapCanvas component
let MapCanvas: any;
MapCanvas = dynamic(
  () =>
    import("@/components/MapCanvas").then((module: any) => module.MapCanvas),
  {
    ssr: false,
  }
);

export default function LocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 13.7563,
    longitude: 100.5018, // Bangkok by default
  });
  
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  
  const handleLocationSelected = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
    setShowAnalysis(true);
  };
  
  return (
    <TooltipProvider>
      <RestaurantProvider>
        <main className="min-h-screen flex flex-col">
          <header className="bg-white border-b p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-xl">BiteBase</h1>
                <p className="text-gray-500 text-xs">Location Intelligence</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">
                  Restaurant Research
                </Button>
              </Link>
              <Link href="/location">
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                  Location Intelligence
                </Button>
              </Link>
            </div>
          </header>
          
          <div className="flex-1 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
              <div className="absolute inset-0">
                <MapCanvas 
                  initialCenter={[selectedLocation.latitude, selectedLocation.longitude]}
                  initialZoom={14}
                  onLocationSelected={handleLocationSelected}
                  mode="location"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
              {showAnalysis ? (
                <LocationIntelligence 
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md p-6 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Select a Location</h2>
                    <p className="text-gray-600 mb-4">
                      Click anywhere on the map to select a location for analysis. 
                      Our AI will analyze demographics, foot traffic, and competition.
                    </p>
                    <div className="text-sm text-gray-500">
                      Tip: Zoom in for more precise location selection
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </RestaurantProvider>
    </TooltipProvider>
  );
}
