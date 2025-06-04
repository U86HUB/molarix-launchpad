
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
  const { createClinic, isCreating } = useClinicCreation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const clinicData = await createClinic(clinicName, clinicAddress);
    
    if (clinicData) {
      // Call the callback with the new clinic ID
      console.log('🔄 Calling onClinicCreated with ID:', clinicData.id);
      onClinicCreated(clinicData.id);

      // Reset form
      setClinicName('');
      setClinicAddress('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <ClinicFormHeader 
        onCancel={onCancel}
        isCreating={isCreating}
      />
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <ClinicFormFields
          clinicName={clinicName}
          setClinicName={setClinicName}
          clinicAddress={clinicAddress}
          setClinicAddress={setClinicAddress}
          isCreating={isCreating}
        />
        
        <ClinicFormActions
          clinicName={clinicName}
          isCreating={isCreating}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};
