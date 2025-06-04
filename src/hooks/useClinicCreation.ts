
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
      // Get the current session from Supabase auth
      console.log('🔄 Getting current session from Supabase auth...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      console.log('🔐 Session data response:', { 
        session: sessionData?.session ? {
          access_token: sessionData.session.access_token ? 'EXISTS' : 'MISSING',
          user_id: sessionData.session.user?.id,
          user_email: sessionData.session.user?.email,
          expires_at: sessionData.session.expires_at
        } : null,
        sessionError 
      });

      if (sessionError) {
        console.log('❌ Error getting session:', sessionError);
        throw new Error('Session error: ' + sessionError.message);
      }

      if (!sessionData?.session) {
        console.log('❌ No active session found');
        throw new Error('No active session. Please log in again.');
      }

      const session = sessionData.session;
      const userId = session.user?.id;

      if (!userId) {
        console.log('❌ No user ID found in session');
        throw new Error('User ID not found in session');
      }

      console.log('✅ Valid session and user ID found:', userId);

      // Create the insert payload
      const insertPayload = {
        name: clinicName.trim(),
        address: clinicAddress.trim() || null,
        created_by: userId,
      };
      
      console.log('📝 Insert payload:', insertPayload);
      console.log('🔑 Confirming created_by matches session user:', {
        payloadUserId: insertPayload.created_by,
        sessionUserId: userId,
        match: insertPayload.created_by === userId
      });

      // Insert with authenticated session - the client should automatically include auth headers
      console.log('📤 Executing Supabase insert with authenticated session...');
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

      // Immediately test if we can fetch the clinic back
      console.log('🔍 Testing immediate fetch after creation...');
      const { data: fetchTest, error: fetchError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', clinicData.id)
        .single();
      
      console.log('🔍 Immediate fetch test result:', { 
        fetchTest, 
        fetchError,
        canFetchBack: !!fetchTest && !fetchError
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

  // Add a test function for manual debugging
  const testDirectInsert = async () => {
    console.log('🧪 TESTING DIRECT INSERT...');
    
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      console.log('❌ No user ID for test insert');
      return;
    }

    console.log('🧪 Inserting test clinic with user ID:', userId);
    
    const { data, error } = await supabase
      .from('clinics')
      .insert({
        name: 'Debug Test Clinic',
        address: 'Test Address',
        created_by: userId,
      })
      .select()
      .single();

    console.log('🧪 Test insert result:', { data, error });
    
    if (data) {
      // Try to fetch it back immediately
      const { data: fetchBack, error: fetchError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', data.id);
      
      console.log('🧪 Can fetch back test clinic:', { fetchBack, fetchError });
    }
  };

  return {
    createClinic,
    isCreating,
    testDirectInsert, // Export for debugging
  };
};
