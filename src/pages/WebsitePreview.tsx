
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Website } from '@/types/website';
import { FullPageLoader } from '@/components/ui/loading-states';
import WebsitePreviewHeader from '@/components/preview/WebsitePreviewHeader';
import TemplateRenderer from '@/components/preview/TemplateRenderer';

const WebsitePreview = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('template-a');
  const [saving, setSaving] = useState(false);

  const fetchWebsite = async () => {
    if (!websiteId || !user) return;

    try {
      const { data, error } = await supabase
        .from('websites')
        .select(`
          *,
          clinics!inner(name, address, phone, email, logo_url)
        `)
        .eq('id', websiteId)
        .eq('created_by', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const websiteData: Website = {
          id: data.id,
          name: data.name,
          domain: data.domain,
          status: data.status as 'draft' | 'published' | 'archived',
          template_type: data.template_type,
          primary_color: data.primary_color,
          font_style: data.font_style,
          clinic_id: data.clinic_id,
          created_by: data.created_by,
          created_at: data.created_at,
          updated_at: data.updated_at,
          clinic: { name: data.clinics.name }
        };

        setWebsite(websiteData);
        setSelectedTemplate(data.template_type || 'template-a');
      }
    } catch (error: any) {
      console.error('Error fetching website:', error);
      toast({
        title: "Error",
        description: "Failed to load website",
        variant: "destructive",
      });
      navigate('/dashboard/websites');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = async () => {
    if (!website || selectedTemplate === website.template_type) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('websites')
        .update({ 
          template_type: selectedTemplate,
          updated_at: new Date().toISOString()
        })
        .eq('id', website.id)
        .eq('created_by', user!.id);

      if (error) throw error;

      setWebsite(prev => prev ? { ...prev, template_type: selectedTemplate } : null);
      
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditWebsite = () => {
    navigate(`/website-builder/${websiteId}`);
  };

  useEffect(() => {
    fetchWebsite();
  }, [websiteId, user]);

  if (loading) {
    return <FullPageLoader text="Loading website preview..." />;
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Website not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The website you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => navigate('/dashboard/websites')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Create session data format expected by TemplateRenderer
  const sessionData = {
    id: website.id,
    clinic_name: website.name,
    address: website.clinic?.name || 'Your Clinic Address',
    phone: '(555) 123-4567', // Default phone
    email: 'info@clinic.com', // Default email
    logo_url: null, // No logo URL in current schema
    primary_color: website.primary_color || '#4f46e5',
    font_style: website.font_style || 'Inter, system-ui, sans-serif',
    selected_template: selectedTemplate,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <WebsitePreviewHeader
        website={website}
        selectedTemplate={selectedTemplate}
        onTemplateChange={handleTemplateChange}
        onSaveTemplate={handleSaveTemplate}
        onEditWebsite={handleEditWebsite}
        onBack={() => navigate('/dashboard/websites')}
        saving={saving}
        hasUnsavedChanges={selectedTemplate !== website.template_type}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <TemplateRenderer 
            sessionData={sessionData}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
