
import { useState } from 'react';
import { useWebsiteManagement } from '@/hooks/useWebsiteManagement';
import { useLoadingStates } from '@/hooks/useLoadingStates';
import { Website } from '@/types/website';

export const useEnhancedWebsiteManagement = () => {
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

  return {
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
  };
};
