'use client';

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4 dashboard-header">
        <div className="mb-2">
          {/* BangkokSetupButton component */}
        </div>
        <div>
          <button
            onClick={() => {
              // Dispatch a custom event to start the tour
              const event = new CustomEvent('start-guided-tour', { detail: { tourId: 'dashboard' } });
              window.dispatchEvent(event);
            }}
            className="flex items-center text-sm text-primary hover:text-primary/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Take a guided tour
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 metric-cards">
        {/* Market Potential Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Potential</p>
              <h3 className="text-2xl font-bold">87/100</h3>
              <p className="text-sm text-green-600">↑ 8.2% vs last month</p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
              📊
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
          </div>
        </div>

        {/* Competitor Density Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Competitor Density</p>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-red-600">↓ 3.4% vs last quarter</p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400">
              🏪
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Average Check Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Check (Area)</p>
              <h3 className="text-2xl font-bold">$28.50</h3>
              <p className="text-sm text-green-600">↑ 5.1% vs last year</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              🧾
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>$15</span>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <span>$40</span>
          </div>
        </div>

        {/* Foot Traffic Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Foot Traffic</p>
              <h3 className="text-2xl font-bold">1,240</h3>
              <p className="text-sm text-green-600">↑ 12.7% vs last week</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
              👥
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>500</span>
            <div className="flex-1 mx-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <span>2,000</span>
          </div>
        </div>
      </div>

      {/* Quick Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 quick-actions">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Quick Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Key insights for your business</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cuisine Opportunity */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-all">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-yellow-500">
                💡
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Cuisine Opportunity</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your area has high demand for Mediterranean cuisine with limited competition.</p>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Score: 78/100</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Positioning */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-all">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-green-500">
                📈
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Price Positioning</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Area can support premium pricing with 15% higher than current average.</p>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Score: 65/100</span>
                  <span>Moderate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-all">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-red-500">
                🕒
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Peak Hours</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Highest foot traffic occurs between 6-8PM on weekends.</p>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Score: 92/100</span>
                  <span>Very High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Run Full Analysis
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 recent-activity">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your latest interactions and updates</p>
          </div>
          <button className="px-3 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            🕒 View All
          </button>
        </div>
        <div className="space-y-4">
          {/* Analysis Completed */}
          <div className="flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-1 text-green-500">
              ✓
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Analysis Completed</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">10 min ago</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market potential analysis for Downtown West location is ready</p>
            </div>
          </div>

          {/* New Competitor Alert */}
          <div className="flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-1 text-blue-500">
              🔔
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">New Competitor Alert</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">45 min ago</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">"Mediterranean Bistro" opened in your target area with 4.8★ rating</p>
            </div>
          </div>

          {/* Trend Identified */}
          <div className="flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-1 text-purple-500">
              📈
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Trend Identified</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Increased demand for plant-based options in your area (up 22% YoY)</p>
            </div>
          </div>

          {/* Menu Recommendation */}
          <div className="flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-1 text-yellow-500">
              💡
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Menu Recommendation</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI suggests adding falafel wrap based on competitor gaps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
