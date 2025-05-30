import React from 'react';

const MenuOptimization = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-medium text-blue-800">Menu Performance</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Last 30 Days</span>
          </div>
          <div className="flex items-center justify-center my-3">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e0e0e0" strokeWidth="2"></circle>
                <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="100" strokeDashoffset="25" strokeLinecap="round"></circle>
                <text x="18" y="18" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold" fill="#3b82f6">75%</text>
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Items:</span>
              <span className="font-medium">48</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Top Performers:</span>
              <span className="font-medium text-green-600">18 (38%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Underperforming:</span>
              <span className="font-medium text-red-600">12 (25%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-medium text-green-800">Profitability Analysis</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+8% MoM</span>
          </div>
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
            {/* Placeholder for profitability chart */}
            <p className="text-gray-500">Profitability Chart</p>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Profit Margin:</span>
              <span className="font-medium">32%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Highest Margin Item:</span>
              <span className="font-medium">Specialty Cocktails (68%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lowest Margin Item:</span>
              <span className="font-medium">Premium Steaks (18%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-medium text-purple-800">Customer Preferences</h3>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Trending</span>
          </div>
          <div className="space-y-3 mt-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Plant-Based Options</span>
                <span className="text-xs text-green-600">+42% YoY</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Gluten-Free Options</span>
                <span className="text-xs text-green-600">+28% YoY</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Locally Sourced</span>
                <span className="text-xs text-green-600">+35% YoY</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Craft Cocktails</span>
                <span className="text-xs text-green-600">+52% YoY</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
          <div className="bg-purple-100 p-2 rounded mt-3">
            <p className="text-xs text-purple-800">
              <span className="font-medium">Insight:</span> Strong growth in plant-based and craft cocktail preferences among 25-34 age demographic.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Top & Bottom Performers</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">By Revenue</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">By Profit</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">By Volume</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Top Performers */}
              <tr className="bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Signature Burger</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$16.99</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$5.25</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">69%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">842</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <svg className="w-16 h-8" viewBox="0 0 100 30">
                    <path d="M0,20 L10,18 L20,15 L30,16 L40,14 L50,10 L60,12 L70,8 L80,5 L90,7 L100,5" fill="none" stroke="#10b981" strokeWidth="2" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Promote</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Craft Cocktail Flight</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Beverage</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$18.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$4.20</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">77%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">756</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <svg className="w-16 h-8" viewBox="0 0 100 30">
                    <path d="M0,25 L10,22 L20,20 L30,15 L40,12 L50,10 L60,8 L70,5 L80,3 L90,4 L100,2" fill="none" stroke="#10b981" strokeWidth="2" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Promote</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Truffle Fries</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Side</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$8.99</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2.10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">76%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">912</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <svg className="w-16 h-8" viewBox="0 0 100 30">
                    <path d="M0,15 L10,14 L20,16 L30,15 L40,12 L50,10 L60,8 L70,10 L80,7 L90,5 L100,4" fill="none" stroke="#10b981" strokeWidth="2" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Promote</td>
              </tr>
              
              {/* Bottom Performers */}
              <tr className="bg-red-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Seafood Platter</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$32.99</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$22.45</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">32%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">124</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <svg className="w-16 h-8" viewBox="0 0 100 30">
                    <path d="M0,5 L10,8 L20,10 L30,12 L40,15 L50,18 L60,20 L70,22 L80,20 L90,22 L100,25" fill="none" stroke="#ef4444" strokeWidth="2" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">Revise/Remove</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Vegan Lasagna</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$18.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$8.75</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">53%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">98</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <svg className="w-16 h-8" viewBox="0 0 100 30">
                    <path d="M0,15 L10,16 L20,18 L30,17 L40,19 L50,20 L60,18 L70,20 L80,22 L90,20 L100,22" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Reposition</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Menu Engineering Matrix</h3>
          <div className="h-64 bg-white rounded-lg border border-gray-200 p-4 relative">
            {/* Placeholder for menu engineering matrix */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
              <div className="bg-green-50 p-3 flex flex-col justify-between">
                <span className="text-sm font-medium text-green-800">Stars</span>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-block px-2 py-1 bg-green-100 text-xs rounded">Signature Burger</span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-xs rounded">Craft Cocktails</span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-xs rounded">Truffle Fries</span>
                </div>
                <span className="text-xs text-gray-500">High Profit, High Popularity</span>
              </div>
              <div className="bg-yellow-50 p-3 flex flex-col justify-between">
                <span className="text-sm font-medium text-yellow-800">Puzzles</span>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-xs rounded">Premium Steak</span>
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-xs rounded">Lobster Bisque</span>
                </div>
                <span className="text-xs text-gray-500">High Profit, Low Popularity</span>
              </div>
              <div className="bg-blue-50 p-3 flex flex-col justify-between">
                <span className="text-sm font-medium text-blue-800">Plow Horses</span>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-xs rounded">House Salad</span>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-xs rounded">Chicken Wings</span>
                </div>
                <span className="text-xs text-gray-500">Low Profit, High Popularity</span>
              </div>
              <div className="bg-red-50 p-3 flex flex-col justify-between">
                <span className="text-sm font-medium text-red-800">Dogs</span>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-block px-2 py-1 bg-red-100 text-xs rounded">Seafood Platter</span>
                  <span className="inline-block px-2 py-1 bg-red-100 text-xs rounded">Vegan Lasagna</span>
                </div>
                <span className="text-xs text-gray-500">Low Profit, Low Popularity</span>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Strategy:</span> Promote "Stars", increase visibility of "Puzzles", optimize costs for "Plow Horses", and revise or remove "Dogs".
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium text-gray-700 mb-3">Recommendations</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Menu Item Optimization</h4>
                  <p className="text-xs text-gray-600 mt-1">Remove or revise the bottom 3 performing items (Seafood Platter, Vegan Lasagna, Seasonal Soup) to improve overall menu profitability by an estimated 8%.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Menu Layout Redesign</h4>
                  <p className="text-xs text-gray-600 mt-1">Reposition high-margin items to prime menu real estate (top right corner, boxed items) to increase selection frequency by up to 25%.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Pricing Strategy</h4>
                  <p className="text-xs text-gray-600 mt-1">Implement strategic price anchoring by placing a premium item ($38+) next to your signature burger to increase perceived value and selection rate.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">New Menu Additions</h4>
                  <p className="text-xs text-gray-600 mt-1">Add 3-4 new plant-based options to capitalize on the 42% YoY growth in this category, with focus on high-margin ingredients like mushrooms and legumes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOptimization;
