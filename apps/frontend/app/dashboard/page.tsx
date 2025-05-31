"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@bitebase/ui"
import {
  BarChart2,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Target,
  Utensils,
  MessageCircle,
  Send,
  RefreshCw,
  Download,
  Plus,
  FileText,
  Map,
  Calendar
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

import { 
  DashboardGrid, 
  DashboardSection, 
  MetricCard, 
  ChartCard, 
  InsightCard,
  ActivityItem 
} from "../../components/dashboard/DashboardGrid"
import { ChartContainer, SimpleLineChart, SimpleBarChart } from "../../components/ui/chart-container"
import { tourUtils } from "../../utils/tourUtils"

// Realistic data for Bella Vista Bistro - Mediterranean restaurant in Bangkok
const bellaVistaMetrics = {
  revenue: { 
    value: "฿185,400", 
    change: { value: 12.3, period: 'vs last month', trend: 'up' as const }
  },
  customers: { 
    value: "892", 
    change: { value: 8.7, period: 'vs last month', trend: 'up' as const }
  },
  avgOrder: { 
    value: "฿680", 
    change: { value: 5.2, period: 'vs last month', trend: 'up' as const }
  },
  satisfaction: { 
    value: "4.6", 
    change: { value: 0.1, period: 'vs last month', trend: 'up' as const }
  },
  footTraffic: { 
    value: "1,847", 
    change: { value: 18.5, period: 'vs yesterday', trend: 'up' as const }
  },
  conversionRate: { 
    value: "48.3%", 
    change: { value: 2.1, period: 'vs last week', trend: 'up' as const }
  },
  marketShare: { 
    value: "8.7%", 
    change: { value: 0.9, period: 'vs last quarter', trend: 'up' as const }
  },
  competitorGap: { 
    value: "15.2%", 
    change: { value: -2.1, period: 'vs last quarter', trend: 'down' as const }
  }
}

// AI-generated insights for Bella Vista Bistro
const bellaVistaInsights = [
  {
    id: 1,
    type: 'opportunity' as const,
    title: 'Weekend Dinner Rush Expansion',
    description: 'Friday-Saturday 7-9pm shows 35% higher demand than seating capacity',
    impact: 'High' as const,
    action: 'Optimize staffing',
    priority: 1,
    icon: TrendingUp
  },
  {
    id: 2,
    type: 'warning' as const,
    title: 'New Italian Competitor Nearby',
    description: 'Nonna\'s Kitchen opened 200m away with 20% lower prices',
    impact: 'Medium' as const,
    action: 'Review pricing',
    priority: 2,
    icon: Target
  },
  {
    id: 3,
    type: 'info' as const,
    title: 'Signature Pasta Performance',
    description: 'Seafood Linguine and Truffle Risotto drive 45% of revenue',
    impact: 'Low' as const,
    action: 'Promote variety',
    priority: 3,
    icon: Utensils
  }
]

// Recent activity for Bella Vista Bistro
const bellaVistaActivity = [
  {
    id: 1,
    action: 'Market analysis completed for Sukhumvit Soi 11 area',
    time: '2 hours ago',
    type: 'analysis' as const,
    icon: BarChart2
  },
  {
    id: 2,
    action: 'New competitor detected: "Nonna\'s Kitchen"',
    time: '4 hours ago',
    type: 'feedback' as const,
    icon: Target
  },
  {
    id: 3,
    action: 'Weekly performance report generated',
    time: '1 day ago',
    type: 'report' as const,
    icon: FileText
  },
  {
    id: 4,
    action: 'Customer satisfaction survey completed (4.6/5 avg)',
    time: '2 days ago',
    type: 'feedback' as const,
    icon: Users
  }
]

// Competitor data for Sukhumvit area
const sukhumvitCompetitors = [
  { name: 'Nonna\'s Kitchen', distance: '200m', rating: 4.3, priceRange: '฿฿', marketShare: 12, trend: 'up' },
  { name: 'Ciao Bella', distance: '350m', rating: 4.5, priceRange: '฿฿฿', marketShare: 18, trend: 'stable' },
  { name: 'Mediterranean Delights', distance: '500m', rating: 4.1, priceRange: '฿฿', marketShare: 9, trend: 'down' },
  { name: 'Pasta Paradise', distance: '400m', rating: 4.4, priceRange: '฿฿', marketShare: 14, trend: 'up' }
]

export default function DashboardPage() {
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{id: string, message: string, isUser: boolean, timestamp: string}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      message: chatMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        message: `Based on your question about "${chatMessage}", I recommend analyzing your location's foot traffic patterns and competitor pricing strategies. Would you like me to run a detailed market analysis for your area?`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }
      setChatMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
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
    <div data-tour="dashboard">
      {/* Header Actions */}
      <div className="flex justify-end gap-2 mb-6">
        <Button variant="outline" onClick={() => console.log('Export report')}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button onClick={() => router.push('/market-analysis')}>
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>
      {/* Key Metrics Overview */}
      <DashboardSection 
        title="Key Performance Metrics" 
        description="Monitor your restaurant's vital statistics"
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/reports')}>
            <FileText className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        }
      >
        <DashboardGrid>
          <MetricCard
            title="Monthly Revenue"
            value={bellaVistaMetrics.revenue.value}
            change={bellaVistaMetrics.revenue.change}
            icon={<DollarSign className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Customer Count"
            value={bellaVistaMetrics.customers.value}
            change={bellaVistaMetrics.customers.change}
            icon={<Users className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Average Order"
            value={bellaVistaMetrics.avgOrder.value}
            change={bellaVistaMetrics.avgOrder.change}
            icon={<Utensils className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Satisfaction Score"
            value={bellaVistaMetrics.satisfaction.value}
            change={bellaVistaMetrics.satisfaction.change}
            icon={<Star className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Foot Traffic"
            value={bellaVistaMetrics.footTraffic.value}
            change={bellaVistaMetrics.footTraffic.change}
            icon={<MapPin className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Conversion Rate"
            value={bellaVistaMetrics.conversionRate.value}
            change={bellaVistaMetrics.conversionRate.change}
            icon={<TrendingUp className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Market Share"
            value={bellaVistaMetrics.marketShare.value}
            change={bellaVistaMetrics.marketShare.change}
            icon={<Target className="h-5 w-5" />}
            status="connected"
          />
          
          <MetricCard
            title="Competitive Gap"
            value={bellaVistaMetrics.competitorGap.value}
            change={bellaVistaMetrics.competitorGap.change}
            icon={<BarChart2 className="h-5 w-5" />}
            status="connected"
          />
        </DashboardGrid>
      </DashboardSection>

      {/* Main Content Grid - 2 Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Chat Assistant */}
        <div>
          <ChartCard
            title="AI Market Assistant"
          >
            <div className="space-y-4" data-tour="ai-chat">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
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
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Ask me anything about your restaurant business!</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Try: "How can I increase my revenue?" or "Analyze my location"</p>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about market trends, competitors, or business strategies..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
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
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Insights</h3>
            <div className="space-y-3">
              {bellaVistaInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                  impact={insight.impact}
                  action={insight.action}
                  priority={insight.priority}
                  icon={<insight.icon className="h-5 w-5" />}
                  onAction={() => {
                    // Handle insight action based on type
                    if (insight.type === 'opportunity') {
                      router.push('/market-analysis')
                    } else if (insight.type === 'warning') {
                      router.push('/price')
                    } else {
                      router.push('/product')
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <DashboardSection 
        title="Recent Activity" 
        description="Latest actions and system updates"
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/reports')}>
            <FileText className="w-4 h-4 mr-2" />
            View All
          </Button>
        }
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6">
            <div className="space-y-1">
              {bellaVistaActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  action={activity.action}
                  time={activity.time}
                  type={activity.type}
                  icon={<activity.icon className="h-4 w-4" />}
                />
              ))}
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Analytics Charts */}
      <DashboardSection 
        title="Performance Analytics" 
        description="Track your business metrics and trends"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <ChartCard
            title="Revenue Trend"
            timeRange="7d"
            onTimeRangeChange={(range) => console.log('Time range changed:', range)}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect POS system to view revenue trends</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push('/settings/integrations')}
                >
                  Connect Now
                </Button>
              </div>
            </div>
          </ChartCard>

          {/* Market Share Chart */}
          <ChartCard
            title="Market Share Analysis"
            timeRange="30d"
            onTimeRangeChange={(range) => console.log('Time range changed:', range)}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Run market analysis to view competitive positioning</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => router.push('/market-analysis')}
                >
                  Analyze Market
                </Button>
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardSection>

      {/* Competitor Analysis */}
      <DashboardSection 
        title="Competitor Analysis" 
        description="Monitor your competition and market positioning"
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/market-analysis')}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Full Analysis
          </Button>
        }
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Restaurant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Distance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Price Range</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Market Share</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sukhumvitCompetitors.map((competitor, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{competitor.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{competitor.distance}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-gray-900 dark:text-gray-100">{competitor.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{competitor.priceRange}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{competitor.marketShare}%</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          competitor.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          competitor.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {competitor.trend === 'up' ? '↗' : competitor.trend === 'down' ? '↘' : '→'} {competitor.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardSection>
    </div>
  )
}