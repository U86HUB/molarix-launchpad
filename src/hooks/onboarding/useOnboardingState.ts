
import { useState, useRef } from 'react';
import { WebsiteInitializationData } from '@/types/onboarding';

export const useOnboardingState = () => {
  const [lastWebsiteData, setLastWebsiteData] = useState<WebsiteInitializationData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const completionRef = useRef<string | null>(null); // Track completion by execution ID
  const cancelledRef = useRef<boolean>(false); // Track if component is cancelled/unmounted

  return {
    lastWebsiteData,
    setLastWebsiteData,
    isCompleted,
    setIsCompleted,
    completionRef,
    cancelledRef
  };
};
