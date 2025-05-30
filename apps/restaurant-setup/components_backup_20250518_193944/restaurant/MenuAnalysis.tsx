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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function MenuAnalysis() {
  const { restaurantData } = useRestaurant();
  const { menu } = restaurantData;

  const topSellingItems = [
    { name: "Signature Pasta", sales: 120, revenue: 2400 },
    { name: "Grilled Salmon", sales: 95, revenue: 2850 },
    { name: "Caesar Salad", sales: 85, revenue: 1275 },
    { name: "Tiramisu", sales: 75, revenue: 1125 },
    { name: "House Wine", sales: 65, revenue: 1300 },
  ];

  const categoryDistribution = [
    { name: "Appetizers", value: 20 },
    { name: "Main Course", value: 35 },
    { name: "Desserts", value: 15 },
    { name: "Beverages", value: 25 },
    { name: "Specials", value: 5 },
  ];

  const pricingAnalysis = [
    { category: "Appetizers", avgPrice: 12, competitorAvg: 10 },
    { category: "Main Course", avgPrice: 28, competitorAvg: 25 },
    { category: "Desserts", avgPrice: 8, competitorAvg: 7 },
    { category: "Beverages", avgPrice: 6, competitorAvg: 5 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Top Selling Items</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSellingItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="sales"
                fill="#8884d8"
                name="Sales"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#82ca9d"
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Menu Category Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Pricing Analysis</h3>
        <div className="space-y-4">
          {pricingAnalysis.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{item.category}</span>
                <span className="text-sm text-muted-foreground">
                  ${item.avgPrice} vs ${item.competitorAvg}
                </span>
              </div>
              <div className="h-2 bg-primary/10 rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${(item.avgPrice / item.competitorAvg) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Menu Insights</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Top Performers</h4>
            <ul className="mt-2 space-y-2">
              {topSellingItems.slice(0, 3).map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium">
                    ${item.revenue.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Pricing Strategy</h4>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Premium pricing in main courses with higher quality ingredients
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  Competitive pricing in appetizers to attract customers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  High-margin beverages contributing to overall profitability
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 