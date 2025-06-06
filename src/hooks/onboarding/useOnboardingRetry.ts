
import { WebsiteInitializationData } from '@/types/onboarding';

interface UseOnboardingRetryProps {
  lastWebsiteData: WebsiteInitializationData | null;
  isCompleted: boolean;
  isSubmitting: boolean;
  cancelledRef: React.MutableRefObject<boolean>;
  initializeWebsite: (data: WebsiteInitializationData) => Promise<void>;
}

export const useOnboardingRetry = ({
  lastWebsiteData,
  isCompleted,
  isSubmitting,
  cancelledRef,
  initializeWebsite
}: UseOnboardingRetryProps) => {
  const retryInitialization = (): void => {
    // Check if component is cancelled
    if (cancelledRef.current) {
      console.warn("⚠️ Cannot retry: Component is cancelled.");
      return;
    }

    // Only allow retry if explicitly requested and we have stored data
    if (!lastWebsiteData) {
      console.warn("⚠️ Cannot retry: No previous website data available.");
      return;
    }

    // Prevent retry if already completed
    if (isCompleted) {
      console.warn("⚠️ Cannot retry: Onboarding already completed successfully.");
      return;
    }

    // Prevent retry if currently processing
    if (isSubmitting) {
      console.warn("⚠️ Cannot retry: Submission already in progress.");
      return;
    }

    console.log('🔄 Explicit retry requested for website initialization:', lastWebsiteData.websiteId);
    initializeWebsite(lastWebsiteData);
  };

  return { retryInitialization };
};
