'use client';

import React from 'react';
// Using layout.tsx instead of direct import
import MenuOptimization from '../components/MenuOptimization';

// Sample data for menu optimization
const menuData = {
  menuPerformance: {
    totalItems: 48,
    topPerformers: 18,
    underperforming: 12
  },
  profitability: {
    averageMargin: 32,
    highestMarginItem: 'Specialty Cocktails',
    highestMarginPercentage: 68,
    lowestMarginItem: 'Premium Steaks',
    lowestMarginPercentage: 18,
    monthOverMonthChange: 8
  },
  customerPreferences: [
    { name: 'Plant-Based Options', growth: 42, popularity: 85 },
    { name: 'Gluten-Free Options', growth: 28, popularity: 72 },
    { name: 'Locally Sourced', growth: 35, popularity: 78 },
    { name: 'Craft Cocktails', growth: 52, popularity: 92 }
  ],
  topPerformers: [
    { name: 'Signature Burger', category: 'Main', price: 16.99, cost: 5.25, margin: 69, sales: 842, trend: 'up' },
    { name: 'Craft Cocktail Flight', category: 'Beverage', price: 18.50, cost: 4.20, margin: 77, sales: 756, trend: 'up' },
    { name: 'Truffle Fries', category: 'Side', price: 8.99, cost: 2.10, margin: 76, sales: 912, trend: 'up' }
  ],
  bottomPerformers: [
    { name: 'Seafood Platter', category: 'Main', price: 32.99, cost: 22.45, margin: 32, sales: 124, trend: 'down' },
    { name: 'Vegan Lasagna', category: 'Main', price: 18.50, cost: 8.75, margin: 53, sales: 98, trend: 'flat' }
  ],
  menuMatrix: {
    stars: ['Signature Burger', 'Craft Cocktails', 'Truffle Fries'],
    puzzles: ['Premium Steak', 'Lobster Bisque'],
    plowHorses: ['House Salad', 'Chicken Wings'],
    dogs: ['Seafood Platter', 'Vegan Lasagna']
  }
};

export default function MarketAnalysisPage() {
  return (
      <MenuOptimization data={menuData} />
  );
}
