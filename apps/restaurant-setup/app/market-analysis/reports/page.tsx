'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Link from 'next/link';

export default function MarketAnalysisReportsPage() {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Sample data for reports
  const reports = [
    {
      id: 1,
      name: 'Downtown Market Analysis',
      type: 'Comprehensive',
      date: '2023-06-15',
      status: 'Completed',
      location: 'Downtown, Austin, TX',
      insights: 'High foot traffic, moderate competition',
    },
    {
      id: 2,
      name: 'Suburban Location Assessment',
      type: 'Demographic',
      date: '2023-05-22',
      status: 'Completed',
      location: 'Cedar Park, TX',
      insights: 'Family-friendly area, low competition',
    },
    {
      id: 3,
      name: 'University District Analysis',
      type: 'Competition',
      date: '2023-07-03',
      status: 'In Progress',
      location: 'University of Texas, Austin, TX',
      insights: 'Pending completion',
    },
    {
      id: 4,
      name: 'East Side Growth Potential',
      type: 'Revenue',
      date: '2023-04-18',
      status: 'Completed',
      location: 'East Austin, TX',
      insights: 'Emerging market, high growth potential',
    },
    {
      id: 5,
      name: 'South Congress Analysis',
      type: 'Foot Traffic',
      date: '2023-06-30',
      status: 'Completed',
      location: 'South Congress, Austin, TX',
      insights: 'High tourist traffic, high competition',
    }
  ];

  // Filter reports based on selected type
  const filteredReports = filterType === 'all' 
    ? reports 
    : reports.filter(report => report.type.toLowerCase() === filterType.toLowerCase());

  // Sort reports based on selected criteria
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  return (
    <DashboardLayout
      title="Saved Reports"
      description="View and manage your saved market analysis reports"
    >
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex space-x-2 mb-4 md:mb-0">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'comprehensive' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('comprehensive')}
            >
              Comprehensive
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'demographic' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('demographic')}
            >
              Demographic
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filterType === 'competition' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setFilterType('competition')}
            >
              Competition
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select 
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date (newest)</option>
              <option value="name">Name (A-Z)</option>
              <option value="type">Type</option>
            </select>
            <Link href="/market-analysis/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Insights</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.insights}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <div className="flex space-x-2">
                      <button className="hover:text-blue-800">View</button>
                      <span className="text-gray-300">|</span>
                      <button className="hover:text-blue-800">Download</button>
                      <span className="text-gray-300">|</span>
                      <button className="hover:text-blue-800">Share</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Report Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Most Analyzed Areas</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Downtown, Austin</li>
              <li>South Congress</li>
              <li>University District</li>
              <li>East Austin</li>
              <li>Cedar Park</li>
            </ol>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Highest Potential Areas</h3>
            <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
              <li>East Austin (Growth Score: 87/100)</li>
              <li>Cedar Park (Growth Score: 82/100)</li>
              <li>South Lamar (Growth Score: 78/100)</li>
              <li>Mueller District (Growth Score: 76/100)</li>
              <li>Round Rock (Growth Score: 72/100)</li>
            </ol>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Analysis Trends</h3>
            <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
              <li>Increased interest in suburban locations</li>
              <li>Growing focus on delivery radius analysis</li>
              <li>More emphasis on demographic targeting</li>
              <li>Rising importance of foot traffic patterns</li>
              <li>Greater attention to competitor proximity</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
