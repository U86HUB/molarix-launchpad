
import { useFetchSessions } from './useFetchSessions';
import { useDeleteSession } from './useDeleteSession';
import { useDuplicateSession } from './useDuplicateSession';

export { DashboardSession } from '@/types/dashboard';

export const useDashboardSessions = () => {
  const { sessions, loading, setSessions, refreshSessions } = useFetchSessions();
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
