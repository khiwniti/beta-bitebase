import { useEffect, useState } from "react";
import { Card } from "../restaurant-setup/components/ui/card";
import { useRestaurant } from "../restaurant-setup/lib/hooks/use-restaurant";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export function MarketAnalysis() {
  const { restaurantData } = useRestaurant();
  const { marketData } = restaurantData;
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const marketGrowthData = [
    { year: "2019", value: 100 },
    { year: "2020", value: 85 },
    { year: "2021", value: 95 },
    { year: "2022", value: 110 },
    { year: "2023", value: 125 },
    { year: "2024", value: 140 },
  ];

  const industryTrends = [
    { trend: "Online Ordering", growth: 35 },
    { trend: "Delivery Services", growth: 30 },
    { trend: "Plant-Based Options", growth: 25 },
    { trend: "Sustainable Practices", growth: 20 },
    { trend: "Digital Payments", growth: 15 },
  ];

  const targetDemographics = {
    ageGroups: {
      "18-24": 20,
      "25-34": 35,
      "35-44": 25,
      "45-54": 15,
      "55+": 5,
    },
    incomeLevels: {
      "Low": 15,
      "Medium": 45,
      "High": 40,
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Market Growth</h3>
        <div className="h-[300px]">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={200}>
              <LineChart data={marketGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Market Size Index"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Industry Trends</h3>
        <div className="h-[300px]">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={200}>
              <BarChart data={industryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trend" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="growth" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Target Demographics</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Age Distribution</h4>
            <div className="mt-2 space-y-2">
              {Object.entries(targetDemographics.ageGroups).map(([age, percentage]) => (
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
              {Object.entries(targetDemographics.incomeLevels).map(([level, percentage]) => (
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
        <h3 className="mb-4 text-lg font-semibold">Market Insights</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Market Size</h4>
            <p className="text-2xl font-bold">
              ${marketData.marketSize.toLocaleString()}M
            </p>
            <p className="text-sm text-muted-foreground">
              {marketData.growthRate}% annual growth rate
            </p>
          </div>
          <div>
            <h4 className="font-medium">Key Insights</h4>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Market recovering strongly post-pandemic with {marketData.growthRate}% growth
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Digital transformation driving industry evolution
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Strong demand from millennial and Gen Z demographics
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}