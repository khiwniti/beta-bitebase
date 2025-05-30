"use client"

import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { Progress } from "@bitebase/ui"
import {
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Cloud,
  Monitor,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Users,
  BarChart3
} from 'lucide-react'

export default function BackendTasksHomePage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [systemMetrics, setSystemMetrics] = useState<any>({})
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    // Simulate real-time system metrics
    const updateMetrics = () => {
      setSystemMetrics({
        cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
        memory: Math.floor(Math.random() * 30) + 50, // 50-80%
        disk: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.floor(Math.random() * 50) + 20, // 20-70%
        uptime: '15d 7h 23m',
        activeConnections: Math.floor(Math.random() * 100) + 200,
        requestsPerSecond: Math.floor(Math.random() * 50) + 150,
        responseTime: Math.floor(Math.random() * 50) + 120
      })
    }

    // Simulate background tasks
    setTasks([
      {
        id: 'data-backup',
        name: 'Database Backup',
        status: 'running',
        progress: 75,
        startTime: '2 hours ago',
        estimatedCompletion: '30 min',
        priority: 'high',
        type: 'maintenance'
      },
      {
        id: 'analytics-processing',
        name: 'Analytics Data Processing',
        status: 'completed',
        progress: 100,
        startTime: '4 hours ago',
        completedTime: '3 hours ago',
        priority: 'medium',
        type: 'analytics'
      },
      {
        id: 'cache-cleanup',
        name: 'Cache Cleanup',
        status: 'pending',
        progress: 0,
        scheduledTime: 'in 2 hours',
        priority: 'low',
        type: 'maintenance'
      },
      {
        id: 'report-generation',
        name: 'Monthly Report Generation',
        status: 'running',
        progress: 45,
        startTime: '1 hour ago',
        estimatedCompletion: '1.5 hours',
        priority: 'high',
        type: 'reporting'
      },
      {
        id: 'index-optimization',
        name: 'Database Index Optimization',
        status: 'failed',
        progress: 25,
        startTime: '6 hours ago',
        failedTime: '5 hours ago',
        priority: 'medium',
        type: 'optimization',
        error: 'Connection timeout'
      }
    ])

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Backend Tasks...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const runningTasks = tasks.filter(t => t.status === 'running').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const failedTasks = tasks.filter(t => t.status === 'failed').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Backend Tasks</h1>
                <p className="text-indigo-100">System Monitoring & Task Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                {runningTasks} Running
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-indigo-100">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Health Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{systemMetrics.cpu}%</span>
                </div>
                <Progress value={systemMetrics.cpu} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Memory</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{systemMetrics.memory}%</span>
                </div>
                <Progress value={systemMetrics.memory} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{systemMetrics.disk}%</span>
                </div>
                <Progress value={systemMetrics.disk} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Network</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">{systemMetrics.network}%</span>
                </div>
                <Progress value={systemMetrics.network} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-xl font-bold text-gray-900">{systemMetrics.uptime}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Active Connections</p>
                <p className="text-xl font-bold text-blue-900">{systemMetrics.activeConnections}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Requests/sec</p>
                <p className="text-xl font-bold text-yellow-900">{systemMetrics.requestsPerSecond}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-xl font-bold text-green-900">{systemMetrics.responseTime}ms</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Running Tasks</p>
              <p className="text-2xl font-bold text-blue-900">{runningTasks}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-900">{failedTasks}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Background Tasks</CardTitle>
                <CardDescription>Monitor and manage system background tasks</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{task.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {task.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${
                            task.priority === 'high' ? 'border-red-200 text-red-700' :
                            task.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                            'border-gray-200 text-gray-700'
                          }`}>
                            {task.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {task.status === 'running' && (
                        <p>Started: {task.startTime}</p>
                      )}
                      {task.status === 'completed' && (
                        <p>Completed: {task.completedTime}</p>
                      )}
                      {task.status === 'pending' && (
                        <p>Scheduled: {task.scheduledTime}</p>
                      )}
                      {task.status === 'failed' && (
                        <p>Failed: {task.failedTime}</p>
                      )}
                    </div>
                  </div>

                  {task.status === 'running' && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress: {task.progress}%</span>
                        <span>ETA: {task.estimatedCompletion}</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}

                  {task.status === 'failed' && task.error && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
                      Error: {task.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
