
import { useState } from 'react';
import { useClinicCreation } from '@/hooks/useClinicCreation';
import { ClinicFormHeader } from './ClinicFormHeader';
import { ClinicFormFields } from './ClinicFormFields';
import { ClinicFormActions } from './ClinicFormActions';

interface AddNewClinicInlineProps {
  onClinicCreated: (clinicId: string) => void;
  onCancel: () => void;
}

export const AddNewClinicInline = ({ onClinicCreated, onCancel }: AddNewClinicInlineProps) => {
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createClinic, isCreating } = useClinicCreation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🧪 FORM SUBMISSION STARTED - handleSubmit triggered');
    console.log('🧪 Form data:', {
      clinicName: clinicName.trim(),
      clinicAddress: clinicAddress.trim(),
      clinicPhone: clinicPhone.trim(),
      clinicEmail: clinicEmail.trim(),
      isSubmitting,
      isCreating
    });
    
    // Prevent double submissions
    if (isSubmitting || isCreating) {
      console.log('🔄 Submission already in progress, ignoring...');
      return;
    }

    if (!clinicName.trim()) {
      console.log('❌ Clinic name is empty, not submitting');
      return;
    }

    setIsSubmitting(true);
    console.log('🔄 Setting isSubmitting to true, calling createClinic...');
    
    try {
      const clinicData = await createClinic(
        clinicName, 
        clinicAddress, 
        clinicPhone, 
        clinicEmail
      );
      
      console.log('🔄 createClinic returned:', clinicData);
      
      if (clinicData) {
        console.log('🔄 Calling onClinicCreated with ID:', clinicData.id);
        onClinicCreated(clinicData.id);

        // Reset form
        setClinicName('');
        setClinicAddress('');
        setClinicPhone('');
        setClinicEmail('');
        
        console.log('✅ Form reset and onClinicCreated called');
      } else {
        console.log('❌ createClinic returned null/undefined');
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
      console.log('🔄 Setting isSubmitting to false');
    }
  };

  const isLoading = isCreating || isSubmitting;

  return (
    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <ClinicFormHeader 
        onCancel={onCancel}
        isCreating={isLoading}
      />
      
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <ClinicFormFields
          clinicName={clinicName}
          setClinicName={setClinicName}
          clinicAddress={clinicAddress}
          setClinicAddress={setClinicAddress}
          clinicPhone={clinicPhone}
          setClinicPhone={setClinicPhone}
          clinicEmail={clinicEmail}
          setClinicEmail={setClinicEmail}
          isCreating={isLoading}
        />
        
        <ClinicFormActions
          clinicName={clinicName}
          isCreating={isLoading}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};
