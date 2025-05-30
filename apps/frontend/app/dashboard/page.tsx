"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@bitebase/ui"
import {
  BarChart2,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  Plus,
  FileText,
  Send,
  Map,
  Eye,
  Award,
  ShoppingBag,
  Star,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import PageWrapper from "../../components/layout/PageWrapper"
import AnalysisCard from "../../components/ui/analysis-card"
import { MetricCard as EnhancedMetricCard } from "../../components/ui/metric-card"
import { DataTable } from "../../components/ui/data-table"
import { ChartContainer, SimpleLineChart, SimpleBarChart } from "../../components/ui/chart-container"
import { DataPlaceholder, MetricPlaceholder, ChartPlaceholder, TablePlaceholder } from "../../components/ui/DataPlaceholder"
import { tourUtils } from "../../utils/tourUtils"
import { TourDemo } from "../../components/tour/TourDemo"

// Placeholder data structure - will be replaced with real API data
const placeholderMetrics = {
  revenue: { value: null, change: null, period: 'vs last month' },
  customers: { value: null, change: null, period: 'vs last month' },
  avgOrder: { value: null, change: null, period: 'vs last month' },
  satisfaction: { value: null, change: null, period: 'vs last month' },
  footTraffic: { value: null, change: null, period: 'vs yesterday' },
  conversionRate: { value: null, change: null, period: 'vs last week' },
  marketShare: { value: null, change: null, period: 'vs last quarter' },
  competitorGap: { value: null, change: null, period: 'vs last quarter' }
}

const mockRecentActivity = [
  { id: 1, action: 'New competitor analysis completed', time: '2 hours ago', type: 'analysis', icon: BarChart2 },
  { id: 2, action: 'Market report generated for Sukhumvit', time: '4 hours ago', type: 'report', icon: FileText },
  { id: 3, action: 'Price optimization recommendations', time: '6 hours ago', type: 'optimization', icon: DollarSign },
  { id: 4, action: 'Customer feedback analysis', time: '8 hours ago', type: 'feedback', icon: Users },
  { id: 5, action: 'Location scout report: Silom area', time: '1 day ago', type: 'location', icon: Map }
]

const mockTopCompetitors = [
  { name: 'Bella Vista', distance: '0.3 mi', rating: 4.2, priceRange: '$$', marketShare: 18.5, trend: 'up' },
  { name: 'Green Garden', distance: '0.5 mi', rating: 4.0, priceRange: '$$$', marketShare: 14.2, trend: 'stable' },
  { name: 'Urban Bites', distance: '0.7 mi', rating: 3.8, priceRange: '$', marketShare: 12.8, trend: 'down' },
  { name: 'Fusion Kitchen', distance: '0.9 mi', rating: 4.1, priceRange: '$$', marketShare: 11.3, trend: 'up' }
]

const mockInsights = [
  {
    id: 1,
    type: 'opportunity',
    title: 'High-Traffic Location Identified',
    description: 'Downtown area shows 40% higher foot traffic during lunch hours',
    impact: 'High',
    action: 'Consider opening a second location',
    priority: 1,
    icon: TrendingUp
  },
  {
    id: 2,
    type: 'warning',
    title: 'Competitor Price Drop',
    description: 'Main competitor reduced lunch prices by 15%',
    impact: 'Medium',
    action: 'Review pricing strategy',
    priority: 2,
    icon: AlertTriangle
  },
  {
    id: 3,
    type: 'success',
    title: 'Menu Item Performance',
    description: 'New seasonal salad increased sales by 25%',
    impact: 'Medium',
    action: 'Expand seasonal offerings',
    priority: 3,
    icon: CheckCircle
  },
  {
    id: 4,
    type: 'info',
    title: 'Peak Hours Analysis',
    description: 'Lunch rush extended by 30 minutes on weekdays',
    impact: 'Low',
    action: 'Adjust staffing schedule',
    priority: 4,
    icon: Info
  }
]

export default function DashboardPage() {
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{id: string, message: string, isUser: boolean, timestamp: string}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const { user } = useAuth()
  const router = useRouter()

  // Initialize chat with welcome message
  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    setChatMessages([
      {
        id: '1',
        message: "Welcome! I'm your BiteBase AI assistant. I can help you with market research, competitor analysis, demographic insights, and location scoring. What would you like to explore today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }
    ])

    setIsLoading(false)

    // Debug: Log tour state on page load
    console.log('Dashboard loaded. Tour state:', tourUtils.getTourState())
  }, [user, router])

  // AI Response function
  const getAIResponse = async (query: string): Promise<string> => {
    try {
      const aiAgentsUrl = process.env.NEXT_PUBLIC_AGENT_API_URL || 'https://bitebase-ai-agents-production.bitebase.workers.dev'

      const response = await fetch(`${aiAgentsUrl}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'Bangkok, Thailand',
          cuisine_type: 'general consultation',
          additional_context: {
            message: query,
            conversation_type: 'dashboard_chat'
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis || data.message || "I've analyzed your query and can provide detailed insights. Please let me know what specific aspect you'd like me to focus on."
      } else {
        throw new Error('AI service unavailable')
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      return "I'm here to help with your restaurant business intelligence needs! I can provide insights on market opportunities, competitor analysis, demographic data, location scoring, menu optimization, and marketing strategies. What specific area would you like to explore?"
    }
  }

  // Send chat message
  const sendChatMessage = () => {
    if (!chatMessage.trim()) return

    const userMessage = chatMessage

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      message: userMessage,
      isUser: true,
      timestamp: 'Just now'
    }])

    setChatMessage('')
    setIsTyping(true)

    getAIResponse(userMessage).then(aiResponse => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: 'Just now'
      }])
      setIsTyping(false)
    }).catch(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        message: "Sorry, I'm having trouble connecting to the AI service. Please try again.",
        isUser: false,
        timestamp: 'Just now'
      }])
      setIsTyping(false)
    })
  }

  // Send suggestion
  const sendSuggestion = (suggestion: string) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      message: suggestion,
      isUser: true,
      timestamp: 'Just now'
    }])

    setIsTyping(true)

    getAIResponse(suggestion).then(aiResponse => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: 'Just now'
      }])
      setIsTyping(false)
    }).catch(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        message: "Sorry, I'm having trouble connecting to the AI service. Please try again.",
        isUser: false,
        timestamp: 'Just now'
      }])
      setIsTyping(false)
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Debug Panel - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs">
          <div className="mb-2 font-semibold">Tour Debug</div>
          <div>State: {tourUtils.isTourDisabled() ? 'Disabled' : 'Enabled'}</div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { tourUtils.disableTour(); window.location.reload() }}
              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
            >
              Disable Tour
            </button>
            <button
              onClick={() => { tourUtils.enableTour(); window.location.reload() }}
              className="bg-primary hover:bg-primary-600 px-2 py-1 rounded text-xs text-white"
            >
              Enable Tour
            </button>
          </div>
        </div>
      )}

      <PageWrapper
        title="Market Intelligence Dashboard"
        description="Get AI-powered insights for your restaurant business decisions"
        actions={[
          {
            label: "New Analysis",
            onClick: () => router.push('/market-analysis'),
            icon: <Plus className="w-4 h-4" />
          },
          {
            label: "Generate Report",
            onClick: () => router.push('/reports'),
            variant: "outline",
            icon: <FileText className="w-4 h-4" />
          }
        ]}
      >
        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Total Revenue</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Connect POS for data</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Customer Count</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Connect POS for data</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Average Order Value</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Connect POS for data</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Customer Satisfaction</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Connect POS for data</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Daily Foot Traffic</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Location data needed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Analytics needed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Market Share</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Market analysis needed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Competitive Gap</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-400">--</div>
                  <div className="text-sm text-gray-400">Competitor data needed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* AI Chat Assistant */}
                  <div className="lg:col-span-2">
            <div className="rounded-lg bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col space-y-1.5 p-6 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold tracking-tight text-lg flex items-center">AI Market Assistant</h3>
                    <p className="text-sm text-gray-500 mt-1">Get instant insights about market opportunities, competitors, and demographics</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChatMessages([])}
                      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >
                      Clear Chat
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-4" data-tour="ai-chat">
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.isUser
                              ? 'bg-blue-600 text-white rounded-lg'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Analyze Bangkok market opportunities",
                      "Compare competitor pricing",
                      "Show demographic insights",
                      "Location scoring analysis"
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendSuggestion(suggestion)}
                        className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-xs"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Ask about market opportunities, competitors, demographics..."
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!chatMessage.trim() || isTyping}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
                  <div className="space-y-6">
            <AnalysisCard
              title="Quick Actions"
              description="Jump to key features"
            >
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/market-analysis')}
                  className="w-full justify-start btn-primary"
                  data-tour="map-analysis"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Analyze Location
                </Button>
                <Button
                  onClick={() => router.push('/restaurant-setup')}
                  variant="outline"
                  className="w-full justify-start"
                  data-tour="restaurant-setup"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Setup Restaurant
                        </Button>
                <Button
                  onClick={() => router.push('/reports')}
                  variant="outline"
                  className="w-full justify-start"
                  data-tour="reports"
                >
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Report
                        </Button>
              </div>
            </AnalysisCard>

            <AnalysisCard
              title="AI Insights"
              description="Latest trends and opportunities"
            >
              <div className="space-y-4">
                {mockInsights.map((insight) => {
                  const IconComponent = insight.icon
                  const bgColor = insight.type === 'opportunity' ? 'bg-green-50 border-green-200' :
                                 insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                                 insight.type === 'success' ? 'bg-blue-50 border-blue-200' :
                                 'bg-gray-50 border-gray-200'
                  const textColor = insight.type === 'opportunity' ? 'text-green-800' :
                                   insight.type === 'warning' ? 'text-amber-800' :
                                   insight.type === 'success' ? 'text-blue-800' :
                                   'text-gray-800'
                  const iconColor = insight.type === 'opportunity' ? 'text-green-600' :
                                   insight.type === 'warning' ? 'text-amber-600' :
                                   insight.type === 'success' ? 'text-blue-600' :
                                   'text-gray-600'

                  return (
                    <div key={insight.id} className={`p-3 rounded-lg border ${bgColor}`}>
                      <div className="flex items-center mb-2">
                        <IconComponent className={`w-4 h-4 mr-2 ${iconColor}`} />
                        <span className={`text-sm font-medium ${textColor}`}>{insight.title}</span>
                        <span className="ml-auto text-xs text-gray-500">{insight.impact} Impact</span>
                      </div>
                      <p className={`text-sm ${textColor.replace('800', '700')}`}>{insight.description}</p>
                      <p className="text-xs text-gray-600 mt-1 font-medium">{insight.action}</p>
                    </div>
                  )
                })}
              </div>
            </AnalysisCard>
            </div>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Performance Chart */}
          <ChartContainer
            title="Revenue Trend"
            subtitle="Monthly performance over the last 6 months"
            chartType="line"
            timeRange="Last 6 months"
            actions={{
              onExport: () => console.log('Export chart'),
              onRefresh: () => console.log('Refresh data'),
              onExpand: () => console.log('Expand chart')
            }}
          >
            <SimpleLineChart data={[1, 2, 3, 4, 5, 6]} height={300} />
          </ChartContainer>

          {/* Market Share Chart */}
          <ChartContainer
            title="Market Share Analysis"
            subtitle="Competitive positioning in local market"
            chartType="pie"
            timeRange="Current quarter"
            actions={{
              onExport: () => console.log('Export chart'),
              onRefresh: () => console.log('Refresh data')
            }}
          >
            <SimpleBarChart data={mockTopCompetitors} height={300} />
          </ChartContainer>
        </div>

        {/* Competitor Analysis Table */}
        <div className="mt-8">
          <DataTable
            title="Competitor Analysis"
            data={mockTopCompetitors}
            columns={[
              { key: 'name', title: 'Restaurant', sortable: true },
              { key: 'distance', title: 'Distance', sortable: true },
              {
                key: 'rating',
                title: 'Rating',
                sortable: true,
                render: (value: number) => (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {value}
                  </div>
                )
              },
              { key: 'priceRange', title: 'Price Range', sortable: true },
              {
                key: 'marketShare',
                title: 'Market Share',
                sortable: true,
                render: (value: number) => `${value}%`
              },
              {
                key: 'trend',
                title: 'Trend',
                render: (value: string) => (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'up' ? 'bg-green-100 text-green-800' :
                    value === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {value === 'up' ? '↗' : value === 'down' ? '↘' : '→'} {value}
                  </span>
                )
              }
            ]}
            searchable={true}
            exportable={true}
            pagination={true}
            pageSize={5}
          />
        </div>

        {/* Recent Activity Feed */}
        <div className="mt-8">
          <AnalysisCard
            title="Recent Activity"
            description="Latest system activities and updates"
          >
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'analysis' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'report' ? 'bg-green-100 text-green-800' :
                      activity.type === 'optimization' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'feedback' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                )
              })}
            </div>
          </AnalysisCard>
        </div>

        {/* Tour Demo - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <TourDemo />
          </div>
        )}
      </PageWrapper>
    </>
  )
}