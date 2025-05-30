'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function GuidedTour({ steps, isOpen, onClose, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && steps.length > 0) {
      updatePosition();
      setIsVisible(true);
      
      // Add resize listener
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, currentStep, steps]);

  const updatePosition = () => {
    const step = steps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    });

    // Scroll element into view if needed
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const getTooltipPosition = () => {
    const step = steps[currentStep];
    if (!step) return {};
    
    const placement = step.placement || 'bottom';
    const margin = 12; // Space between target and tooltip
    
    switch (placement) {
      case 'top':
        return {
          top: position.top - margin,
          left: position.left + position.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'right':
        return {
          top: position.top + position.height / 2,
          left: position.left + position.width + margin,
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return {
          top: position.top + position.height + margin,
          left: position.left + position.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: position.top + position.height / 2,
          left: position.left - margin,
          transform: 'translate(-100%, -50%)'
        };
      default:
        return {
          top: position.top + position.height + margin,
          left: position.left + position.width / 2,
          transform: 'translateX(-50%)'
        };
    }
  };

  if (!isVisible || steps.length === 0) return null;

  const tooltipPosition = getTooltipPosition();
  const currentTourStep = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]" onClick={onClose} />
      
      {/* Highlight target element */}
      <div 
        className="absolute z-[1000] pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: '4px'
        }}
      />
      
      {/* Tooltip */}
      <div 
        className="fixed z-[1001] bg-white rounded-lg shadow-xl p-4 w-80"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: tooltipPosition.transform
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-primary">{currentTourStep.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close tour"
          >
            <X size={18} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{currentTourStep.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                Prev
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </>
              ) : (
                'Finish'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper component to trigger a tour
export function TourTrigger({ 
  tourId, 
  children 
}: { 
  tourId: string;
  children?: React.ReactNode;
}) {
  const startTour = () => {
    // Dispatch a custom event that the tour manager can listen for
    const event = new CustomEvent('start-guided-tour', { detail: { tourId } });
    window.dispatchEvent(event);
  };

  return (
    <button 
      onClick={startTour}
      className="inline-flex items-center text-primary hover:text-primary/80"
      aria-label="Start guided tour"
    >
      {children || (
        <>
          <HelpCircle size={16} className="mr-1" />
          <span>Take a tour</span>
        </>
      )}
    </button>
  );
}
