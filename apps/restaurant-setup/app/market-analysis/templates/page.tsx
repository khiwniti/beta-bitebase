'use client';

import React from 'react';
// Using layout.tsx instead of direct import
import Link from 'next/link';

export default function MarketAnalysisTemplatesPage() {
  // Sample data for templates
  const templates = [
    {
      id: 1,
      name: 'Comprehensive Market Analysis',
      description: 'Complete analysis including demographics, competition, foot traffic, and revenue potential.',
      components: ['Demographics', 'Competition', 'Foot Traffic', 'Revenue Potential'],
      lastUsed: '2 days ago',
      popularity: 'High',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Quick Competition Scan',
      description: 'Focused analysis of nearby competitors, their offerings, and market share.',
      components: ['Competition Mapping', 'Menu Analysis', 'Price Comparison', 'SWOT Analysis'],
      lastUsed: '1 week ago',
      popularity: 'Medium',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Demographic Deep Dive',
      description: 'In-depth analysis of local demographics, income levels, and consumer preferences.',
      components: ['Population Analysis', 'Income Distribution', 'Age Groups', 'Consumer Preferences'],
      lastUsed: '3 days ago',
      popularity: 'High',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Foot Traffic Analysis',
      description: 'Analysis of pedestrian and vehicle traffic patterns, peak hours, and seasonal variations.',
      components: ['Hourly Patterns', 'Day of Week Analysis', 'Seasonal Trends', 'Traffic Sources'],
      lastUsed: '2 weeks ago',
      popularity: 'Medium',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'Revenue Potential Forecast',
      description: 'Predictive analysis of potential revenue based on location, competition, and market factors.',
      components: ['Revenue Modeling', 'Break-even Analysis', 'Growth Projections', 'Risk Assessment'],
      lastUsed: '5 days ago',
      popularity: 'High',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'New Location Assessment',
      description: 'Comprehensive evaluation of a potential new restaurant location.',
      components: ['Site Evaluation', 'Market Potential', 'Competition Analysis', 'Cost Analysis'],
      lastUsed: '1 day ago',
      popularity: 'Very High',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Templates</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Custom Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 mr-3">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span>Last used: {template.lastUsed}</span>
                    <span className="mx-2">•</span>
                    <span>Popularity: {template.popularity}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Components</h4>
                <div className="flex flex-wrap gap-2">
                  {template.components.map((component, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {component}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  Preview
                </button>
                <Link
                  href={{
                    pathname: '/market-analysis/new',
                    query: { template: template.id }
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recently Used Templates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">New Location Assessment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Downtown, Austin, TX</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Favorable</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <Link href="/market-analysis/reports">View Report</Link>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Comprehensive Market Analysis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">South Congress, Austin, TX</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Mixed</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <Link href="/market-analysis/reports">View Report</Link>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Demographic Deep Dive</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">East Austin, TX</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Favorable</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <Link href="/market-analysis/reports">View Report</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </>
  );
}
