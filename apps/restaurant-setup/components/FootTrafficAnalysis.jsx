import React from 'react';

const FootTrafficAnalysis = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Foot Traffic Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-medium text-blue-800">Daily Average</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">+12% YoY</span>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-2">1,842</p>
          <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for daily traffic chart */}
            <p className="text-gray-500">Daily Traffic Chart</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Peak hours: 12pm-2pm, 6pm-8pm</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-medium text-green-800">Weekly Pattern</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Consistent</span>
          </div>
          <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for weekly pattern chart */}
            <p className="text-gray-500">Weekly Pattern Chart</p>
          </div>
          <div className="grid grid-cols-7 gap-1 mt-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">Mon</p>
              <div className="h-10 bg-green-200 rounded-t-lg mt-1" style={{ height: '40%' }}></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Tue</p>
              <div className="h-10 bg-green-300 rounded-t-lg mt-1" style={{ height: '50%' }}></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Wed</p>
              <div className="h-10 bg-green-300 rounded-t-lg mt-1" style={{ height: '55%' }}></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Thu</p>
              <div className="h-10 bg-green-400 rounded-t-lg mt-1" style={{ height: '65%' }}></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Fri</p>
              <div className="h-10 bg-green-500 rounded-t-lg mt-1" style={{ height: '85%' }}></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Sat</p>
              <div className="h-10 bg-green-600 rounded-t-lg mt-1" style={{ height: '100%' }}></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Sun</p>
              <div className="h-10 bg-green-400 rounded-t-lg mt-1" style={{ height: '70%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-medium text-purple-800">Seasonal Trends</h3>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Q4 Peak</span>
          </div>
          <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for seasonal trends chart */}
            <p className="text-gray-500">Seasonal Trends Chart</p>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Summer (Jun-Aug):</span>
              <span className="text-xs font-medium">+8% above average</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Fall (Sep-Nov):</span>
              <span className="text-xs font-medium">+15% above average</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Winter (Dec-Feb):</span>
              <span className="text-xs font-medium">-5% below average</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Spring (Mar-May):</span>
              <span className="text-xs font-medium">+2% above average</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Nearby Attractions & Traffic Drivers</h3>
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center mb-4">
            {/* Placeholder for map */}
            <p className="text-gray-500">Map of Nearby Attractions</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                <span className="text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Central Shopping Mall</h4>
                <p className="text-xs text-gray-500">0.2 miles • ~12,000 daily visitors</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">High Impact</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                <span className="text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Tech Business Park</h4>
                <p className="text-xs text-gray-500">0.5 miles • ~8,500 employees</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">High Impact</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                <span className="text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">City Park</h4>
                <p className="text-xs text-gray-500">0.3 miles • ~5,000 weekend visitors</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Medium Impact</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Conversion Analysis</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Foot Traffic to Customer Conversion</p>
              <div className="flex items-end mt-2">
                <span className="text-2xl font-bold text-gray-800">24.8%</span>
                <span className="ml-2 text-xs text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +3.2%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '24.8%' }}></div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Average Dwell Time</p>
              <div className="flex items-end mt-2">
                <span className="text-2xl font-bold text-gray-800">42</span>
                <span className="ml-1 text-lg font-medium text-gray-600">min</span>
                <span className="ml-2 text-xs text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  +5 min
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Traffic Source Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[80px]">45% Walk-in</span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[80px]">28% Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[80px]">18% Referral</span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '9%' }}></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[80px]">9% Other</span>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg mt-4">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Recommendation:</span> Increase signage visibility to capture more of the mall traffic, which shows high conversion potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FootTrafficAnalysis;
