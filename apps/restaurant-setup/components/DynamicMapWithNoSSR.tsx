import dynamic from 'next/dynamic';

// Dynamically import the MapWithNoSSR component with ssr disabled
const DynamicMapWithNoSSR = dynamic(
  () => import('./MapWithNoSSR'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }
);

export default DynamicMapWithNoSSR;
