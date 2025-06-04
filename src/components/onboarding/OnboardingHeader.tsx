
import { useLanguage } from "@/contexts/LanguageContext";

const OnboardingHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {t('onboardingTitle') || 'Welcome to Molarix'}
      </h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        {t('onboardingSubtitle') || 'Complete the setup to get started with your dental clinic portal'}
      </p>
    </div>
  );
};

export default OnboardingHeader;
