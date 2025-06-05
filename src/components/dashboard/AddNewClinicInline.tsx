
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
  const { createClinic, isCreating } = useClinicCreation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Submitting clinic creation form:', {
      clinicName: clinicName.trim(),
      clinicAddress: clinicAddress.trim(),
      clinicPhone: clinicPhone.trim(),
      clinicEmail: clinicEmail.trim()
    });
    
    const clinicData = await createClinic(
      clinicName, 
      clinicAddress, 
      clinicPhone, 
      clinicEmail
    );
    
    if (clinicData) {
      console.log('🔄 Calling onClinicCreated with ID:', clinicData.id);
      onClinicCreated(clinicData.id);

      // Reset form
      setClinicName('');
      setClinicAddress('');
      setClinicPhone('');
      setClinicEmail('');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <ClinicFormHeader 
        onCancel={onCancel}
        isCreating={isCreating}
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
