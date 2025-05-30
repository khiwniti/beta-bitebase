'use client';

import React, { useState, useEffect } from 'react';
import { GuidedTour, TourStep } from './GuidedTour';

// Define tour data
interface TourData {
  [key: string]: {
    steps: TourStep[];
    title: string;
    description?: string;
  };
}

// Define available tours
const tours: TourData = {
  'dashboard': {
    title: 'Dashboard Tour',
    description: 'Learn how to use the main dashboard features',
    steps: [
      {
        target: '.dashboard-header',
        title: 'Dashboard Overview',
        content: 'This is your main dashboard where you can see key metrics and insights about your restaurant.',
        placement: 'bottom'
      },
      {
        target: '.metric-cards',
        title: 'Key Metrics',
        content: 'These cards show your most important business metrics at a glance.',
        placement: 'bottom'
      },
      {
        target: '.quick-actions',
        title: 'Quick Actions',
        content: 'Access common tasks and actions from here to save time.',
        placement: 'right'
      },
      {
        target: '.recent-activity',
        title: 'Recent Activity',
        content: 'Stay updated with the latest changes and updates to your restaurant data.',
        placement: 'left'
      }
    ]
  },
  'product-management': {
    title: 'Product Management Tour',
    description: 'Learn how to manage your menu items and categories',
    steps: [
      {
        target: '.product-stats',
        title: 'Product Statistics',
        content: 'View key statistics about your menu items and product performance.',
        placement: 'bottom'
      },
      {
        target: '.product-actions',
        title: 'Product Actions',
        content: 'Quickly add new products, manage categories, or analyze performance.',
        placement: 'bottom'
      },
      {
        target: '.product-categories',
        title: 'Product Categories',
        content: 'Organize your menu items into categories for better management.',
        placement: 'top'
      },
      {
        target: '.top-products',
        title: 'Top Products',
        content: 'See your best-performing menu items based on sales and ratings.',
        placement: 'top'
      }
    ]
  },
  'price-strategy': {
    title: 'Price Strategy Tour',
    description: 'Learn how to optimize your menu pricing',
    steps: [
      {
        target: '.price-metrics',
        title: 'Price Metrics',
        content: 'View key metrics related to your pricing strategy and performance.',
        placement: 'bottom'
      },
      {
        target: '.price-actions',
        title: 'Price Actions',
        content: 'Access tools for price optimization, competitor analysis, and more.',
        placement: 'bottom'
      },
      {
        target: '.price-recommendations',
        title: 'Price Recommendations',
        content: 'Get AI-powered recommendations to optimize your menu pricing.',
        placement: 'left'
      },
      {
        target: '.competitor-prices',
        title: 'Competitor Prices',
        content: 'Compare your prices with competitors to ensure you stay competitive.',
        placement: 'top'
      }
    ]
  },
  'onboarding': {
    title: 'Welcome to BiteBase',
    description: 'Get started with BiteBase Intelligence',
    steps: [
      {
        target: '.onboarding-header',
        title: 'Welcome to BiteBase',
        content: 'This onboarding process will help you set up your restaurant profile and get started with market research.',
        placement: 'bottom'
      },
      {
        target: '.onboarding-steps',
        title: 'Setup Steps',
        content: 'Follow these steps to complete your restaurant setup and start using BiteBase Intelligence.',
        placement: 'bottom'
      },
      {
        target: '.onboarding-content',
        title: 'Setup Information',
        content: 'Provide information about your restaurant to get personalized insights and recommendations.',
        placement: 'right'
      },
      {
        target: '.onboarding-tips',
        title: 'Helpful Tips',
        content: 'These tips provide valuable insights about the Bangkok restaurant market to help you succeed.',
        placement: 'top'
      }
    ]
  }
};

export function TourManager() {
  const [activeTour, setActiveTour] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Listen for custom events to start tours
    const handleStartTour = (event: Event) => {
      const customEvent = event as CustomEvent;
      const tourId = customEvent.detail?.tourId;
      
      if (tourId && tours[tourId]) {
        setActiveTour(tourId);
        setShowTour(true);
      }
    };

    window.addEventListener('start-guided-tour', handleStartTour);
    
    return () => {
      window.removeEventListener('start-guided-tour', handleStartTour);
    };
  }, []);

  const handleCloseTour = () => {
    setShowTour(false);
  };

  const handleCompleteTour = () => {
    setShowTour(false);
    
    // Save tour completion to localStorage
    if (activeTour) {
      const completedTours = JSON.parse(localStorage.getItem('completedTours') || '{}');
      completedTours[activeTour] = new Date().toISOString();
      localStorage.setItem('completedTours', JSON.stringify(completedTours));
    }
  };

  if (!activeTour || !showTour) return null;

  return (
    <GuidedTour
      steps={tours[activeTour].steps}
      isOpen={showTour}
      onClose={handleCloseTour}
      onComplete={handleCompleteTour}
    />
  );
}

// Helper function to check if a tour has been completed
export function hasTourBeenCompleted(tourId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const completedTours = JSON.parse(localStorage.getItem('completedTours') || '{}');
  return !!completedTours[tourId];
}
