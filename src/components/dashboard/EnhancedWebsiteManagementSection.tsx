
import { useState } from 'react';
import { Plus, RefreshCw, Building, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { WebsiteManagementHeader } from './website/WebsiteManagementHeader';
import { QuickActions } from './website/QuickActions';
import { WebsitesList } from './website/WebsitesList';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';
import { useWebsiteManagement } from '@/hooks/useWebsiteManagement';
import { useLoadingStates } from '@/hooks/useLoadingStates';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Website } from '@/types/website';

export const EnhancedWebsiteManagementSection = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { executeAsync, isLoading } = useLoadingStates();
  
  const {
    websites,
    clinics,
    loading: initialLoading,
    handleWebsiteCreate,
    handleWebsiteDelete,
    refreshData
  } = useWebsiteManagement();

  const handleRefresh = () => {
    executeAsync('refresh', {
      operation: refreshData,
      successMessage: 'Data refreshed successfully'
    });
  };

  const handleCreateWebsite = () => {
    if (clinics.length === 0) {
      // TODO: Implement clinic creation flow
      return;
    }
    setShowCreateModal(true);
  };

  const handleDelete = async (websiteId: string): Promise<void> => {
    await executeAsync(`delete-${websiteId}`, {
      operation: () => handleWebsiteDelete(websiteId),
      successMessage: 'Website deleted successfully'
    });
  };

  const onWebsiteCreateFromModal = (website: Website): void => {
    const websiteData = {
      name: website.name,
      clinicId: website.clinic_id,
      templateType: website.template_type,
      primaryColor: website.primary_color || '',
      fontStyle: website.font_style || '',
    };
    
    executeAsync('create-website', {
      operation: () => handleWebsiteCreate(websiteData),
      onSuccess: (success) => {
        if (success) {
          setShowCreateModal(false);
        }
      },
      successMessage: 'Website created successfully'
    });
  };

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites.length}</div>
            <p className="text-xs text-muted-foreground">
              {websites.filter(w => w.status === 'published').length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Clinics</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clinics.length}</div>
            <p className="text-xs text-muted-foreground">
              Active clinic profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading('refresh')}
              className="w-full"
            >
              {isLoading('refresh') ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions 
        onCreateWebsite={handleCreateWebsite}
        clinicsCount={clinics.length}
      />

      {/* Main Content */}
      {clinics.length === 0 ? (
        <EnhancedEmptyState
          icon={Building}
          title="No Clinics Found"
          description="You need to create a clinic before you can build websites."
          illustration="create"
          actions={[
            {
              label: "Create First Clinic",
              onClick: () => {/* TODO: Implement clinic creation */},
              icon: Plus
            }
          ]}
          suggestions={[
            "A clinic profile is required to organize your websites",
            "You can create multiple clinics for different locations",
            "Each clinic can have its own branding and settings"
          ]}
        />
      ) : websites.length === 0 ? (
        <EnhancedEmptyState
          icon={Globe}
          title="No Websites Yet"
          description="Start building professional websites for your clinics."
          illustration="create"
          actions={[
            {
              label: "Create First Website",
              onClick: handleCreateWebsite,
              loading: isLoading('create-website'),
              icon: Plus
            }
          ]}
          suggestions={[
            "Choose from professionally designed templates",
            "AI-powered content generation",
            "Mobile-responsive and SEO optimized",
            "Easy drag-and-drop customization"
          ]}
        />
      ) : (
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
