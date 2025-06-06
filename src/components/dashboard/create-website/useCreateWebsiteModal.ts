
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWebsiteInitialization } from '@/hooks/useWebsiteInitialization';
import { useWebsiteCreationGuard } from '@/hooks/useWebsiteCreationGuard';
import { Website } from '@/types/website';

interface Clinic {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  clinicId: string;
  template: string;
}

export const useCreateWebsiteModal = (
  clinics: Clinic[],
  onWebsiteCreate: (website: Website) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    clinicId: '',
    template: ''
  });

  const {
    isInitializing,
    currentStep: initStep,
    currentMessage,
    isCompleted: initCompleted,
    hasError: initError,
    initializeWebsite,
  } = useWebsiteInitialization();

  const {
    isCreating,
    canCreate,
    startCreation,
    completeCreation,
    resetCreation,
  } = useWebsiteCreationGuard();

  const isBusy = isCreating || isInitializing;

  const handleNext = () => {
    if (step === 1 && formData.name && formData.clinicId) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({ ...prev, template: templateId }));
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetModal = () => {
    setStep(1);
    setFormData({ name: '', clinicId: '', template: '' });
    resetCreation();
  };

  const handleCreate = async () => {
    if (!user || !formData.name || !formData.clinicId || !formData.template) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const websiteName = formData.name.trim();
    
    // Use creation guard to prevent duplicates
    if (!canCreate(websiteName)) {
      return;
    }

    startCreation(websiteName);
    console.log('🔄 Creating website:', websiteName);

    try {
      // Create the basic website record
      const { data: newWebsite, error } = await supabase
        .from('websites')
        .insert({
          name: websiteName,
          clinic_id: formData.clinicId,
          template_type: formData.template,
          status: 'draft',
          primary_color: '#4f46e5',
          font_style: 'default',
          created_by: user.id,
        })
        .select(`
          id,
          name,
          template_type,
          status,
          clinic_id,
          primary_color,
          font_style,
          created_at,
          updated_at,
          clinics!inner(name)
        `)
        .single();

      if (error) {
        console.error('❌ Website creation error:', error);
        resetCreation();
        throw error;
      }

      console.log('✅ Website created successfully:', newWebsite.id);
      completeCreation(newWebsite.id);

      // Type the response properly to match Website interface
      const websiteWithClinic: Website = {
        id: newWebsite.id,
        name: newWebsite.name,
        template_type: newWebsite.template_type,
        status: newWebsite.status as 'draft' | 'published' | 'archived',
        clinic_id: newWebsite.clinic_id,
        primary_color: newWebsite.primary_color,
        font_style: newWebsite.font_style,
        created_at: newWebsite.created_at,
        updated_at: newWebsite.updated_at,
        created_by: user.id,
        clinic: { name: newWebsite.clinics.name }
      };

      // Get clinic data for initialization
      const selectedClinic = clinics.find(c => c.id === formData.clinicId);

      // Initialize the website with sections and content
      await initializeWebsite({
        websiteId: newWebsite.id,
        templateType: formData.template,
        primaryColor: '#4f46e5',
        fontStyle: 'default',
        clinicData: {
          name: selectedClinic?.name || 'Your Practice'
        }
      });

      onWebsiteCreate(websiteWithClinic);

    } catch (error: any) {
      console.error('❌ Error creating website:', error);
      resetCreation();
      toast({
        title: "Error",
        description: "Failed to create website",
        variant: "destructive",
      });
    }
  };

  return {
    step,
    formData,
    isBusy,
    isInitializing,
    initStep,
    currentMessage,
    initCompleted,
    initError,
    handleNext,
    handleBack,
    handleTemplateSelect,
    updateFormData,
    resetModal,
    handleCreate,
  };
};
