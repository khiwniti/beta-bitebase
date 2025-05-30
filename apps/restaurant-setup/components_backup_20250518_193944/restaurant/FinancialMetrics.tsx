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

export function FinancialMetrics() {
  const { restaurantData } = useRestaurant();
  const { financial } = restaurantData;

  const revenueData = [
    { month: "Jan", revenue: 45000, profit: 15000 },
    { month: "Feb", revenue: 48000, profit: 16000 },
    { month: "Mar", revenue: 52000, profit: 17500 },
    { month: "Apr", revenue: 51000, profit: 17000 },
    { month: "May", revenue: 55000, profit: 18500 },
    { month: "Jun", revenue: 58000, profit: 19500 },
  ];

  const costBreakdown = [
    { category: "Food & Beverage", amount: 25000 },
    { category: "Labor", amount: 20000 },
    { category: "Rent", amount: 8000 },
    { category: "Utilities", amount: 3000 },
    { category: "Marketing", amount: 2000 },
    { category: "Other", amount: 5000 },
  ];

  const projections = [
    { month: "Jul", projected: 60000, actual: null },
    { month: "Aug", projected: 62000, actual: null },
    { month: "Sep", projected: 65000, actual: null },
    { month: "Oct", projected: 68000, actual: null },
    { month: "Nov", projected: 70000, actual: null },
    { month: "Dec", projected: 75000, actual: null },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Revenue & Profit Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#82ca9d"
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Cost Breakdown</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Financial Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${financial.revenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <p className="text-2xl font-bold">
              ${financial.profit.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="text-2xl font-bold">
              {((financial.profit / financial.revenue) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Monthly Growth</p>
            <p className="text-2xl font-bold">+5.2%</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Revenue Projections</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#8884d8"
                name="Projected"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h4 className="font-medium">Key Insights</h4>
          <ul className="mt-2 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm">
                Strong revenue growth with 5.2% monthly increase
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm">
                Food & beverage costs are the largest expense category
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm">
                Projected to reach $75,000 monthly revenue by year-end
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
} 