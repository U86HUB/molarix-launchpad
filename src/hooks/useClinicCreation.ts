
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateClinicData } from '@/utils/clinicValidation';
import { createClinicInDatabase } from '@/services/clinicService';

const isDebugMode = () => localStorage.getItem('debugMode') === 'true';

export const useClinicCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createClinic = async (clinicName: string, clinicAddress: string, clinicPhone?: string, clinicEmail?: string) => {
    console.log('🏥 useClinicCreation.createClinic() CALLED');
    console.log('🏥 Input parameters:', { 
      clinicName: clinicName?.trim(), 
      clinicAddress: clinicAddress?.trim(),
      clinicPhone: clinicPhone?.trim(),
      clinicEmail: clinicEmail?.trim()
    });

    if (isDebugMode()) {
      console.log('🏥 Starting clinic creation:', { 
        clinicName: clinicName.trim(), 
        clinicAddress: clinicAddress.trim(),
        clinicPhone: clinicPhone?.trim(),
        clinicEmail: clinicEmail?.trim()
      });
    }

    // Validate input data - now passing clinicEmail to validation
    console.log('🏥 Validating clinic data...');
    const validation = validateClinicData(clinicName, clinicEmail);
    if (!validation.isValid) {
      console.log('❌ Validation failed:', validation.error);
      toast({
        title: "Missing Information",
        description: validation.error,
        variant: "destructive",
      });
      return null;
    }
    console.log('✅ Validation passed');

    setIsCreating(true);
    console.log('🏥 Setting isCreating to true');

    try {
      console.log('🏥 Calling createClinicInDatabase...');
      
      // Create clinic in database with comprehensive error handling
      const result = await createClinicInDatabase({
        name: clinicName,
        address: clinicAddress,
        phone: clinicPhone,
        email: clinicEmail,
      });

      console.log('🏥 createClinicInDatabase result:', result);

      if (!result.success) {
        console.error('❌ Clinic creation failed:', result.error);
        
        if (isDebugMode()) {
          console.error('🔍 Detailed clinic creation error:', {
            error: result.error,
            clinicName,
            clinicAddress,
            timestamp: new Date().toISOString()
          });
        }
        
        // Show specific error message
        toast({
          title: "Could not create clinic",
          description: result.error,
          variant: "destructive",
        });
        
        return null;
      }

      const clinicData = result.data;
      console.log('✅ Clinic creation successful, data:', clinicData);

      if (isDebugMode()) {
        console.log('✅ Clinic created successfully:', {
          id: clinicData.id,
          name: clinicData.name,
          created_by: clinicData.created_by
        });
      }

      // Show success toast
      toast({
        title: "Clinic created successfully!",
        description: `"${clinicData.name}" has been created and selected.`,
      });

      return clinicData;

    } catch (error: any) {
      console.error('❌ Unexpected error in clinic creation:', error?.message);
      console.error('❌ Full error object:', error);
      
      if (isDebugMode()) {
        console.error('🔍 Detailed unexpected error:', {
          error,
          clinicName,
          clinicAddress,
          timestamp: new Date().toISOString()
        });
      }
      
      toast({
        title: "Could not create clinic",
        description: error?.message || "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsCreating(false);
      console.log('🏥 Setting isCreating to false');
    }
  };

  return {
    createClinic,
    isCreating,
  };
};
