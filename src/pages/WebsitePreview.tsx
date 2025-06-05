
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedWebsiteData } from '@/hooks/useEnhancedWebsiteData';
import { FullPageLoader } from '@/components/ui/loading-states';
import WebsitePreviewHeader from '@/components/preview/WebsitePreviewHeader';
import WebsitePreview from '@/components/website-builder/preview/WebsitePreview';

const WebsitePreviewPage = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const {
    website,
    sections,
    publishedCopy,
    draftCopy,
    loading,
    error
  } = useEnhancedWebsiteData(websiteId);

  const [selectedTemplate, setSelectedTemplate] = useState('template-a');
  const [copyMode, setCopyMode] = useState<'draft' | 'published'>('published');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (website) {
      setSelectedTemplate(website.template_type || 'template-a');
    }
  }, [website]);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleSaveTemplate = async () => {
    if (!website || !user || selectedTemplate === website.template_type) return;

    setSaving(true);
    try {
      // Template saving logic would go here
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

  const handleSectionSelect = () => {
    // No-op for preview mode
  };

  const handleSectionReorder = () => {
    // No-op for preview mode
  };

  const handleSectionUpdate = () => {
    // No-op for preview mode
  };

  if (loading) {
    return <FullPageLoader text="Loading website preview..." />;
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Website not found'}
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

  // Choose the appropriate copy based on mode
  const currentCopy = copyMode === 'published' ? publishedCopy : draftCopy;

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
          {sections.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Website Preview
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCopyMode(copyMode === 'published' ? 'draft' : 'published')}
                    className={`px-3 py-1 text-sm rounded ${
                      copyMode === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {copyMode === 'published' ? 'Published Copy' : 'Draft Copy'}
                  </button>
                </div>
              </div>
              
              <WebsitePreview
                sections={sections}
                onSectionSelect={handleSectionSelect}
                onSectionReorder={handleSectionReorder}
                onSectionUpdate={handleSectionUpdate}
                isEditMode={false}
                fallbackCopy={currentCopy}
                copyMode={copyMode}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Available</h3>
              <p className="text-gray-600 mb-4">
                This website doesn't have any sections yet. 
              </p>
              <button
                onClick={handleEditWebsite}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsitePreviewPage;
