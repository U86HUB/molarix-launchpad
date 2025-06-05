
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InitializationStep {
  id: number;
  message: string;
  completed: boolean;
  active: boolean;
}

interface WebsiteInitializationLoaderProps {
  isVisible: boolean;
  currentStep: number;
  currentMessage: string;
  isCompleted: boolean;
  hasError: boolean;
  onRetry?: () => void;
}

const WebsiteInitializationLoader = ({
  isVisible,
  currentStep,
  currentMessage,
  isCompleted,
  hasError,
  onRetry
}: WebsiteInitializationLoaderProps) => {
  const [steps, setSteps] = useState<InitializationStep[]>([
    { id: 1, message: "Generating website structure…", completed: false, active: false },
    { id: 2, message: "Applying selected template and color scheme…", completed: false, active: false },
    { id: 3, message: "Generating AI-powered content…", completed: false, active: false },
    { id: 4, message: "Finalizing layout…", completed: false, active: false },
  ]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        completed: step.id < currentStep || (step.id === currentStep && isCompleted),
        active: step.id === currentStep && !isCompleted
      }))
    );

    // Update progress
    if (isCompleted) {
      setProgress(100);
    } else {
      setProgress((currentStep - 1) * 25 + (currentStep <= 4 ? 12.5 : 0));
    }
  }, [currentStep, isCompleted]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
        <CardContent className="p-8">
          {hasError ? (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Setup Failed
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We encountered an issue while setting up your website. Please try again.
                </p>
                <Button onClick={onRetry} className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {isCompleted ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {isCompleted ? 'Website Ready!' : 'Setting Up Your Website'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isCompleted 
                    ? 'Your website has been created successfully'
                    : 'This may take a few seconds. Don\'t refresh the page.'
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{Math.round(progress)}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Current Step */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentMessage}
                  </p>
                </div>
              </div>

              {/* Step List */}
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : step.active ? (
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      step.completed 
                        ? 'text-green-600 dark:text-green-400' 
                        : step.active 
                          ? 'text-blue-600 dark:text-blue-400 font-medium' 
                          : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.message}
                    </span>
                  </div>
                ))}
              </div>

              {/* Completion Message */}
              {isCompleted && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Redirecting to your website builder...
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteInitializationLoader;
