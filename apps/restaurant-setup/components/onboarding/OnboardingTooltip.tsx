'use client';

import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface OnboardingTooltipProps {
  children: React.ReactNode;
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  showIcon?: boolean;
}

export function OnboardingTooltip({
  children,
  title,
  content,
  placement = 'top',
  className = '',
  showIcon = true
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };

  const closeTooltip = () => {
    setIsVisible(false);
  };

  // Calculate tooltip position classes
  const getPositionClasses = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // Calculate arrow position classes
  const getArrowClasses = () => {
    switch (placement) {
      case 'top':
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-primary border-l-transparent border-r-transparent border-b-transparent';
      case 'right':
        return 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-primary border-t-transparent border-b-transparent border-l-transparent';
      case 'bottom':
        return 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-primary border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-primary border-t-transparent border-b-transparent border-r-transparent';
      default:
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-primary border-l-transparent border-r-transparent border-b-transparent';
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="relative">
        {children}
        
        {showIcon && (
          <button
            onClick={toggleTooltip}
            className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-sm hover:bg-primary/90 z-10"
            aria-label="Show help"
          >
            <HelpCircle size={14} />
          </button>
        )}
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 w-64 ${getPositionClasses()}`}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-primary">{title}</h4>
              <button
                onClick={closeTooltip}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close tooltip"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-sm text-gray-600">{content}</p>
            
            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-[6px] ${getArrowClasses()}`}></div>
          </div>
        </div>
      )}
    </div>
  );
}
