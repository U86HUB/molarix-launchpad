
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateClinicData } from '@/utils/clinicValidation';
import { createClinicInDatabase } from '@/services/clinicService';

const isDebugMode = () => localStorage.getItem('debugMode') === 'true';

export const useClinicCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createClinic = async (clinicName: string, clinicAddress: string) => {
    if (isDebugMode()) {
      console.log('🏥 Creating clinic:', { 
        clinicName: clinicName.trim(), 
        clinicAddress: clinicAddress.trim()
      });
    }

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
      // Create clinic in database (userId will be fetched internally)
      const clinicData = await createClinicInDatabase({
        name: clinicName,
        address: clinicAddress,
      });

      if (isDebugMode()) {
        console.log('✅ Clinic created successfully:', {
          id: clinicData.id,
          name: clinicData.name,
          created_by: clinicData.created_by
        });
      }

      // Show success toast
      toast({
        title: "Clinic Created Successfully",
        description: `"${clinicData.name}" has been created and selected.`,
      });

      return clinicData;

    } catch (error: any) {
      console.error('Error in clinic creation:', error?.message);
      
      if (isDebugMode()) {
        console.error('🔍 Detailed clinic creation error:', {
          error,
          clinicName,
          clinicAddress,
          timestamp: new Date().toISOString()
        });
      }
      
      // Show specific error message
      const errorMessage = error.message?.includes('Row Level Security')
        ? "Authentication required. Please log in and try again."
        : error.message?.includes('created_by')
        ? "Unable to set clinic ownership. Please refresh and try again."
        : error.message || "Failed to create clinic. Please try again.";

      toast({
        title: "Creation Failed",
        description: errorMessage,
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
