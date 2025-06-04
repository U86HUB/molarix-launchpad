
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useClinicCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createClinic = async (clinicName: string, clinicAddress: string) => {
    console.log('=== CLINIC CREATION DEBUG START ===');
    console.log('📝 Form submitted with:', { 
      clinicName: clinicName.trim(), 
      clinicAddress: clinicAddress.trim(),
      timestamp: new Date().toISOString()
    });

    if (!clinicName.trim()) {
      console.log('❌ Empty clinic name');
      toast({
        title: "Missing Information",
        description: "Please enter a clinic name.",
        variant: "destructive",
      });
      return null;
    }

    setIsCreating(true);

    try {
      // Get the current user from Supabase auth
      console.log('🔄 Getting current user from Supabase auth...');
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      console.log('👤 User data response:', { 
        userData: userData?.user ? { 
          id: userData.user.id, 
          email: userData.user.email 
        } : null, 
        userError 
      });

      if (userError) {
        console.log('❌ Error getting user:', userError);
        throw new Error('Authentication error: ' + userError.message);
      }

      if (!userData?.user?.id) {
        console.log('❌ No user ID found');
        throw new Error('User not authenticated');
      }

      const userId = userData.user.id;
      console.log('✅ Valid user ID found:', userId);

      // Create the insert payload - RLS will ensure created_by matches auth.uid()
      const insertPayload = {
        name: clinicName.trim(),
        address: clinicAddress.trim() || null,
        created_by: userId, // Explicitly set this for RLS
      };
      
      console.log('📝 Insert payload:', insertPayload);

      // Insert with RLS - the policies will ensure created_by = auth.uid()
      console.log('📤 Executing Supabase insert...');
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert(insertPayload)
        .select()
        .single();

      console.log('📤 Supabase insert response:', { 
        data: clinicData, 
        error: clinicError,
        timestamp: new Date().toISOString()
      });

      if (clinicError) {
        console.log('❌ Supabase error details:', {
          message: clinicError.message,
          details: clinicError.details,
          hint: clinicError.hint,
          code: clinicError.code
        });
        throw new Error(clinicError.message);
      }

      if (!clinicData) {
        console.log('❌ No data returned from insert');
        throw new Error('No data returned from clinic creation');
      }

      console.log('✅ Clinic created successfully:', {
        id: clinicData.id,
        name: clinicData.name,
        created_by: clinicData.created_by,
        created_at: clinicData.created_at
      });

      // Show success toast
      toast({
        title: "Clinic Created Successfully",
        description: `"${clinicData.name}" has been created and selected.`,
      });

      console.log('✅ Clinic creation flow completed successfully');
      return clinicData;

    } catch (error: any) {
      console.log('❌ Error in clinic creation:', {
        error: error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create clinic. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
      console.log('=== CLINIC CREATION DEBUG END ===');
    }
  };

  return {
    createClinic,
    isCreating,
  };
};
