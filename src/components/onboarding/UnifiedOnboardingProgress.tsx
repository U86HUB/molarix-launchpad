
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UnifiedOnboardingProgressProps {
  currentStep: number;
  progressPercentage: number;
}

const UnifiedOnboardingProgress = ({ 
  currentStep, 
  progressPercentage 
}: UnifiedOnboardingProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}>
          Step 1: Clinic
        </span>
        <span className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}>
          Step 2: Website
        </span>
        <span className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}>
          Step 3: Preferences
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default UnifiedOnboardingProgress;
