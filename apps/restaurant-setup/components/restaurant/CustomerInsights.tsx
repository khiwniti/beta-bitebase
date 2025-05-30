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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

export function CustomerInsights() {
  const { restaurantData } = useRestaurant();
  const { customerInsights } = restaurantData;

  const sentimentTrend = [
    { month: "Jan", positive: 75, neutral: 15, negative: 10 },
    { month: "Feb", positive: 78, neutral: 14, negative: 8 },
    { month: "Mar", positive: 82, neutral: 12, negative: 6 },
    { month: "Apr", positive: 80, neutral: 13, negative: 7 },
    { month: "May", positive: 85, neutral: 10, negative: 5 },
    { month: "Jun", positive: 88, neutral: 8, negative: 4 },
  ];

  const sentimentDistribution = [
    { name: "Positive", value: 85 },
    { name: "Neutral", value: 10 },
    { name: "Negative", value: 5 },
  ];

  const recentReviews = [
    {
      rating: 5,
      comment: "Excellent service and amazing food quality!",
      date: "2024-03-15",
    },
    {
      rating: 4,
      comment: "Great atmosphere, but a bit pricey.",
      date: "2024-03-14",
    },
    {
      rating: 5,
      comment: "Best Italian restaurant in town!",
      date: "2024-03-13",
    },
  ];

  const customerPreferences = [
    { category: "Food Quality", score: 4.8 },
    { category: "Service", score: 4.6 },
    { category: "Ambiance", score: 4.7 },
    { category: "Value", score: 4.2 },
    { category: "Cleanliness", score: 4.9 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Sentiment Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="positive"
                stroke="#00C49F"
                name="Positive"
              />
              <Line
                type="monotone"
                dataKey="neutral"
                stroke="#FFBB28"
                name="Neutral"
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="#FF8042"
                name="Negative"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Overall Sentiment</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentDistribution}
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
                {sentimentDistribution.map((entry, index) => (
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
        <h3 className="mb-4 text-lg font-semibold">Recent Reviews</h3>
        <div className="space-y-4">
          {recentReviews.map((review, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Customer Preferences</h3>
        <div className="space-y-4">
          {customerPreferences.map((preference) => (
            <div key={preference.category} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{preference.category}</span>
                <span className="text-sm font-medium">
                  {preference.score.toFixed(1)}
                </span>
              </div>
              <div className="h-2 bg-primary/10 rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(preference.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="font-medium">Key Insights</h4>
          <ul className="mt-2 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm">
                Customer satisfaction trending upward over the last 6 months
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm">
                Food quality and cleanliness are major strengths
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-sm">
                Value perception could be improved through better pricing strategy
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
} 