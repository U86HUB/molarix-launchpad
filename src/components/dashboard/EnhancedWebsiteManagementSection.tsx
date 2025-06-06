
import { WebsiteManagementHeader } from './website/WebsiteManagementHeader';
import { QuickActions } from './website/QuickActions';
import { WebsitesList } from './website/WebsitesList';
import { CreateWebsiteModal } from './create-website/CreateWebsiteModal';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { WebsiteStatsCards } from './website/WebsiteStatsCards';
import { WebsiteEmptyStates } from './website/WebsiteEmptyStates';
import { useEnhancedWebsiteManagement } from './website/useEnhancedWebsiteManagement';

export const EnhancedWebsiteManagementSection = () => {
  const {
    websites,
    clinics,
    initialLoading,
    showCreateModal,
    setShowCreateModal,
    handleRefresh,
    handleCreateWebsite,
    handleDelete,
    onWebsiteCreateFromModal,
    isLoading
  } = useEnhancedWebsiteManagement();

  if (initialLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your clinic websites
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading your websites..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WebsiteManagementHeader 
        onCreateWebsite={handleCreateWebsite}
        clinicsCount={clinics.length}
      />

      <WebsiteStatsCards
        websitesCount={websites.length}
        publishedCount={websites.filter(w => w.status === 'published').length}
        clinicsCount={clinics.length}
        onRefresh={handleRefresh}
        isRefreshing={isLoading('refresh')}
      />

      <QuickActions 
        onCreateWebsite={handleCreateWebsite}
        clinicsCount={clinics.length}
      />

      <WebsiteEmptyStates
        clinicsCount={clinics.length}
        websitesCount={websites.length}
        onCreateWebsite={handleCreateWebsite}
        isCreating={isLoading('create-website')}
      />

      {clinics.length > 0 && websites.length > 0 && (
        <WebsitesList
          websites={websites}
          onWebsiteDelete={handleDelete}
          onCreateWebsite={handleCreateWebsite}
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
