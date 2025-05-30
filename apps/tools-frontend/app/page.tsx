"use client"

import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import {
  Wrench,
  MapPin,
  Users,
  BarChart3,
  Search,
  Database,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

export default function ToolsHomePage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [toolsStatus, setToolsStatus] = useState<Record<string, 'active' | 'inactive' | 'error'>>({})

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    // Simulate tool status checking
    const checkToolsStatus = () => {
      setToolsStatus({
        geospatial: 'active',
        restaurant: 'active',
        marketing: 'active',
        customer_journey: 'inactive',
        location_intelligence: 'active',
        accounting: 'error',
        inventory: 'active',
        workforce: 'active',
        seo: 'active',
        postgresql: 'active',
        slack: 'inactive',
        duckduckgo: 'active'
      })
    }

    checkToolsStatus()
    const interval = setInterval(checkToolsStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading BiteBase Tools...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const tools = [
    {
      id: 'geospatial',
      name: 'Geospatial MCP',
      description: 'Location analysis and mapping tools',
      icon: MapPin,
      category: 'Analysis',
      status: toolsStatus.geospatial || 'inactive'
    },
    {
      id: 'restaurant',
      name: 'Restaurant MCP',
      description: 'Restaurant data management and analysis',
      icon: Users,
      category: 'Data',
      status: toolsStatus.restaurant || 'inactive'
    },
    {
      id: 'marketing',
      name: 'Marketing MCP',
      description: 'Marketing analytics and campaign tools',
      icon: TrendingUp,
      category: 'Marketing',
      status: toolsStatus.marketing || 'inactive'
    },
    {
      id: 'customer_journey',
      name: 'Customer Journey MCP',
      description: 'Customer experience tracking and analysis',
      icon: Users,
      category: 'Analytics',
      status: toolsStatus.customer_journey || 'inactive'
    },
    {
      id: 'location_intelligence',
      name: 'Location Intelligence MCP',
      description: 'Advanced location-based insights',
      icon: BarChart3,
      category: 'Intelligence',
      status: toolsStatus.location_intelligence || 'inactive'
    },
    {
      id: 'accounting',
      name: 'Accounting MCP',
      description: 'Financial management and reporting',
      icon: DollarSign,
      category: 'Finance',
      status: toolsStatus.accounting || 'inactive'
    },
    {
      id: 'inventory',
      name: 'Inventory & Purchasing MCP',
      description: 'Supply chain and inventory management',
      icon: Database,
      category: 'Operations',
      status: toolsStatus.inventory || 'inactive'
    },
    {
      id: 'workforce',
      name: 'Workforce Management MCP',
      description: 'Employee scheduling and management',
      icon: Calendar,
      category: 'HR',
      status: toolsStatus.workforce || 'inactive'
    },
    {
      id: 'seo',
      name: 'SEO MCP',
      description: 'Search engine optimization tools',
      icon: Search,
      category: 'Marketing',
      status: toolsStatus.seo || 'inactive'
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL MCP',
      description: 'Database management and queries',
      icon: Database,
      category: 'Data',
      status: toolsStatus.postgresql || 'inactive'
    },
    {
      id: 'slack',
      name: 'Slack MCP',
      description: 'Team communication integration',
      icon: MessageSquare,
      category: 'Communication',
      status: toolsStatus.slack || 'inactive'
    },
    {
      id: 'duckduckgo',
      name: 'DuckDuckGo MCP',
      description: 'Web search and research tools',
      icon: Search,
      category: 'Research',
      status: toolsStatus.duckduckgo || 'inactive'
    }
  ]

  const activeTools = tools.filter(tool => tool.status === 'active').length
  const totalTools = tools.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">BiteBase Tools</h1>
                <p className="text-blue-100">MCP Server Management & Tool Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                {activeTools}/{totalTools} Active
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-blue-100">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tools Dashboard</h2>
          <p className="text-gray-600">Manage and monitor your MCP (Model Context Protocol) servers and tools</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button className="h-12 bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            Start All Tools
          </Button>
          <Button variant="outline" className="h-12">
            <Pause className="w-4 h-4 mr-2" />
            Stop All Tools
          </Button>
          <Button variant="outline" className="h-12">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
          <Button variant="outline" className="h-12">
            <Settings className="w-4 h-4 mr-2" />
            Tool Settings
          </Button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <tool.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(tool.status)}
                    <Badge className={`text-xs ${getStatusColor(tool.status)}`}>
                      {tool.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {tool.description}
                </CardDescription>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={tool.status === 'active' ? 'outline' : 'default'}
                    className="flex-1"
                  >
                    {tool.status === 'active' ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tool Logs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Tool Activity</CardTitle>
            <CardDescription>Latest logs and events from your MCP servers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">Geospatial MCP started successfully</p>
                  <p className="text-sm text-green-600">All location analysis tools are now available</p>
                </div>
                <span className="text-xs text-green-500">2 min ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">Accounting MCP connection error</p>
                  <p className="text-sm text-red-600">Failed to connect to financial data source</p>
                </div>
                <span className="text-xs text-red-500">5 min ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">PostgreSQL MCP updated</p>
                  <p className="text-sm text-blue-600">Database connection pool optimized</p>
                </div>
                <span className="text-xs text-blue-500">10 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
