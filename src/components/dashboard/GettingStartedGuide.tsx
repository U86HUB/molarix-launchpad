
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, X, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GettingStartedStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GettingStartedGuideProps {
  onDismiss: () => void;
  onCreateWebsite: () => void;
}

const GettingStartedGuide = ({ onDismiss, onCreateWebsite }: GettingStartedGuideProps) => {
  const [steps, setSteps] = useState<GettingStartedStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Molarix!',
      description: 'You\'ve successfully created your account. Let\'s get you started.',
      completed: true,
    },
    {
      id: 'create-website',
      title: 'Create Your First Website',
      description: 'Set up a professional website for your dental clinic in minutes.',
      completed: false,
      action: {
        label: 'Create Website',
        onClick: onCreateWebsite,
      },
    },
    {
      id: 'customize',
      title: 'Customize Your Content',
      description: 'Use AI to generate and edit your website content to match your practice.',
      completed: false,
    },
    {
      id: 'publish',
      title: 'Preview & Publish',
      description: 'Review your website and publish it when you\'re ready to go live.',
      completed: false,
    },
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  return (
    <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                Getting Started Guide
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Complete these steps to set up your dental practice website
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-blue-700 dark:text-blue-300 mb-2">
            <span>Progress: {completedSteps} of {steps.length} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "text-sm font-medium",
                    step.completed ? "text-green-800 dark:text-green-200" : "text-gray-900 dark:text-gray-100"
                  )}>
                    {step.title}
                  </h4>
                  {step.action && !step.completed && (
                    <Button
                      size="sm"
                      onClick={() => {
                        step.action!.onClick();
                        completeStep(step.id);
                      }}
                      className="ml-2"
                    >
                      {step.action.label}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStartedGuide;
