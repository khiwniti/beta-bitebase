import React from 'react';
import { RestaurantData } from '../types/restaurant';

interface RestaurantCardProps {
  restaurant: RestaurantData;
  onViewOnMap?: () => void;
  onViewDetails?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onViewOnMap,
  onViewDetails
}) => {
  // Format price level as $ symbols
  const priceLevel = restaurant.price_level ? '$'.repeat(restaurant.price_level) : 'N/A';
  
  // Get platform icon and color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'foodpanda':
        return 'bg-pink-100 text-pink-800';
      case 'wongnai':
        return 'bg-blue-100 text-blue-800';
      case 'robinhood':
        return 'bg-green-100 text-green-800';
      case 'google_maps':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getPlatformColor(restaurant.source)}`}>
            {restaurant.source.replace('_', ' ')}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-4">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-700">
              {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({restaurant.reviews_count || 0})
            </span>
          </div>
          
          <div className="text-sm text-gray-700">
            <span className="font-medium">Price:</span> <span className="text-green-600">{priceLevel}</span>
          </div>
        </div>
        
        {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.cuisine_types.map((cuisine, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
              >
                {cuisine}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-3">
          <button
            onClick={onViewOnMap}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            View on Map
          </button>
          
          <a
            href={restaurant.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
