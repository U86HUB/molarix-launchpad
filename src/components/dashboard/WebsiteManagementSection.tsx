
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CreateWebsiteModal } from './create-website/CreateWebsiteModal';
import { WebsiteManagementHeader } from './website/WebsiteManagementHeader';
import { QuickActions } from './website/QuickActions';
import { WebsitesList } from './website/WebsitesList';
import { useWebsiteManagement } from '@/hooks/useWebsiteManagement';
import { Website } from '@/types/website';

export const WebsiteManagementSection = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    websites,
    clinics,
    loading,
    handleWebsiteCreate,
    handleWebsiteDelete,
  } = useWebsiteManagement();

  const onCreateWebsite = () => setShowCreateModal(true);

  // Wrapper functions to handle the type mismatches
  const handleDelete = async (websiteId: string): Promise<void> => {
    await handleWebsiteDelete(websiteId);
  };

  // Fix the callback to match what CreateWebsiteModal expects
  const onWebsiteCreateFromModal = (website: Website): void => {
    // Convert the Website object to the format expected by handleWebsiteCreate
    const websiteData = {
      name: website.name,
      clinicId: website.clinic_id,
      templateType: website.template_type,
      primaryColor: website.primary_color || '',
      fontStyle: website.font_style || '',
    };
    
    // Call the async function but don't await it since this callback should be void
    handleWebsiteCreate(websiteData).then((success) => {
      if (success) {
        setShowCreateModal(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your clinic websites
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WebsiteManagementHeader 
        onCreateWebsite={onCreateWebsite}
        clinicsCount={clinics.length}
      />

      <QuickActions 
        onCreateWebsite={onCreateWebsite}
        clinicsCount={clinics.length}
      />

      {clinics.length > 0 && (
        <WebsitesList
          websites={websites}
          onWebsiteDelete={handleDelete}
          onCreateWebsite={onCreateWebsite}
        />
      )}

      <CreateWebsiteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onWebsiteCreate={onWebsiteCreateFromModal}
        clinics={clinics}
      />
    </div>
  );
};
