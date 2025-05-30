'use client';

import React from 'react';
import { UnifiedDashboardLayout } from '../../components/layout/UnifiedDashboardLayout';
import { BarChart2, TrendingUp, TrendingDown, DollarSign, Users, MapPin, Star, Clock, Utensils, Search } from 'lucide-react';

export default function CompetitiveAnalysisPage() {
  const competitors = [
    {
      name: "Bistro Bella",
      rating: 4.7,
      priceRange: "$$",
      distance: "0.8 miles",
      cuisine: "Italian",
      avgWait: "25 min",
      popularity: 92,
      trend: "up"
    },
    {
      name: "The Hungry Dragon",
      rating: 4.5,
      priceRange: "$$$",
      distance: "1.2 miles",
      cuisine: "Asian Fusion",
      avgWait: "35 min",
      popularity: 88,
      trend: "up"
    },
    {
      name: "Green Garden Cafe",
      rating: 4.3,
      priceRange: "$$",
      distance: "0.5 miles",
      cuisine: "Vegetarian",
      avgWait: "15 min",
      popularity: 75,
      trend: "stable"
    },
    {
      name: "Seaside Grill",
      rating: 4.1,
      priceRange: "$$$",
      distance: "1.5 miles",
      cuisine: "Seafood",
      avgWait: "40 min",
      popularity: 82,
      trend: "down"
    },
    {
      name: "Urban Plate",
      rating: 4.4,
      priceRange: "$$",
      distance: "0.7 miles",
      cuisine: "American",
      avgWait: "20 min",
      popularity: 85,
      trend: "up"
    }
  ];

  const menuAnalysis = [
    { category: "Appetizers", yourPrice: 12.99, avgCompetitorPrice: 10.99, difference: "+18%" },
    { category: "Main Courses", yourPrice: 24.99, avgCompetitorPrice: 26.99, difference: "-7%" },
    { category: "Desserts", yourPrice: 8.99, avgCompetitorPrice: 9.99, difference: "-10%" },
    { category: "Beverages", yourPrice: 5.99, avgCompetitorPrice: 5.49, difference: "+9%" },
    { category: "Specials", yourPrice: 29.99, avgCompetitorPrice: 28.99, difference: "+3%" }
  ];

  const customerInsights = [
    { metric: "Average Age", value: "32", competitorAvg: "35", difference: "-3 years" },
    { metric: "Family Visits", value: "28%", competitorAvg: "22%", difference: "+6%" },
    { metric: "Repeat Customers", value: "42%", competitorAvg: "38%", difference: "+4%" },
    { metric: "Average Spend", value: "$42.50", competitorAvg: "$45.75", difference: "-$3.25" },
    { metric: "Evening Traffic", value: "65%", competitorAvg: "58%", difference: "+7%" }
  ];

  return (
    <UnifiedDashboardLayout
      title="Competitive Analysis"
      description="Analyze your competition and position your restaurant strategically"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search competitors..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option value="">Distance</option>
                <option value="0.5">Within 0.5 miles</option>
                <option value="1">Within 1 mile</option>
                <option value="2">Within 2 miles</option>
                <option value="5">Within 5 miles</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option value="">Cuisine</option>
                <option value="italian">Italian</option>
                <option value="asian">Asian</option>
                <option value="american">American</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="seafood">Seafood</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option value="">Price Range</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
              </select>
            </div>
          </div>
        </div>

        {/* Competitor Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nearby Competitors</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Restaurant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Distance</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cuisine</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wait Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Popularity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {competitors.map((competitor, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{competitor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{competitor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{competitor.priceRange}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{competitor.distance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-1" />
                        <span>{competitor.cuisine}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{competitor.avgWait}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${competitor.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{competitor.popularity}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {competitor.trend === 'up' && (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      )}
                      {competitor.trend === 'down' && (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      {competitor.trend === 'stable' && (
                        <div className="h-0.5 w-5 bg-gray-400 dark:bg-gray-500 mx-auto"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Menu Price Comparison */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Menu Price Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Your Avg. Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Competitor Avg. Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difference</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {menuAnalysis.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.yourPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.avgCompetitorPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.difference.startsWith('+') 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      }`}>
                        {item.difference}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Demographics Comparison */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Demographics Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metric</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Your Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Competitor Avg.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difference</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerInsights.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.metric}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.competitorAvg}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        (item.metric === "Average Age" && item.difference.includes("-")) ||
                        (item.metric === "Average Spend" && item.difference.includes("-")) ||
                        (item.metric !== "Average Age" && item.metric !== "Average Spend" && item.difference.includes("+"))
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {item.difference}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Competitive Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Family-Friendly</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Your restaurant attracts 6% more family visits than competitors, suggesting your family-friendly atmosphere is a key differentiator.</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Loyalty</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">With 4% higher repeat customer rate than the competition, your restaurant has built stronger customer loyalty.</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Evening Traffic</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Your restaurant captures 7% more evening traffic than competitors, indicating strong appeal for dinner service.</p>
            </div>
          </div>
        </div>
      </div>
    </UnifiedDashboardLayout>
  );
}
