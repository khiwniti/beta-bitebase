import React from 'react';

interface BufferRadiusControlProps {
  bufferRadius: number;
  setBufferRadius: (radius: number) => void;
  minRadius?: number;
  maxRadius?: number;
  step?: number;
}

const BufferRadiusControl: React.FC<BufferRadiusControlProps> = ({
  bufferRadius,
  setBufferRadius,
  minRadius = 0.1,
  maxRadius = 5,
  step = 0.1
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium">Buffer Radius</label>
        <span className="text-sm font-bold">{bufferRadius.toFixed(1)} km</span>
      </div>
      <input
        type="range"
        min={minRadius}
        max={maxRadius}
        step={step}
        value={bufferRadius}
        onChange={(e) => setBufferRadius(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{minRadius} km</span>
        <span>{maxRadius} km</span>
      </div>
    </div>
  );
};

export default BufferRadiusControl;
