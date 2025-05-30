import dynamic from 'next/dynamic';

// Dynamically import the RestaurantMap component with ssr disabled
const DynamicRestaurantMap = dynamic(
  () => import('./RestaurantMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
          <p className="text-gray-600">Loading restaurant map...</p>
        </div>
      </div>
    )
  }
);

export default DynamicRestaurantMap;
