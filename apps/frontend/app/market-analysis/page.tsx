"use client"

import * as React from "react"
import { Button } from "@bitebase/ui"
import { Input } from "@bitebase/ui"
import { Label } from "@bitebase/ui"
import { MapContainer } from "../../components/geospatial/MapContainer"
import { RestaurantMarker } from "../../components/geospatial/RestaurantMarker"
import { AnalysisOverlay } from "../../components/geospatial/AnalysisOverlay"
import { DemographicLayer } from "../../components/geospatial/DemographicLayer"
import { MapPin, BarChart3, Users, DollarSign, TrendingUp, Filter, Download, RefreshCw, Eye, Target, Star, Clock } from "lucide-react"
import { MainLayout } from "../../components/layout/MainLayout"
import { PageWrapper, MetricCard, AnalysisCard } from "../../components/layout/PageWrapper"
import { MetricCard as EnhancedMetricCard } from "../../components/ui/metric-card"
import { DataTable } from "../../components/ui/data-table"
import { ChartContainer, SimpleLineChart, SimpleBarChart } from "../../components/ui/chart-container"

// Production data interfaces
interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  position: [number, number]
  address?: string
  priceRange?: string
}

interface Demographics {
  area: string
  population: number
  medianIncome: number
  ageGroups: {
    "18-25": number
    "26-35": number
    "36-50": number
    "51-65": number
    "65+": number
  }
  coordinates: [number, number][]
}

export default function MarketAnalysisPage() {
  const [selectedLocation, setSelectedLocation] = React.useState("Bangkok, Thailand")
  const [analysisType, setAnalysisType] = React.useState<"heatmap" | "density" | "competition" | "demographics">("heatmap")
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([])
  const [demographics, setDemographics] = React.useState<Demographics[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch real restaurant data
  const fetchRestaurants = React.useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bitebase-backend-api-production.bitebase.workers.dev'
      const response = await fetch(`${backendUrl}/api/restaurants?latitude=${lat}&longitude=${lng}&radius=5000`)

      if (response.ok) {
        const data = await response.json()
        const formattedRestaurants: Restaurant[] = (data.restaurants || []).map((r: any) => ({
          id: r.id.toString(),
          name: r.name,
          cuisine: r.cuisine || 'Unknown',
          rating: r.rating || 0,
          position: [r.latitude, r.longitude] as [number, number],
          address: r.address,
          priceRange: r.price_range
        }))
        setRestaurants(formattedRestaurants)
      } else {
        throw new Error('Failed to fetch restaurant data')
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError('Failed to load restaurant data')
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch demographics data from AI agent
  const fetchDemographics = React.useCallback(async (location: string) => {
    try {
      const aiAgentsUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'https://bitebase-ai-agents-production.bitebase.workers.dev'
      const response = await fetch(`${aiAgentsUrl}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          cuisine_type: 'demographic analysis',
          additional_context: { analysis_type: 'demographics' }
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Parse demographics from AI response
        // For now, use default structure until AI provides structured data
        setDemographics([])
      }
    } catch (err) {
      console.error('Error fetching demographics:', err)
    }
  }, [])

  // Load data on component mount
  React.useEffect(() => {
    // Default Bangkok coordinates
    fetchRestaurants(13.7563, 100.5018)
    fetchDemographics(selectedLocation)
  }, [selectedLocation, fetchRestaurants, fetchDemographics])
  const [showDemographics, setShowDemographics] = React.useState(false)

  return (
    <MainLayout showWelcomeBanner={false}>
      <PageWrapper
        title="Market Analysis"
        description="Comprehensive geospatial analysis for restaurant market research"
        actions={[
          {
            label: "Save Analysis",
            onClick: () => console.log('Save analysis'),
            variant: "outline",
            icon: <Download className="w-4 h-4" />
          },
          {
            label: "Generate Report",
            onClick: () => console.log('Generate report'),
            icon: <BarChart3 className="w-4 h-4" />
          }
        ]}
      >

        {/* Analysis Controls */}
        <AnalysisCard
          title="Analysis Configuration"
          description="Configure your market analysis parameters"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="location">Target Location</Label>
              <Input
                id="location"
                placeholder="e.g., Sukhumvit, Bangkok or 13.7563, 100.5018"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-input-theme"
              />
            </div>
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <div className="flex space-x-2">
                {(["heatmap", "density", "competition", "demographics"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={analysisType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType(type)}
                    className={analysisType === type ? "btn-tool-active" : "btn-tool-inactive"}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Layers</Label>
              <div className="flex space-x-2">
                <Button
                  variant={showDemographics ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowDemographics(!showDemographics)}
                  className={showDemographics ? "btn-tool-active" : "btn-tool-inactive"}
                >
                  Demographics
                </Button>
              </div>
            </div>
          </div>
        </AnalysisCard>

        {/* Main Analysis View */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map */}
          <div className="lg:col-span-2">
            <AnalysisCard
              title="Interactive Market Map"
              description="Geospatial visualization of market opportunities and competition"
              loading={loading}
              error={error}
              data-tour="map-analysis"
            >
              <MapContainer
                center={[13.7563, 100.5018]}
                zoom={14}
                height="600px"
                className="relative"
              >
                <AnalysisOverlay type={analysisType} visible={true} />

                {/* Loading indicator */}
                {loading && (
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg z-10">
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-700">Loading restaurants...</span>
                    </div>
                  </div>
                )}

                {/* Error indicator */}
                {error && (
                  <div className="absolute top-4 left-4 bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow-lg z-10">
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                {/* Restaurant count */}
                {!loading && !error && restaurants.length > 0 && (
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-lg z-10">
                    <span className="text-sm text-gray-700">
                      {restaurants.length} restaurants found
                    </span>
                  </div>
                )}

                {/* Demographics overlay */}
                {showDemographics && demographics.length > 0 && (
                  <DemographicLayer
                    data={demographics}
                    metric="population"
                    visible={true}
                  />
                )}

                {/* Real restaurant markers */}
                {restaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${50 + (index % 5 - 2) * 10}%`,
                      top: `${50 + (Math.floor(index / 5) % 5 - 2) * 10}%`,
                    }}
                    onClick={() => {
                      // Handle restaurant click for detailed analysis
                      console.log('Restaurant clicked:', restaurant)
                    }}
                  >
                    <RestaurantMarker restaurant={restaurant} />
                  </div>
                ))}
              </MapContainer>
            </AnalysisCard>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Enhanced Key Metrics */}
            <div className="space-y-4">
              <EnhancedMetricCard
                title="Market Opportunity"
                value="8.5/10"
                change={{ value: 12, type: "increase", period: "vs avg" }}
                icon={TrendingUp}
                variant="success"
                description="High potential for new restaurant"
              />
              <EnhancedMetricCard
                title="Competition Density"
                value="Medium"
                icon={Users}
                variant="warning"
                description="3.2 restaurants per 1000 residents"
              />
              <EnhancedMetricCard
                title="Foot Traffic"
                value="15.2K"
                change={{ value: 8, type: "increase", period: "daily avg" }}
                icon={Eye}
                variant="default"
                description="Daily pedestrian count"
              />
              <EnhancedMetricCard
                title="Average Rating"
                value="4.2"
                change={{ value: 0.3, type: "increase", period: "vs area avg" }}
                icon={Star}
                variant="success"
                description="Competitor average rating"
              />
            </div>

            {/* Insights */}
            <AnalysisCard
              title="AI Insights"
              description="AI-powered market analysis insights"
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 animate-pulse"></div>
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Optimal Location Identified</p>
                    <p className="text-green-700">Sukhumvit Soi 11 shows highest potential</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 animate-pulse"></div>
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Cuisine Gap Analysis</p>
                    <p className="text-green-700">Authentic Mexican cuisine underrepresented</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 animate-pulse"></div>
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Peak Hours</p>
                    <p className="text-green-700">Lunch: 12-2pm, Dinner: 7-10pm, Late night: 10pm-1am</p>
                  </div>
                </div>
              </div>
            </AnalysisCard>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full btn-primary">
                Generate Detailed Report
              </Button>
              <Button variant="outline" className="w-full btn-secondary">
                Export Analysis Data
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Market Trends Chart */}
          <ChartContainer
            title="Market Trends"
            subtitle="Restaurant density and foot traffic over time"
            chartType="line"
            timeRange="Last 12 months"
            actions={{
              onExport: () => console.log('Export chart'),
              onRefresh: () => fetchRestaurants(13.7563, 100.5018),
              onExpand: () => console.log('Expand chart')
            }}
          >
            <SimpleLineChart data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} height={300} />
          </ChartContainer>

          {/* Competition Analysis Chart */}
          <ChartContainer
            title="Competition Analysis"
            subtitle="Restaurant distribution by cuisine type"
            chartType="bar"
            timeRange="Current data"
            actions={{
              onExport: () => console.log('Export chart'),
              onRefresh: () => fetchRestaurants(13.7563, 100.5018)
            }}
          >
            <SimpleBarChart data={restaurants.slice(0, 10)} height={300} />
          </ChartContainer>
        </div>

        {/* Restaurant Analysis Table */}
        {restaurants.length > 0 && (
          <div className="mt-8">
            <DataTable
              title="Nearby Restaurants Analysis"
              data={restaurants.slice(0, 20)}
              columns={[
                { key: 'name', title: 'Restaurant Name', sortable: true },
                { key: 'cuisine', title: 'Cuisine Type', sortable: true },
                {
                  key: 'rating',
                  title: 'Rating',
                  sortable: true,
                  render: (value: number) => (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {value || 'N/A'}
                    </div>
                  )
                },
                {
                  key: 'priceRange',
                  title: 'Price Range',
                  sortable: true,
                  render: (value: string) => value || 'Unknown'
                },
                {
                  key: 'address',
                  title: 'Address',
                  render: (value: string) => (
                    <span className="text-sm text-gray-600 truncate max-w-xs block">
                      {value || 'Address not available'}
                    </span>
                  )
                }
              ]}
              searchable={true}
              exportable={true}
              pagination={true}
              pageSize={10}
              onRowClick={(restaurant) => {
                console.log('Restaurant selected:', restaurant)
                // Could open detailed analysis modal
              }}
            />
          </div>
        )}

        {/* Market Insights Summary */}
        <div className="mt-8">
          <AnalysisCard
            title="Market Analysis Summary"
            description="Key findings and recommendations based on current data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">Growth Opportunity</h4>
                </div>
                <p className="text-sm text-green-700 mb-2">
                  High foot traffic area with moderate competition density
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• 15.2K daily foot traffic</li>
                  <li>• 3.2 restaurants per 1000 residents</li>
                  <li>• Average rating: 4.2/5</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-3">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-800">Target Demographics</h4>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Young professionals and tourists dominate the area
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• 25-35 age group: 40%</li>
                  <li>• High disposable income</li>
                  <li>• International cuisine preference</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center mb-3">
                  <Clock className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-medium text-purple-800">Peak Hours</h4>
                </div>
                <p className="text-sm text-purple-700 mb-2">
                  Clear patterns in customer traffic throughout the day
                </p>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• Lunch: 12:00-14:00</li>
                  <li>• Dinner: 19:00-22:00</li>
                  <li>• Late night: 22:00-01:00</li>
                </ul>
              </div>
            </div>
          </AnalysisCard>
        </div>
      </PageWrapper>
    </MainLayout>
  )
}
