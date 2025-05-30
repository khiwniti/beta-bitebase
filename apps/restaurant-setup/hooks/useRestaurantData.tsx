import { useState } from 'react';
import axios from 'axios';
import { RestaurantData, MatchedRestaurantData, SearchParams } from '../types/restaurant';

export default function useRestaurantData() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [matchedRestaurants, setMatchedRestaurants] = useState<MatchedRestaurantData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to search for restaurants
  const searchRestaurants = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = '/api/restaurants';
      
      const response = await axios.get(endpoint, {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius_km,
          platforms: params.platforms?.join(',')
        }
      });
      
      // Flatten the response data from different platforms into a single array
      const allRestaurants: RestaurantData[] = [];
      Object.entries(response.data).forEach(([platform, platformRestaurants]: [string, any]) => {
        if (Array.isArray(platformRestaurants)) {
          platformRestaurants.forEach((restaurant: any) => {
            allRestaurants.push({
              ...restaurant,
              source: platform
            });
          });
        }
      });
      
      setRestaurants(allRestaurants);
      return allRestaurants;
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to fetch restaurant data. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to match restaurants across platforms
  const matchRestaurants = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = '/api/restaurants/match';
      
      const response = await axios.get(endpoint, {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius_km,
          platforms: params.platforms?.join(',')
        }
      });
      
      setMatchedRestaurants(response.data);
      return response.data;
    } catch (err) {
      console.error('Error matching restaurants:', err);
      setError('Failed to match restaurant data. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to geocode an address to coordinates
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/geocode', {
        params: { address }
      });
      
      if (response.data && response.data.latitude && response.data.longitude) {
        return [response.data.latitude, response.data.longitude];
      }
      
      return null;
    } catch (err) {
      console.error('Error geocoding address:', err);
      setError('Failed to geocode address. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurants,
    matchedRestaurants,
    loading,
    error,
    searchRestaurants,
    matchRestaurants,
    geocodeAddress
  };
}
