import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../restaurant-setup/ui/button";
import { Input } from "../restaurant-setup/ui/input";
import { Slider } from "../restaurant-setup/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../restaurant-setup/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../restaurant-setup/ui/card";
import { Badge } from "../restaurant-setup/ui/badge";
import { Skeleton } from "../restaurant-setup/ui/skeleton";
import { useToast } from "../restaurant-setup/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useDebounce } from '../lib/hooks/use-debounce';
import { LocationInsights } from './LocationInsights';

interface LocationIntelligenceProps {
  latitude: number;
  longitude: number;
  onLocationAnalyzed?: (data: any) => void;
}

export const LocationIntelligence: React.FC<LocationIntelligenceProps> = ({
  latitude,
  longitude,
  onLocationAnalyzed
}) => {
  // State
  const [bufferRadius, setBufferRadius] = useState<number>(1); // in kilometers
  const debouncedBufferRadius = useDebounce(bufferRadius, 500);
  const [analysisType, setAnalysisType] = useState<string>("comprehensive");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("demographics");
  const [showInsights, setShowInsights] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Function to analyze location
  const analyzeLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/location/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          radius_km: debouncedBufferRadius,
          analysis_type: analysisType
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalysisData(data);
      
      if (onLocationAnalyzed) {
        onLocationAnalyzed(data);
      }
      
      toast({
        title: "Analysis Complete",
        description: "Location intelligence analysis has been completed successfully.",
      });
      
    } catch (err) {
      console.error('Error analyzing location:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Location Intelligence</CardTitle>
          <CardDescription>
            Analyze the selected location for restaurant market potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Coordinates
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={latitude.toFixed(6)} 
                    readOnly 
                    className="bg-gray-50"
                  />
                  <Input 
                    value={longitude.toFixed(6)} 
                    readOnly 
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="w-1/3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Analysis Radius: {bufferRadius.toFixed(1)} km
                </label>
                <Slider
                  value={[bufferRadius]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => setBufferRadius(value[0])}
                  className="py-4"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Analysis Type
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["comprehensive", "demographic", "competition", "foot-traffic"].map((type) => (
                  <Badge
                    key={type}
                    variant={analysisType === type ? "default" : "outline"}
                    className={`cursor-pointer ${
                      analysisType === type 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setAnalysisType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowInsights(true)}
            disabled={!analysisData}
          >
            View Insights
          </Button>
          <Button
            onClick={analyzeLocation}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Location"
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Analysis Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {analysisData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Tabs defaultValue="demographics" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="foot-traffic">Foot Traffic</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="poi">Points of Interest</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demographics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Demographic Analysis</CardTitle>
                    <CardDescription>
                      Population and demographic data for the selected area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysisData.demographics ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total Population</p>
                            <p className="text-2xl font-bold">{analysisData.demographics.total_population.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Population Density</p>
                            <p className="text-2xl font-bold">{analysisData.demographics.population_density.toLocaleString()} /km²</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Age Distribution</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {Object.entries(analysisData.demographics.age_distribution).map(([age, percentage]: [string, any]) => (
                              <div key={age} className="flex items-center mb-2">
                                <div className="w-24 text-sm">{age}</div>
                                <div className="flex-1">
                                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-emerald-600" 
                                      style={{ width: `${(percentage as number) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="w-16 text-right text-sm">{((percentage as number) * 100).toFixed(1)}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Income Distribution</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {Object.entries(analysisData.demographics.income_distribution).map(([income, percentage]: [string, any]) => (
                              <div key={income} className="flex items-center mb-2">
                                <div className="w-24 text-sm">{income}</div>
                                <div className="flex-1">
                                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-600" 
                                      style={{ width: `${(percentage as number) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="w-16 text-right text-sm">{((percentage as number) * 100).toFixed(1)}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="foot-traffic" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Foot Traffic Analysis</CardTitle>
                    <CardDescription>
                      Foot traffic patterns and trends for the selected area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysisData.foot_traffic ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Average Daily Traffic</p>
                            <p className="text-2xl font-bold">{analysisData.foot_traffic.average_daily_traffic.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Peak Hours</p>
                            <p className="text-lg font-medium">{analysisData.foot_traffic.peak_hours.join(", ")}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Traffic Trend</p>
                            <p className="text-lg font-medium capitalize">{analysisData.foot_traffic.traffic_trend}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Hourly Traffic Pattern</h4>
                          <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-end">
                            {Object.entries(analysisData.foot_traffic.hourly_pattern).map(([hour, count]: [string, any]) => {
                              const maxCount = Math.max(...Object.values(analysisData.foot_traffic.hourly_pattern) as number[]);
                              const height = `${(count / maxCount) * 100}%`;
                              
                              return (
                                <div key={hour} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-full bg-emerald-600 rounded-t-sm mx-0.5"
                                    style={{ height }}
                                  ></div>
                                  <div className="text-xs mt-1">{hour}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Daily Traffic Pattern</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {Object.entries(analysisData.foot_traffic.daily_pattern).map(([day, count]: [string, any]) => {
                              const maxCount = Math.max(...Object.values(analysisData.foot_traffic.daily_pattern) as number[]);
                              const width = `${(count / maxCount) * 100}%`;
                              
                              return (
                                <div key={day} className="mb-2">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">{day}</span>
                                    <span className="text-sm">{count.toLocaleString()}</span>
                                  </div>
                                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-600" 
                                      style={{ width }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="competition" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Analysis</CardTitle>
                    <CardDescription>
                      Analysis of competing restaurants in the area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysisData.competition ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total Competitors</p>
                            <p className="text-2xl font-bold">{analysisData.competition.total_competitors}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Within 1km</p>
                            <p className="text-2xl font-bold">{analysisData.competition.competitors_within_1km}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Cuisine Types</p>
                            <p className="text-2xl font-bold">{Object.keys(analysisData.competition.cuisine_distribution).length}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Cuisine Distribution</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {Object.entries(analysisData.competition.cuisine_distribution)
                              .sort(([, countA]: [string, any], [, countB]: [string, any]) => (countB as number) - (countA as number))
                              .map(([cuisine, count]: [string, any]) => {
                                const percentage = (count / analysisData.competition.total_competitors) * 100;
                                
                                return (
                                  <div key={cuisine} className="mb-2">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm">{cuisine}</span>
                                      <span className="text-sm">{count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-emerald-600" 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Price Level Distribution</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            {Object.entries(analysisData.competition.price_distribution)
                              .sort(([levelA], [levelB]) => Number(levelA) - Number(levelB))
                              .map(([level, count]: [string, any]) => {
                                const percentage = (count / analysisData.competition.total_competitors) * 100;
                                const priceLabel = level === "0" ? "Unknown" : "$".repeat(Number(level));
                                
                                return (
                                  <div key={level} className="mb-2">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm">{priceLabel}</span>
                                      <span className="text-sm">{count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-blue-600" 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="poi" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Points of Interest</CardTitle>
                    <CardDescription>
                      Notable locations and businesses in the area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysisData.location_data?.points_of_interest ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          {analysisData.location_data.points_of_interest.map((poi: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{poi.name}</h4>
                                {poi.distance_km && (
                                  <Badge variant="outline">{poi.distance_km.toFixed(2)} km</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{poi.vicinity}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {poi.types && poi.types.slice(0, 3).map((type: string) => (
                                  <Badge key={type} variant="secondary" className="text-xs">
                                    {type.replace(/_/g, ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Location Insights Modal */}
      {showInsights && analysisData && (
        <LocationInsights 
          insights={analysisData.insights} 
          onClose={() => setShowInsights(false)} 
        />
      )}
    </div>
  );
};
