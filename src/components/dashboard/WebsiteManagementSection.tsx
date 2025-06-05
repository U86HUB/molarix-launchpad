
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { WebsiteManagementHeader } from './website/WebsiteManagementHeader';
import { QuickActions } from './website/QuickActions';
import { WebsitesList } from './website/WebsitesList';
import { useWebsiteManagement } from '@/hooks/useWebsiteManagement';

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
          onWebsiteDelete={handleWebsiteDelete}
          onCreateWebsite={onCreateWebsite}
        />
      )}

      <CreateWebsiteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onWebsiteCreate={handleWebsiteCreate}
        clinics={clinics}
      />
    </div>
  );
};
