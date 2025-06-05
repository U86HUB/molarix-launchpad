
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSession } from '@/types/dashboard';

const isDebugMode = () => localStorage.getItem('debugMode') === 'true';

export const useFetchWebsites = () => {
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchWebsites = async () => {
    if (!user) {
      if (isDebugMode()) console.log('🚫 No user found, skipping fetch');
      return;
    }

    setLoading(true);
    try {
      if (isDebugMode()) console.log('🔄 Fetching websites for user:', user.id);
      
      const { data, error } = await supabase
        .from('websites')
        .select(`
          id, 
          name, 
          created_at, 
          updated_at, 
          status,
          template_type,
          primary_color, 
          clinic_id,
          created_by,
          clinic:clinics(
            id,
            name,
            address,
            phone,
            email,
            logo_url
          )
        `)
        .eq('created_by', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        if (isDebugMode()) console.error('❌ Supabase error:', error);
        throw error;
      }

      if (isDebugMode()) {
        console.log('✅ Websites fetched successfully:', data?.length || 0);
        console.log('📋 Raw websites data:', data);
        console.log('🔍 Filtered websites:', data?.map(w => ({ 
          id: w.id, 
          name: w.name, 
          clinic_id: w.clinic_id,
          created_by: w.created_by,
          sourceTable: 'websites'
        })));
      }

      // Transform websites data to match DashboardSession interface
      const transformedSessions: DashboardSession[] = (data || []).map(website => ({
        id: website.id,
        clinic_name: website.name,
        created_at: website.created_at,
        last_updated: website.updated_at,
        completion_score: website.status === 'published' ? 100 : 
                          website.status === 'draft' ? 25 : 50,
        selected_template: website.template_type || 'template-a',
        logo_url: website.clinic?.logo_url || null,
        primary_color: website.primary_color,
        clinic_id: website.clinic_id,
        clinic: website.clinic,
        created_by: website.created_by
      }));

      if (isDebugMode()) {
        console.log('🔄 Transformed sessions:', transformedSessions);
        console.log('🔍 Sessions with valid clinic_id:', transformedSessions.filter(s => s.clinic_id));
        console.log('⚠️ Sessions without clinic_id:', transformedSessions.filter(s => !s.clinic_id));
        console.log('⚠️ Sessions without created_by:', transformedSessions.filter(s => !s.created_by));
      }

      // Filter out any sessions without proper ownership or clinic linkage
      const validSessions = transformedSessions.filter(session => {
        const isValid = session.created_by === user.id && session.clinic_id;
        if (!isValid && isDebugMode()) {
          console.warn('🚫 Skipping invalid session:', {
            id: session.id,
            clinic_name: session.clinic_name,
            has_created_by: !!session.created_by,
            created_by_matches: session.created_by === user.id,
            has_clinic_id: !!session.clinic_id
          });
        }
        return isValid;
      });

      if (isDebugMode()) {
        console.log('✅ Final valid sessions:', validSessions.length);
        console.log('📊 Session breakdown:', {
          total_fetched: data?.length || 0,
          transformed: transformedSessions.length,
          valid_final: validSessions.length,
          filtered_out: transformedSessions.length - validSessions.length
        });
      }

      setSessions(validSessions);
    } catch (error) {
      console.error('❌ Error fetching websites:', error);
      if (isDebugMode()) {
        console.error('🔍 Detailed error:', {
          error,
          user_id: user.id,
          timestamp: new Date().toISOString()
        });
      }
      toast({
        title: "Error",
        description: "Failed to load your websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  return {
    sessions,
    loading,
    setSessions,
    refreshSessions: fetchWebsites,
  };
};
