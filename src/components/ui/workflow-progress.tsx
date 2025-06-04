
import React from 'react';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowStep {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  href?: string;
}

interface WorkflowProgressProps {
  steps: WorkflowStep[];
  className?: string;
}

const WorkflowProgress = ({ steps, className }: WorkflowProgressProps) => {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Workflow progress">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center text-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    {
                      "bg-blue-600 border-blue-600 text-white": step.status === 'completed',
                      "bg-blue-100 border-blue-600 text-blue-600": step.status === 'current',
                      "bg-gray-100 border-gray-300 text-gray-400": step.status === 'upcoming',
                    }
                  )}
                >
                  {step.status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="mt-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      {
                        "text-blue-600": step.status === 'completed' || step.status === 'current',
                        "text-gray-400": step.status === 'upcoming',
                      }
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              
              {stepIdx < steps.length - 1 && (
                <div className="flex-1 flex justify-center items-center px-4">
                  <ArrowRight
                    className={cn(
                      "h-5 w-5",
                      {
                        "text-blue-600": steps[stepIdx + 1].status === 'completed',
                        "text-gray-300": steps[stepIdx + 1].status !== 'completed',
                      }
                    )}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default WorkflowProgress;
