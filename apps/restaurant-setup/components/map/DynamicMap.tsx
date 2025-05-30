import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Creates a dynamic import of a map component with SSR disabled
 * This prevents "window is not defined" errors when rendering maps on the server
 */
export function createDynamicMapComponent<T>(Component: ComponentType<T>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    ),
  });
}
