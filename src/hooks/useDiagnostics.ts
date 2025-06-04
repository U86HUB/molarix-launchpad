
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface OrphanedWebsite {
  id: string;
  name: string;
  status: string;
  template_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface CrossOwnerWebsite {
  id: string;
  name: string;
  clinic_id: string;
  status: string;
  created_by: string;
  current_user_id: string;
  created_at: string;
}

interface RLSTest {
  table_name: string;
  can_select: boolean;
  can_insert: boolean | null;
  can_update: boolean | null;
  can_delete: boolean | null;
  record_count: number;
}

interface DiagnosticError {
  id: string;
  error_type: string;
  error_message: string;
  table_name: string | null;
  user_id: string | null;
  created_at: string;
}

export const useDiagnostics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [orphanedWebsites, setOrphanedWebsites] = useState<OrphanedWebsite[]>([]);
  const [crossOwnerWebsites, setCrossOwnerWebsites] = useState<CrossOwnerWebsite[]>([]);
  const [rlsTests, setRlsTests] = useState<RLSTest[]>([]);
  const [recentErrors, setRecentErrors] = useState<DiagnosticError[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrphanedWebsites = async () => {
    try {
      console.log('🔍 Fetching orphaned websites...');
      
      const { data, error } = await supabase.rpc('get_orphaned_websites');

      if (error) {
        console.error('❌ Error fetching orphaned websites:', error);
        throw error;
      }

      console.log('✅ Orphaned websites fetched:', data?.length || 0);
      setOrphanedWebsites(data || []);
    } catch (error) {
      console.error('Error in fetchOrphanedWebsites:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orphaned websites",
        variant: "destructive",
      });
    }
  };

  const fetchCrossOwnerWebsites = async () => {
    try {
      console.log('🔍 Fetching cross-owner websites...');
      
      const { data, error } = await supabase.rpc('get_cross_owner_websites');

      if (error) {
        console.error('❌ Error fetching cross-owner websites:', error);
        throw error;
      }

      console.log('✅ Cross-owner websites fetched:', data?.length || 0);
      setCrossOwnerWebsites(data || []);
    } catch (error) {
      console.error('Error in fetchCrossOwnerWebsites:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cross-owner websites",
        variant: "destructive",
      });
    }
  };

  const fetchRLSTests = async () => {
    try {
      console.log('🔍 Running RLS tests...');
      
      const { data, error } = await supabase.rpc('test_rls_access');

      if (error) {
        console.error('❌ Error running RLS tests:', error);
        throw error;
      }

      console.log('✅ RLS tests completed:', data?.length || 0, 'tables tested');
      setRlsTests(data || []);
    } catch (error) {
      console.error('Error in fetchRLSTests:', error);
      toast({
        title: "Error",
        description: "Failed to run RLS tests",
        variant: "destructive",
      });
    }
  };

  const fetchRecentErrors = async () => {
    try {
      console.log('🔍 Fetching recent diagnostic errors...');
      
      const { data, error } = await supabase.rpc('get_recent_diagnostic_errors');

      if (error) {
        console.error('❌ Error fetching recent errors:', error);
        throw error;
      }

      console.log('✅ Recent errors fetched:', data?.length || 0);
      setRecentErrors(data || []);
    } catch (error) {
      console.error('Error in fetchRecentErrors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recent errors",
        variant: "destructive",
      });
    }
  };

  const runOrphanedWebsitesRepair = async (): Promise<boolean> => {
    try {
      console.log('🔧 Running orphaned websites repair...');
      
      // For now, we'll simulate a repair operation since the RPC function doesn't exist
      // This would need to be implemented in the database
      console.log('⚠️ Repair function not yet implemented in database');
      
      toast({
        title: "Info",
        description: "Repair function needs to be implemented in the database",
        variant: "default",
      });
      
      return false;
    } catch (error) {
      console.error('Error in runOrphanedWebsitesRepair:', error);
      return false;
    }
  };

  const refreshData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await Promise.all([
        fetchOrphanedWebsites(),
        fetchCrossOwnerWebsites(),
        fetchRLSTests(),
        fetchRecentErrors(),
      ]);
    } catch (error) {
      console.error('Error refreshing diagnostics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return {
    orphanedWebsites,
    crossOwnerWebsites,
    rlsTests,
    recentErrors,
    loading,
    refreshData,
    runOrphanedWebsitesRepair,
  };
};
