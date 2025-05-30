import { Card } from "../restaurant-setup/components/ui/card";
import { useRestaurant } from "../restaurant-setup/lib/hooks/use-restaurant";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function CompetitorAnalysis() {
  const { restaurantData } = useRestaurant();
  const { competitors } = restaurantData;

  const marketShareData = [
    { name: "Your Restaurant", value: 25 },
    { name: "Competitor A", value: 30 },
    { name: "Competitor B", value: 20 },
    { name: "Competitor C", value: 15 },
    { name: "Others", value: 10 },
  ];

  const comparisonData = [
    { category: "Price", yourScore: 4, competitorScore: 3.5 },
    { category: "Quality", yourScore: 4.5, competitorScore: 4 },
    { category: "Service", yourScore: 4.2, competitorScore: 3.8 },
    { category: "Ambiance", yourScore: 4.3, competitorScore: 4.1 },
    { category: "Menu", yourScore: 4.4, competitorScore: 4.2 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Market Share</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketShareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Competitive Analysis</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={comparisonData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar
                name="Your Restaurant"
                dataKey="yourScore"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Competitor"
                dataKey="competitorScore"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Direct Competitors</h3>
        <div className="space-y-4">
          {competitors.directCompetitors.map((competitor, index) => (
            <div key={index} className="rounded-lg border p-3">
              <h4 className="font-semibold">{competitor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {competitor.description}
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                  {competitor.cuisine}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                  {competitor.priceRange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Key Insights</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Your restaurant holds {marketShareData[0].value}% of the market share
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Strong performance in quality and menu variety compared to competitors
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Service quality is a key differentiator from main competitors
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
} 