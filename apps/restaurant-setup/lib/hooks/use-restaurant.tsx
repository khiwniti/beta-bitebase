import { createContext, useContext, useState, ReactNode } from "react";

interface RestaurantData {
  marketData: {
    industryTrends: any[];
    marketSize: number;
    growthRate: number;
    targetDemographics: any[];
  };
  competitors: {
    directCompetitors: any[];
    indirectCompetitors: any[];
    marketShare: Record<string, number>;
  };
  location: {
    address: string;
    coordinates: [number, number];
    footTraffic: number;
    demographics: any;
  };
  menu: {
    items: any[];
    pricing: Record<string, number>;
    categories: string[];
  };
  customerInsights: {
    reviews: any[];
    sentiment: Record<string, number>;
    preferences: any[];
  };
  financial: {
    revenue: number;
    costs: Record<string, number>;
    profit: number;
    projections: any[];
  };
}

interface RestaurantContextType {
  restaurantData: RestaurantData;
  updateRestaurantData: (data: Partial<RestaurantData>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultRestaurantData: RestaurantData = {
  marketData: {
    industryTrends: [],
    marketSize: 0,
    growthRate: 0,
    targetDemographics: [],
  },
  competitors: {
    directCompetitors: [],
    indirectCompetitors: [],
    marketShare: {},
  },
  location: {
    address: "",
    coordinates: [0, 0],
    footTraffic: 0,
    demographics: {},
  },
  menu: {
    items: [],
    pricing: {},
    categories: [],
  },
  customerInsights: {
    reviews: [],
    sentiment: {},
    preferences: [],
  },
  financial: {
    revenue: 0,
    costs: {},
    profit: 0,
    projections: [],
  },
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurantData, setRestaurantData] = useState<RestaurantData>(defaultRestaurantData);
  const [isLoading, setIsLoading] = useState(false);

  const updateRestaurantData = (data: Partial<RestaurantData>) => {
    setRestaurantData((prev) => ({ ...prev, ...data }));
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurantData,
        updateRestaurantData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
} 