'use client';

import React from 'react';
import Link from 'next/link';

export default function SimpleDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="font-bold text-xl">BiteBase<span className="text-green-600">AI</span></span>
            </Link>
          </div>

          {/* Sidebar Content */}
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 mb-2">Main</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 p-2 rounded-md bg-gray-100 font-medium"
                  >
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* 4P Framework */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 mb-2">4P Framework</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/product"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Product (Menu)</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/price"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Price (Strategy)</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/place"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Place (Location)</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/promotion"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Promotion (Marketing)</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Settings */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 mb-2">Settings</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/integrations"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Integrations</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-gray-200 flex items-center px-4">
            <button className="md:hidden mr-2">
              <span>Menu</span>
            </button>
            <div className="flex-1"></div>
            <button className="h-8 px-3 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 mr-2">
              Upgrade Plan
            </button>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="flex flex-col space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-3xl font-bold">Restaurant Intelligence Dashboard</h1>
                  <p className="text-gray-500 mt-1">Welcome back to your restaurant intelligence platform</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 border border-gray-300 rounded-md">
                    New Report
                  </button>
                  <Link href="/market-analysis/new" className="px-4 py-2 bg-green-600 text-white rounded-md">
                    New Analysis
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Market Potential Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Market Potential</p>
                      <h3 className="text-2xl font-bold">87/100</h3>
                      <p className="text-sm text-green-600">↑ 8.2% vs last month</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      📊
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>

                {/* Competitor Density Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Competitor Density</p>
                      <h3 className="text-2xl font-bold">12</h3>
                      <p className="text-sm text-red-600">↓ 3.4% vs last quarter</p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      🏪
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Average Check Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Avg. Check (Area)</p>
                      <h3 className="text-2xl font-bold">$28.50</h3>
                      <p className="text-sm text-green-600">↑ 5.1% vs last year</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      🧾
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>$15</span>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <span>$40</span>
                  </div>
                </div>

                {/* Foot Traffic Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Daily Foot Traffic</p>
                      <h3 className="text-2xl font-bold">1,240</h3>
                      <p className="text-sm text-green-600">↑ 12.7% vs last week</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      👥
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>500</span>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <span>2,000</span>
                  </div>
                </div>
              </div>

              {/* Quick Analysis */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Quick Analysis</h3>
                  <p className="text-sm text-gray-500">Key insights for your business</p>
                </div>
                <div className="space-y-4">
                  {/* Cuisine Opportunity */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-all">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-yellow-500">
                        💡
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Cuisine Opportunity</h4>
                        <p className="text-sm text-gray-500 mb-3">Your area has high demand for Mediterranean cuisine with limited competition.</p>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Score: 78/100</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Positioning */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-all">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-green-500">
                        📈
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Price Positioning</h4>
                        <p className="text-sm text-gray-500 mb-3">Area can support premium pricing with 15% higher than current average.</p>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Score: 65/100</span>
                          <span>Moderate</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Peak Hours */}
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-all">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-red-500">
                        🕒
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Peak Hours</h4>
                        <p className="text-sm text-gray-500 mb-3">Highest foot traffic occurs between 6-8PM on weekends.</p>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Score: 92/100</span>
                          <span>Very High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
                    Run Full Analysis
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <p className="text-sm text-gray-500">Your latest interactions and updates</p>
                  </div>
                  <button className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-md">
                    🕒 View All
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Analysis Completed */}
                  <div className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-1 text-green-500">
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Analysis Completed</h4>
                        <span className="text-xs text-gray-500">10 min ago</span>
                      </div>
                      <p className="text-sm text-gray-500">Market potential analysis for Downtown West location is ready</p>
                    </div>
                  </div>

                  {/* New Competitor Alert */}
                  <div className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-1 text-blue-500">
                      🔔
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">New Competitor Alert</h4>
                        <span className="text-xs text-gray-500">45 min ago</span>
                      </div>
                      <p className="text-sm text-gray-500">"Mediterranean Bistro" opened in your target area with 4.8★ rating</p>
                    </div>
                  </div>

                  {/* Trend Identified */}
                  <div className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-1 text-purple-500">
                      📈
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Trend Identified</h4>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-500">Increased demand for plant-based options in your area (up 22% YoY)</p>
                    </div>
                  </div>

                  {/* Menu Recommendation */}
                  <div className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-all">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-1 text-yellow-500">
                      💡
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Menu Recommendation</h4>
                        <span className="text-xs text-gray-500">4 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-500">AI suggests adding falafel wrap based on competitor gaps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
