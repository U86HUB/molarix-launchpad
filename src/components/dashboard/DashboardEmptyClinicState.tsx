
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowRight, X } from 'lucide-react';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';

interface DashboardEmptyClinicStateProps {
  onCreateClinic?: () => void;
}

export const DashboardEmptyClinicState = ({ onCreateClinic }: DashboardEmptyClinicStateProps) => {
  const navigate = useNavigate();
  const { needsOnboarding, markOnboardingCompleted } = useOnboardingValidation();
  const [dismissed, setDismissed] = useState(false);

  const handleStartOnboarding = () => {
    if (onCreateClinic) {
      onCreateClinic();
    } else {
      navigate('/unified-onboarding');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Note: We don't mark onboarding as completed here, 
    // so it will show again on next visit
  };

  if (dismissed || !needsOnboarding) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <CardTitle>No Clinics Found</CardTitle>
          <CardDescription>
            Create your first clinic to start building websites and managing your practice online.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleStartOnboarding} className="gap-2">
            <Building2 className="h-4 w-4" />
            Create Your First Clinic
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-4 right-4 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Welcome to Molarix!
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Let's get you set up with your first clinic and website in just a few minutes.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
          <p>✓ Create your clinic profile</p>
          <p>✓ Choose a beautiful template</p>
          <p>✓ Set your preferences</p>
          <p>✓ Launch your website</p>
        </div>
        
        <Button onClick={handleStartOnboarding} className="gap-2 w-full sm:w-auto">
          Start Quick Setup
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <p className="text-xs text-blue-600 dark:text-blue-400">
          Takes less than 5 minutes
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardEmptyClinicState;
