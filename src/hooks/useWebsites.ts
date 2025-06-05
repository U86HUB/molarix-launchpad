
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Website } from '@/types/website';
import { websiteService, CreateWebsiteData } from '@/services/websiteService';

export const useWebsites = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebsites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const fetchedWebsites = await websiteService.fetchWebsites(user.id);
      setWebsites(fetchedWebsites);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWebsite = async (websiteData: CreateWebsiteData): Promise<boolean> => {
    if (!user) return false;

    try {
      const newWebsite = await websiteService.createWebsite(websiteData, user.id);
      setWebsites(prev => [newWebsite, ...prev]);
      return true;
    } catch (error) {
      console.error('Error creating website:', error);
      return false;
    }
  };

  const deleteWebsite = async (websiteId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      await websiteService.deleteWebsite(websiteId, user.id);
      setWebsites(prev => prev.filter(website => website.id !== websiteId));
      return true;
    } catch (error) {
      console.error('Error deleting website:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWebsites();
    }
  }, [user]);

  return {
    websites,
    loading,
    createWebsite,
    deleteWebsite,
    refreshWebsites: fetchWebsites,
  };
};
