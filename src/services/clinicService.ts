
import { supabase } from '@/integrations/supabase/client';

export interface CreateClinicData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ClinicCreationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const createClinicInDatabase = async ({ name, address, phone, email }: CreateClinicData): Promise<ClinicCreationResult> => {
  console.log('🏥 Creating clinic in database...');

  try {
    // 1. Get and validate current session
    console.log('🔐 Getting current session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    console.log('📋 Session validation:', { 
      hasSession: !!sessionData?.session,
      hasUser: !!sessionData?.session?.user,
      userId: sessionData?.session?.user?.id,
      sessionError 
    });

    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return {
        success: false,
        error: 'Authentication error. Please log in and try again.'
      };
    }

    if (!sessionData?.session?.user?.id) {
      console.error('❌ No authenticated user found');
      return {
        success: false,
        error: 'You must be logged in to create a clinic. Please log in and try again.'
      };
    }

    const userId = sessionData.session.user.id;
    console.log('✅ Valid session found for user:', userId);

    // 2. Prepare insert payload with explicit created_by
    const insertPayload = {
      name: name.trim(),
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      created_by: userId, // Explicitly set for RLS
    };
    
    console.log('📤 Inserting clinic with payload:', insertPayload);

    // 3. Insert with error handling
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .insert(insertPayload)
      .select()
      .single();

    console.log('📊 Clinic insert result:', { 
      data: clinicData, 
      error: clinicError,
      hasData: !!clinicData
    });

    if (clinicError) {
      console.error('❌ Supabase error:', clinicError);
      
      // Handle specific error types
      if (clinicError.message?.includes('Row Level Security')) {
        return {
          success: false,
          error: 'Permission denied. Please log in and try again.'
        };
      }
      
      if (clinicError.message?.includes('duplicate')) {
        return {
          success: false,
          error: 'A clinic with this name already exists.'
        };
      }
      
      return {
        success: false,
        error: `Failed to create clinic: ${clinicError.message}`
      };
    }

    if (!clinicData) {
      console.error('❌ No data returned from insert');
      return {
        success: false,
        error: 'No data returned from clinic creation'
      };
    }

    console.log('✅ Clinic created successfully:', {
      id: clinicData.id,
      name: clinicData.name,
      created_by: clinicData.created_by
    });

    return {
      success: true,
      data: clinicData
    };

  } catch (error: any) {
    console.error('❌ Error in createClinicInDatabase:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while creating the clinic.'
    };
  }
};
