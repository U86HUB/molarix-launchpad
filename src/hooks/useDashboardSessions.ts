
import { useFetchWebsites } from './useFetchWebsites';
import { useDeleteSession } from './useDeleteSession';
import { useDuplicateSession } from './useDuplicateSession';

export type { DashboardSession } from '@/types/dashboard';

export const useDashboardSessions = () => {
  const { sessions, loading, setSessions, refreshSessions } = useFetchWebsites();
  const { deleteSession } = useDeleteSession(setSessions);
  const { duplicateSession } = useDuplicateSession();

  return {
    sessions,
    loading,
    refreshSessions,
    deleteSession,
    duplicateSession
  };
};
