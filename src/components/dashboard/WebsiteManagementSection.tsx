
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CreateWebsiteModal } from './CreateWebsiteModal';
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

  const onWebsiteCreateFromModal = async (websiteData: {
    name: string;
    clinicId: string;
    templateType: string;
    primaryColor: string;
    fontStyle: string;
  }) => {
    const success = await handleWebsiteCreate(websiteData);
    if (success) {
      setShowCreateModal(false);
    }
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
