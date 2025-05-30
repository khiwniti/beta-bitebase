'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WelcomeModal } from './WelcomeModal';
import { TourManager } from './TourManager';

interface OnboardingContextType {
  showWelcomeModal: () => void;
  startTour: (tourId: string) => void;
  isOnboardingCompleted: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
  userName?: string;
}

export function OnboardingProvider({ children, userName }: OnboardingProviderProps) {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true); // Default to true to avoid flashing

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    setIsOnboardingCompleted(onboardingCompleted);
    
    // Show welcome modal automatically for new users
    if (!onboardingCompleted) {
      // Delay showing the modal to avoid it appearing during page load
      const timer = setTimeout(() => {
        setIsWelcomeModalOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const showWelcomeModal = () => {
    setIsWelcomeModalOpen(true);
  };

  const hideWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  const startTour = (tourId: string) => {
    // Dispatch a custom event to start the tour
    const event = new CustomEvent('start-guided-tour', { detail: { tourId } });
    window.dispatchEvent(event);
  };

  const value = {
    showWelcomeModal,
    startTour,
    isOnboardingCompleted
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <WelcomeModal 
        userName={userName}
        isOpen={isWelcomeModalOpen} 
        onClose={hideWelcomeModal} 
      />
      <TourManager />
    </OnboardingContext.Provider>
  );
}
