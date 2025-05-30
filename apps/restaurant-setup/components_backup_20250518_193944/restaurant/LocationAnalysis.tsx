import { Card } from "../restaurant-setup/components/ui/card";
import { useRestaurant } from "../restaurant-setup/lib/hooks/use-restaurant";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function LocationAnalysis() {
  const { restaurantData } = useRestaurant();
  const { location } = restaurantData;

  const footTrafficData = [
    { time: "6AM", traffic: 20 },
    { time: "9AM", traffic: 45 },
    { time: "12PM", traffic: 85 },
    { time: "3PM", traffic: 65 },
    { time: "6PM", traffic: 95 },
    { time: "9PM", traffic: 75 },
  ];

  const demographics = {
    ageGroups: {
      "18-24": 15,
      "25-34": 35,
      "35-44": 25,
      "45-54": 15,
      "55+": 10,
    },
    incomeLevels: {
      "Low": 20,
      "Medium": 45,
      "High": 35,
    },
    populationDensity: "High",
    nearbyAttractions: [
      "Shopping Mall",
      "Office Complex",
      "Residential Area",
      "Public Transport Hub",
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Location Map</h3>
        <div className="h-[300px] rounded-lg overflow-hidden">
          <MapContainer
            center={location.coordinates}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={location.coordinates}>
              <Popup>
                <div>
                  <h4 className="font-semibold">Your Restaurant</h4>
                  <p className="text-sm">{location.address}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Foot Traffic Analysis</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={footTrafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="traffic"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Demographics</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Age Distribution</h4>
            <div className="mt-2 space-y-2">
              {Object.entries(demographics.ageGroups).map(([age, percentage]) => (
                <div key={age} className="flex items-center gap-2">
                  <span className="w-16 text-sm">{age}</span>
                  <div className="flex-1 h-2 bg-primary/10 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Income Levels</h4>
            <div className="mt-2 space-y-2">
              {Object.entries(demographics.incomeLevels).map(([level, percentage]) => (
                <div key={level} className="flex items-center gap-2">
                  <span className="w-16 text-sm">{level}</span>
                  <div className="flex-1 h-2 bg-primary/10 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Location Insights</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Population Density</h4>
            <p className="text-sm text-muted-foreground">
              {demographics.populationDensity} density area
            </p>
          </div>
          <div>
            <h4 className="font-medium">Nearby Attractions</h4>
            <ul className="mt-2 space-y-1">
              {demographics.nearbyAttractions.map((attraction, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">{attraction}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Key Advantages</h4>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  High foot traffic during peak hours
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Diverse demographic mix with strong purchasing power
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Excellent accessibility with multiple transport options
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 