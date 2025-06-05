
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useQueryParamClinicInsert = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [newClinicId, setNewClinicId] = useState<string | null>(null);

  useEffect(() => {
    const handleClinicCreation = async () => {
      // Only process if we have clinicName parameter and not already processing
      const clinicName = searchParams.get('clinicName');
      if (!clinicName || isProcessing) {
        return;
      }

      console.log('🔄 Processing clinic creation from URL parameters:', {
        clinicName,
        clinicAddress: searchParams.get('clinicAddress'),
        clinicPhone: searchParams.get('clinicPhone'),
        clinicEmail: searchParams.get('clinicEmail')
      });

      setIsProcessing(true);

      try {
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          toast({
            title: "Authentication Error",
            description: "Please log in and try again.",
            variant: "destructive",
          });
          return;
        }

        if (!sessionData?.session?.user?.id) {
          console.error('❌ No authenticated user found');
          toast({
            title: "Authentication Required",
            description: "You must be logged in to create a clinic.",
            variant: "destructive",
          });
          return;
        }

        const userId = sessionData.session.user.id;
        console.log('✅ Valid session found for user:', userId);

        // Check if clinic with this name already exists for this user
        console.log('🔍 Checking for existing clinic with name:', clinicName);
        const { data: existingClinics, error: checkError } = await supabase
          .from('clinics')
          .select('id, name')
          .eq('created_by', userId)
          .eq('name', clinicName.trim());

        if (checkError) {
          console.error('❌ Error checking for existing clinic:', checkError);
          toast({
            title: "Database Error",
            description: "Failed to check existing clinics.",
            variant: "destructive",
          });
          return;
        }

        if (existingClinics && existingClinics.length > 0) {
          console.log('✅ Clinic already exists:', existingClinics[0]);
          toast({
            title: "Clinic Already Exists",
            description: `Clinic "${clinicName}" already exists in your account.`,
          });
          
          // Set the existing clinic as the new clinic for potential redirection
          setNewClinicId(existingClinics[0].id);
          
          // Clean up URL parameters
          navigate('/dashboard', { replace: true });
          return;
        }

        // Create new clinic
        console.log('📤 Creating new clinic...');
        const clinicData = {
          name: clinicName.trim(),
          address: searchParams.get('clinicAddress')?.trim() || null,
          phone: searchParams.get('clinicPhone')?.trim() || null,
          email: searchParams.get('clinicEmail')?.trim() || null,
          created_by: userId,
        };

        console.log('📤 Clinic insert payload:', clinicData);

        const { data: newClinic, error: insertError } = await supabase
          .from('clinics')
          .insert([clinicData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Insert error:', insertError);
          toast({
            title: "Insert Failed",
            description: insertError.message || "Failed to create clinic.",
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Clinic created successfully:', newClinic);
        setNewClinicId(newClinic.id);
        
        toast({
          title: "Clinic Created",
          description: `"${newClinic.name}" has been created successfully.`,
        });

        // Clean up URL parameters
        navigate('/dashboard', { replace: true });

      } catch (error: unknown) {
        console.error('❌ Unexpected error in clinic creation:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        toast({
          title: "Unexpected Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handleClinicCreation();
  }, [searchParams, navigate, toast, isProcessing]);

  return {
    isProcessing,
    newClinicId,
  };
};
