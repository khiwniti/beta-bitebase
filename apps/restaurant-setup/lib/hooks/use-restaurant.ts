import { create } from "zustand";
import React, { createContext, useContext, ReactNode } from 'react';

interface RestaurantData {
  market: {
    size: number;
    growthRate: number;
  };
  competitors: {
    directCompetitors: Array<{
      name: string;
      description: string;
      cuisine: string;
      priceRange: string;
    }>;
  };
  location: {
    coordinates: [number, number];
    address: string;
  };
  menu: {
    categories: string[];
    items: Array<{
      name: string;
      price: number;
      category: string;
    }>;
  };
  customerInsights: {
    averageRating: number;
    totalReviews: number;
  };
  financial: {
    revenue: number;
    profit: number;
  };
}

interface RestaurantStore {
  restaurantData: RestaurantData;
  setRestaurantData: (data: RestaurantData) => void;
}

// Default empty restaurant data structure
const defaultRestaurantData: RestaurantData = {
  market: {
    size: 0,
    growthRate: 0,
  },
  competitors: {
    directCompetitors: [],
  },
  location: {
    coordinates: [0, 0],
    address: "",
  },
  menu: {
    categories: [],
    items: [],
  },
  customerInsights: {
    averageRating: 0,
    totalReviews: 0,
  },
  financial: {
    revenue: 0,
    profit: 0,
  },
};

export const useRestaurant = create<RestaurantStore>((set, get) => ({
  restaurantData: defaultRestaurantData,
  setRestaurantData: (data) => set({ restaurantData: data }),

  // Fetch real restaurant data from API
  fetchRestaurantData: async (restaurantId?: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bitebase-backend-api-production.bitebase.workers.dev'
      const response = await fetch(`${backendUrl}/api/restaurants${restaurantId ? `/${restaurantId}` : ''}`)

      if (response.ok) {
        const data = await response.json()
        set({ restaurantData: data })
        return data
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error)
    }
    return null
  },

  // Update restaurant data via API
  updateRestaurantData: async (updates: Partial<RestaurantData>) => {
    try {
      const currentData = get().restaurantData
      const updatedData = { ...currentData, ...updates }

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bitebase-backend-api-production.bitebase.workers.dev'
      const response = await fetch(`${backendUrl}/api/restaurants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        const data = await response.json()
        set({ restaurantData: data })
        return data
      }
    } catch (error) {
      console.error('Error updating restaurant data:', error)
    }
    return null
  }
}));

// Create a context for the restaurant provider
const RestaurantContext = createContext<RestaurantStore | null>(null);

// Restaurant provider component
interface RestaurantProviderProps {
  children: ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const restaurantStore = useRestaurant();

  return (
    <RestaurantContext.Provider value={restaurantStore}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Hook to use the restaurant context
export function useRestaurantContext() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurantContext must be used within a RestaurantProvider');
  }
  return context;
}