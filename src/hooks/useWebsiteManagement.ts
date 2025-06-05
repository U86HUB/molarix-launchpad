
import { useWebsites } from './useWebsites';
import { useClinics } from './useClinics';
import type { CreateWebsiteData } from '@/services/websiteService';

export const useWebsiteManagement = () => {
  const {
    websites,
    loading: websitesLoading,
    createWebsite,
    deleteWebsite,
    refreshWebsites,
  } = useWebsites();

  const {
    clinics,
    loading: clinicsLoading,
    refreshClinics,
  } = useClinics();

  const loading = websitesLoading || clinicsLoading;

  const handleWebsiteCreate = async (websiteData: CreateWebsiteData): Promise<boolean> => {
    const success = await createWebsite(websiteData);
    if (success) {
      // Refresh clinics in case any clinic data needs updating
      await refreshClinics();
    }
    return success;
  };

  const handleWebsiteDelete = async (websiteId: string): Promise<boolean> => {
    return await deleteWebsite(websiteId);
  };

  const refreshData = async () => {
    await Promise.all([refreshWebsites(), refreshClinics()]);
  };

  return {
    websites,
    clinics,
    loading,
    handleWebsiteCreate,
    handleWebsiteDelete,
    refreshData,
  };
};
