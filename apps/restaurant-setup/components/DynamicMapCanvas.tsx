import dynamic from 'next/dynamic';

// Dynamically import the MapCanvas component with ssr disabled
const DynamicMapCanvas = dynamic(
  () => import('./MapCanvas'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default DynamicMapCanvas;
