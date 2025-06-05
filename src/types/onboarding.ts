
// Type definitions for onboarding system

export interface UnifiedOnboardingData {
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
    skipClinic: boolean;
    selectedClinicId?: string;
  };
  website: {
    name: string;
    selectedTemplate: string;
    logo: File | null;
    primaryColor: string;
    fontStyle: string;
  };
  preferences: {
    toneOfVoice: string;
    hipaa: boolean;
    gdpr: boolean;
  };
}

export interface UnifiedOnboardingSubmissionState {
  isSubmitting: boolean;
  isInitializing: boolean;
  initStep: number;
  currentMessage: string;
  initCompleted: boolean;
  initError: boolean;
}

export interface OnboardingProgressStep {
  step: number;
  message: string;
  completed: boolean;
}

export interface WebsiteInitializationStatus {
  isInitializing: boolean;
  currentStep: number;
  currentMessage: string;
  isCompleted: boolean;
  hasError: boolean;
}

export interface WebsiteInitializationData {
  websiteId: string;
  templateType: string;
  primaryColor: string;
  fontStyle: string;
  clinicData: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface UseUnifiedOnboardingSubmissionResult {
  isSubmitting: boolean;
  isInitializing: boolean;
  initStep: number;
  currentMessage: string;
  initCompleted: boolean;
  initError: boolean;
  submitOnboarding: (
    onboardingData: UnifiedOnboardingData,
    existingClinics: any[]
  ) => Promise<void>;
  retryInitialization: () => void;
}

export interface UseUnifiedOnboardingNavigationResult {
  currentStep: number;
  getProgressPercentage: () => number;
  getStepTitle: () => string;
  handleNext: (
    onboardingData: UnifiedOnboardingData, 
    onSubmit: () => void
  ) => void;
  handleBack: () => void;
  canProceed: (
    currentStep: number, 
    onboardingData: UnifiedOnboardingData
  ) => boolean;
}

export interface UseUnifiedOnboardingValidationResult {
  canProceed: (
    currentStep: number, 
    onboardingData: UnifiedOnboardingData
  ) => boolean;
}

export interface UseUnifiedOnboardingClinicsResult {
  existingClinics: Array<{ id: string; name: string }>;
  checkExistingClinics: () => Promise<void>;
}

export interface UseWebsiteInitializationResult {
  isInitializing: boolean;
  currentStep: number;
  currentMessage: string;
  isCompleted: boolean;
  hasError: boolean;
  initializeWebsite: (data: WebsiteInitializationData) => Promise<void>;
  retryInitialization: (data: WebsiteInitializationData) => void;
}
