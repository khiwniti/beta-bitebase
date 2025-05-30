"use client"

import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import {
  Workflow,
  Play,
  Pause,
  Settings,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Search,
  Calendar,
  FileText,
  ArrowRight,
  Activity
} from 'lucide-react'

export default function WorkflowsHomePage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [workflows, setWorkflows] = useState<any[]>([])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    // Simulate workflow data
    setWorkflows([
      {
        id: 'procurement-payment',
        name: 'Procurement-to-Payment',
        description: 'Automated supplier management and payment processing',
        status: 'active',
        lastRun: '2 hours ago',
        successRate: 98.5,
        category: 'Finance',
        icon: DollarSign,
        steps: 8,
        avgDuration: '15 min'
      },
      {
        id: 'menu-engineering',
        name: 'Menu Engineering',
        description: 'Optimize menu items based on profitability and popularity',
        status: 'active',
        lastRun: '4 hours ago',
        successRate: 95.2,
        category: 'Operations',
        icon: BarChart3,
        steps: 6,
        avgDuration: '12 min'
      },
      {
        id: 'labor-optimization',
        name: 'Labor Optimization',
        description: 'Staff scheduling based on demand forecasting',
        status: 'paused',
        lastRun: '1 day ago',
        successRate: 92.8,
        category: 'HR',
        icon: Users,
        steps: 10,
        avgDuration: '20 min'
      },
      {
        id: 'financial-management',
        name: 'Financial Management',
        description: 'Automated financial reporting and analysis',
        status: 'active',
        lastRun: '30 min ago',
        successRate: 99.1,
        category: 'Finance',
        icon: TrendingUp,
        steps: 12,
        avgDuration: '25 min'
      },
      {
        id: 'seo-optimization',
        name: 'SEO Optimization',
        description: 'Automated SEO analysis and content optimization',
        status: 'error',
        lastRun: '6 hours ago',
        successRate: 87.3,
        category: 'Marketing',
        icon: Search,
        steps: 7,
        avgDuration: '18 min'
      },
      {
        id: 'market-research',
        name: 'Marketing Research',
        description: 'Competitive analysis and market trend identification',
        status: 'active',
        lastRun: '1 hour ago',
        successRate: 94.7,
        category: 'Marketing',
        icon: MapPin,
        steps: 9,
        avgDuration: '22 min'
      }
    ])
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading BiteBase Workflows...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'paused':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const activeWorkflows = workflows.filter(w => w.status === 'active').length
  const totalWorkflows = workflows.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">BiteBase Workflows</h1>
                <p className="text-purple-100">LangGraph AI Workflow Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                {activeWorkflows}/{totalWorkflows} Active
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-purple-100">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Workflow Dashboard</h2>
          <p className="text-gray-600">Manage and monitor your LangGraph AI-powered automation workflows</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                  <p className="text-2xl font-bold text-green-600">{activeWorkflows}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">94.6%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Executions</p>
                  <p className="text-2xl font-bold text-purple-600">2,847</p>
                </div>
                <Play className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-orange-600">156h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button className="h-12 bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
          <Button variant="outline" className="h-12">
            <Play className="w-4 h-4 mr-2" />
            Run All Active
          </Button>
          <Button variant="outline" className="h-12">
            <Pause className="w-4 h-4 mr-2" />
            Pause All
          </Button>
          <Button variant="outline" className="h-12">
            <Settings className="w-4 h-4 mr-2" />
            Workflow Settings
          </Button>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <workflow.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {workflow.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(workflow.status)}
                    <Badge className={`text-xs ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {workflow.description}
                </CardDescription>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium">{workflow.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Steps:</span>
                    <span className="font-medium">{workflow.steps}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Duration:</span>
                    <span className="font-medium">{workflow.avgDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Run:</span>
                    <span className="font-medium">{workflow.lastRun}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={workflow.status === 'active' ? 'outline' : 'default'}
                    className="flex-1"
                  >
                    {workflow.status === 'active' ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
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
                  <Button size="sm" variant="outline">
                    <FileText className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workflow Activity</CardTitle>
            <CardDescription>Latest workflow executions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">Financial Management workflow completed</p>
                  <p className="text-sm text-green-600">Generated monthly P&L report successfully</p>
                </div>
                <span className="text-xs text-green-500">5 min ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">SEO Optimization workflow failed</p>
                  <p className="text-sm text-red-600">API rate limit exceeded for search console</p>
                </div>
                <span className="text-xs text-red-500">15 min ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Market Research workflow completed</p>
                  <p className="text-sm text-blue-600">Analyzed 47 competitor locations in Bangkok</p>
                </div>
                <span className="text-xs text-blue-500">1 hour ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium text-purple-800">Menu Engineering workflow completed</p>
                  <p className="text-sm text-purple-600">Optimized 23 menu items for profitability</p>
                </div>
                <span className="text-xs text-purple-500">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
