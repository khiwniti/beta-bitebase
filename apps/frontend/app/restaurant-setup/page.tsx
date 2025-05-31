"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api-client'

interface Restaurant {
  id: number | string
  name: string
  cuisine: string
  latitude: number
  longitude: number
  address: string
  rating: number
  price_range: string
  platform: string
  phone?: string
  website?: string
  hours?: string
  features?: string[]
  images?: string[]
}

export default function RestaurantSetupPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAllRestaurants()
      if (response.error) {
        setError(response.error)
        setRestaurants([])
      } else {
        // The backend returns { restaurants: [...], total: number }
        const restaurantData = response.data?.restaurants || response.data || []
        setRestaurants(restaurantData)
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch restaurants')
      console.error('Error fetching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchRestaurants = async () => {
    if (!searchQuery.trim()) {
      fetchRestaurants()
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.get(`/restaurants/search?query=${encodeURIComponent(searchQuery)}`)
      setRestaurants(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to search restaurants')
      console.error('Error searching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchRestaurants()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Setup</h1>
        <p className="text-gray-600">Connect with real restaurant data and market intelligence</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Search Restaurants</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search restaurants by name, cuisine, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={searchRestaurants}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={fetchRestaurants}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Show All
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Restaurant Data</h2>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `Found ${restaurants.length} restaurants`}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading restaurants...</span>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No restaurants found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Cuisine:</span> {restaurant.cuisine}</p>
                    <p><span className="font-medium">Address:</span> {restaurant.address}</p>
                    <p><span className="font-medium">Rating:</span> ⭐ {restaurant.rating}/5</p>
                    <p><span className="font-medium">Price Range:</span> {restaurant.price_range}</p>
                    <p><span className="font-medium">Platform:</span> {restaurant.platform}</p>
                    {restaurant.phone && (
                      <p><span className="font-medium">Phone:</span> {restaurant.phone}</p>
                    )}
                    {restaurant.hours && (
                      <p><span className="font-medium">Hours:</span> {restaurant.hours}</p>
                    )}
                    {restaurant.features && restaurant.features.length > 0 && (
                      <p><span className="font-medium">Features:</span> {restaurant.features.join(', ')}</p>
                    )}
                    {restaurant.website && (
                      <p><span className="font-medium">Website:</span> 
                        <a href={restaurant.website} target="_blank" rel="noopener noreferrer" 
                           className="text-green-600 hover:text-green-800 ml-1">
                          Visit
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}