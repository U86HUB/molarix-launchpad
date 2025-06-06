
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2 } from 'lucide-react';
import { Website } from '@/types/website';
import WebsiteInitializationLoader from '../../website-builder/WebsiteInitializationLoader';
import { WebsiteBasicInfoStep } from './WebsiteBasicInfoStep';
import { WebsiteTemplateStep } from './WebsiteTemplateStep';
import { useCreateWebsiteModal } from './useCreateWebsiteModal';

interface Clinic {
  id: string;
  name: string;
}

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebsiteCreate: (website: Website) => void;
  clinics: Clinic[];
}

export const CreateWebsiteModal = ({ 
  isOpen, 
  onClose, 
  onWebsiteCreate, 
  clinics 
}: CreateWebsiteModalProps) => {
  const {
    step,
    formData,
    isBusy,
    isInitializing,
    initStep,
    currentMessage,
    initCompleted,
    initError,
    handleNext,
    handleBack,
    handleTemplateSelect,
    updateFormData,
    resetModal,
    handleCreate,
  } = useCreateWebsiteModal(clinics, onWebsiteCreate);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isInitializing && !isBusy) {
      onClose();
      resetModal();
    }
  };

  // Close modal when initialization completes successfully
  if (initCompleted && isOpen) {
    setTimeout(() => {
      handleOpenChange(false);
    }, 1000);
  }

  return (
    <>
      <WebsiteInitializationLoader
        isVisible={isInitializing}
        currentStep={initStep}
        currentMessage={currentMessage}
        isCompleted={initCompleted}
        hasError={initError}
        onRetry={() => {
          console.log('Retry initialization requested');
        }}
      />

      <Dialog open={isOpen && !isInitializing} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Create New Website
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Step {step} of 2
              </span>
            </DialogTitle>
            <DialogDescription>
              {step === 1 
                ? "Enter basic information for your new website"
                : "Choose a template that best fits your clinic's style"
              }
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <WebsiteBasicInfoStep
              formData={formData}
              clinics={clinics}
              isBusy={isBusy}
              onFormDataUpdate={updateFormData}
              onNext={handleNext}
              onCancel={() => handleOpenChange(false)}
            />
          )}

          {step === 2 && (
            <WebsiteTemplateStep
              formData={formData}
              clinics={clinics}
              isBusy={isBusy}
              isCreating={isBusy}
              onTemplateSelect={handleTemplateSelect}
              onBack={handleBack}
              onCreate={handleCreate}
              onCancel={() => handleOpenChange(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
