import React from 'react';

const DemographicAnalysis = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Demographic Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Population Distribution</h3>
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for population distribution chart */}
            <p className="text-gray-500">Population Distribution Chart</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Population:</span>
              <span className="font-medium">127,842</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Median Age:</span>
              <span className="font-medium">34.7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Households:</span>
              <span className="font-medium">48,291</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Age Distribution</h3>
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for age distribution chart */}
            <p className="text-gray-500">Age Distribution Chart</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-xs text-gray-500">18-24</p>
              <p className="font-medium">21%</p>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="text-xs text-gray-500">25-34</p>
              <p className="font-medium">28%</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded">
              <p className="text-xs text-gray-500">35-44</p>
              <p className="font-medium">19%</p>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <p className="text-xs text-gray-500">45+</p>
              <p className="font-medium">32%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Income Levels</h3>
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for income levels chart */}
            <p className="text-gray-500">Income Levels Chart</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Median Household Income:</span>
              <span className="font-medium">$68,703</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Per Capita Income:</span>
              <span className="font-medium">$36,214</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Disposable Income:</span>
              <span className="font-medium text-green-600">+12% above national average</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Education & Occupation</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Education</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">42% Bachelor's</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">18% Master's+</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">28% Some College</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Top Industries</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Technology (24%)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>Healthcare (18%)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span>Education (14%)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  <span>Finance (12%)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Insight:</span> High concentration of tech professionals with above-average disposable income suggests opportunity for premium dining concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicAnalysis;
