
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useClinicCreation = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createClinic = async (clinicName: string, clinicAddress: string) => {
    console.log('Creating clinic:', { 
      clinicName: clinicName.trim(), 
      clinicAddress: clinicAddress.trim()
    });

    if (!clinicName.trim()) {
      console.log('Empty clinic name provided');
      toast({
        title: "Missing Information",
        description: "Please enter a clinic name.",
        variant: "destructive",
      });
      return null;
    }

    setIsCreating(true);

    try {
      // Get the current session from Supabase auth
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('Error getting session:', sessionError);
        throw new Error('Session error: ' + sessionError.message);
      }

      if (!sessionData?.session) {
        console.log('No active session found');
        throw new Error('No active session. Please log in again.');
      }

      const session = sessionData.session;
      const userId = session.user?.id;

      if (!userId) {
        console.log('No user ID found in session');
        throw new Error('User ID not found in session');
      }

      console.log('Valid session found, creating clinic...');

      // Create the insert payload
      const insertPayload = {
        name: clinicName.trim(),
        address: clinicAddress.trim() || null,
        created_by: userId,
      };
      
      console.log('Inserting clinic with payload:', insertPayload);

      // Insert with authenticated session
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert(insertPayload)
        .select()
        .single();

      console.log('Clinic insert result:', { 
        data: clinicData, 
        error: clinicError
      });

      if (clinicError) {
        console.log('Supabase error:', clinicError);
        throw new Error(clinicError.message);
      }

      if (!clinicData) {
        console.log('No data returned from insert');
        throw new Error('No data returned from clinic creation');
      }

      console.log('Clinic created successfully:', {
        id: clinicData.id,
        name: clinicData.name
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
