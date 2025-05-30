import React from 'react';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  availablePlatforms?: string[];
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  setSelectedPlatforms,
  availablePlatforms = ['foodpanda', 'wongnai', 'robinhood', 'google_maps']
}) => {
  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSelectAll = () => {
    setSelectedPlatforms([...availablePlatforms]);
  };

  const handleSelectNone = () => {
    setSelectedPlatforms([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium">Data Sources</label>
        <div className="flex gap-2">
          <button 
            onClick={handleSelectAll}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Select All
          </button>
          <button 
            onClick={handleSelectNone}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {availablePlatforms.map((platform) => (
          <label key={platform} className="flex items-center gap-1 bg-white border rounded px-2 py-1 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes(platform)}
              onChange={() => handlePlatformToggle(platform)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="capitalize text-sm">
              {platform.replace('_', ' ')}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
