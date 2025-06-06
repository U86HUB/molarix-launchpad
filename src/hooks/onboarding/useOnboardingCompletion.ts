
import { useEffect } from 'react';

interface UseOnboardingCompletionProps {
  initCompleted: boolean;
  createdWebsiteId: string | null;
  isCompleted: boolean;
  cancelledRef: React.MutableRefObject<boolean>;
  setIsCompleted: (completed: boolean) => void;
  setLastWebsiteData: (data: any) => void;
}

export const useOnboardingCompletion = ({
  initCompleted,
  createdWebsiteId,
  isCompleted,
  cancelledRef,
  setIsCompleted,
  setLastWebsiteData
}: UseOnboardingCompletionProps) => {
  // Clean up when initialization completes successfully
  useEffect(() => {
    if (initCompleted && createdWebsiteId && !isCompleted && !cancelledRef.current) {
      console.log('🧹 Onboarding completed successfully, cleaning up stored data');
      setIsCompleted(true);
      
      // Clear the stored website data to prevent retries
      setTimeout(() => {
        if (!cancelledRef.current) {
          setLastWebsiteData(null);
          console.log('🧹 Cleared lastWebsiteData after successful completion');
        }
      }, 5000); // Wait 5 seconds to ensure completion
    }
  }, [initCompleted, createdWebsiteId, isCompleted, cancelledRef, setIsCompleted, setLastWebsiteData]);

  // Cleanup on unmount to prevent stale state and cancel operations
  useEffect(() => {
    return () => {
      console.log('🧹 useOnboardingCompletion unmounting, cleaning up');
      cancelledRef.current = true;
    };
  }, [cancelledRef]);
};
