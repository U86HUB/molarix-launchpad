
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardSession } from './useDashboardSessions';

export type SessionStatus = 'Draft' | 'In Progress' | 'Ready to Publish' | 'Published';

interface SessionStatusInfo {
  status: SessionStatus;
  hasAiCopy: boolean;
  hasEdits: boolean;
  isProvisioned: boolean;
}

export const useSessionStatus = (session: DashboardSession): SessionStatusInfo => {
  const [statusInfo, setStatusInfo] = useState<SessionStatusInfo>({
    status: 'Draft',
    hasAiCopy: false,
    hasEdits: false,
    isProvisioned: false
  });

  useEffect(() => {
    const determineStatus = async () => {
      try {
        // Check for AI generated copy
        const { data: aiCopy } = await supabase
          .from('ai_generated_copy')
          .select('id, type')
          .eq('session_id', session.id);

        const hasAiCopy = (aiCopy && aiCopy.length > 0) || false;
        
        // Check for different types of copy to determine edits vs original AI copy
        const hasCompleteCopy = aiCopy?.some(copy => copy.type === 'complete_copy') || false;
        const hasDraftCopy = aiCopy?.some(copy => copy.type === 'draft') || false;
        const hasPublishedCopy = aiCopy?.some(copy => copy.type === 'published') || false;
        
        // Determine if there are edits (multiple entries or specific types indicate editing)
        const hasEdits = aiCopy ? aiCopy.length > 1 || hasCompleteCopy : false;
        
        // Check if provisioned (future functionality - for now always false)
        const isProvisioned = false; // TODO: Implement provisioning check when available
        
        // Determine status based on heuristics
        let status: SessionStatus = 'Draft';
        
        if (isProvisioned) {
          status = 'Published';
        } else if (hasCompleteCopy || (hasEdits && hasAiCopy)) {
          status = 'Ready to Publish';
        } else if (hasAiCopy && !hasEdits) {
          status = 'In Progress';
        } else {
          status = 'Draft';
        }

        setStatusInfo({
          status,
          hasAiCopy,
          hasEdits,
          isProvisioned
        });
      } catch (error) {
        console.error('Error determining session status:', error);
        // Default to Draft on error
        setStatusInfo({
          status: 'Draft',
          hasAiCopy: false,
          hasEdits: false,
          isProvisioned: false
        });
      }
    };

    determineStatus();
  }, [session.id]);

  return statusInfo;
};

// Export a utility function to get statuses for multiple sessions
export const useMultipleSessionStatuses = (sessions: DashboardSession[]) => {
  const [statuses, setStatuses] = useState<Record<string, SessionStatus>>({});

  useEffect(() => {
    const getMultipleStatuses = async () => {
      const statusMap: Record<string, SessionStatus> = {};
      
      for (const session of sessions) {
        try {
          const { data: aiCopy } = await supabase
            .from('ai_generated_copy')
            .select('id, type')
            .eq('session_id', session.id);

          const hasAiCopy = (aiCopy && aiCopy.length > 0) || false;
          const hasCompleteCopy = aiCopy?.some(copy => copy.type === 'complete_copy') || false;
          const hasEdits = aiCopy ? aiCopy.length > 1 || hasCompleteCopy : false;
          
          let status: SessionStatus = 'Draft';
          
          if (hasCompleteCopy || (hasEdits && hasAiCopy)) {
            status = 'Ready to Publish';
          } else if (hasAiCopy && !hasEdits) {
            status = 'In Progress';
          } else {
            status = 'Draft';
          }

          statusMap[session.id] = status;
        } catch (error) {
          console.error(`Error determining status for session ${session.id}:`, error);
          statusMap[session.id] = 'Draft';
        }
      }
      
      setStatuses(statusMap);
    };

    if (sessions.length > 0) {
      getMultipleStatuses();
    }
  }, [sessions]);

  return statuses;
};
