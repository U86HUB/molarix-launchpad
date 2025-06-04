
import { Progress } from "@/components/ui/progress";
import WorkflowProgress, { WorkflowStep } from "@/components/ui/workflow-progress";

interface OnboardingProgressProps {
  activeStep: string;
  progress: number;
}

const OnboardingProgress = ({ activeStep, progress }: OnboardingProgressProps) => {
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'clinic',
      label: 'Clinic Info',
      description: 'Basic clinic details',
      status: activeStep === 'clinic' ? 'current' : (progress > 25 ? 'completed' : 'upcoming'),
    },
    {
      id: 'brand',
      label: 'Branding',
      description: 'Logo and style',
      status: activeStep === 'brand' ? 'current' : (progress > 50 ? 'completed' : 'upcoming'),
    },
    {
      id: 'compliance',
      label: 'Compliance',
      description: 'Privacy settings',
      status: activeStep === 'compliance' ? 'current' : (progress > 75 ? 'completed' : 'upcoming'),
    },
    {
      id: 'templates',
      label: 'Templates',
      description: 'Choose design',
      status: activeStep === 'templates' ? 'current' : (progress === 100 ? 'completed' : 'upcoming'),
    },
  ];

  return (
    <>
      <WorkflowProgress steps={workflowSteps} className="mb-8" />
      <Progress value={progress} className="h-2 mb-8" />
    </>
  );
};

export default OnboardingProgress;
