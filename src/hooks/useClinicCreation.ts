
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateClinicData } from '@/utils/clinicValidation';
import { getCurrentSession } from '@/utils/sessionManager';
import { createClinicInDatabase } from '@/services/clinicService';

export const useClinicCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createClinic = async (clinicName: string, clinicAddress: string) => {
    console.log('Creating clinic:', { 
      clinicName: clinicName.trim(), 
      clinicAddress: clinicAddress.trim()
    });

    // Validate input data
    const validation = validateClinicData(clinicName);
    if (!validation.isValid) {
      toast({
        title: "Missing Information",
        description: validation.error,
        variant: "destructive",
      });
      return null;
    }

    setIsCreating(true);

    try {
      // Get current session
      const { userId } = await getCurrentSession();

      // Create clinic in database
      const clinicData = await createClinicInDatabase({
        name: clinicName,
        address: clinicAddress,
        userId
      });

      // Show success toast
      toast({
        title: "Clinic Created Successfully",
        description: `"${clinicData.name}" has been created and selected.`,
      });

      return clinicData;

    } catch (error: any) {
      console.log('Error in clinic creation:', error?.message);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create clinic. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createClinic,
    isCreating,
  };
};
