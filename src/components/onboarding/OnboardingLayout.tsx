
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  const { t } = useLanguage();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Onboarding' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BreadcrumbNav items={breadcrumbItems} />
        
        {children}

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('onboardingStepTitle') || 'Clinic Onboarding'}</CardTitle>
            <CardDescription>
              {t('onboardingStepDescription') || 'Complete all steps to set up your clinic portal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingLayout;
