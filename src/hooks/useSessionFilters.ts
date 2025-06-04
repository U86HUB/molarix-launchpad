
import { useMemo } from 'react';
import { DashboardSession } from './useDashboardSessions';
import { SessionStatus } from './useSessionStatus';

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
export type FilterOption = 'all' | 'draft' | 'in-progress' | 'ready-to-publish' | 'published';

interface UseSessionFiltersProps {
  sessions: DashboardSession[];
  sortBy: SortOption;
  filterBy: FilterOption;
  sessionStatuses: Record<string, SessionStatus>;
}

export const useSessionFilters = ({ 
  sessions, 
  sortBy, 
  filterBy, 
  sessionStatuses 
}: UseSessionFiltersProps) => {
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = [...sessions];

    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(session => {
        const status = sessionStatuses[session.id];
        switch (filterBy) {
          case 'draft':
            return status === 'Draft';
          case 'in-progress':
            return status === 'In Progress';
          case 'ready-to-publish':
            return status === 'Ready to Publish';
          case 'published':
            return status === 'Published';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.last_updated || b.created_at).getTime() - 
                 new Date(a.last_updated || a.created_at).getTime();
        case 'oldest':
          return new Date(a.last_updated || a.created_at).getTime() - 
                 new Date(b.last_updated || b.created_at).getTime();
        case 'a-z':
          return (a.clinic_name || 'Untitled').localeCompare(b.clinic_name || 'Untitled');
        case 'z-a':
          return (b.clinic_name || 'Untitled').localeCompare(a.clinic_name || 'Untitled');
        default:
          return 0;
      }
    });

    return filtered;
  }, [sessions, sortBy, filterBy, sessionStatuses]);

  return {
    filteredSessions: filteredAndSortedSessions,
    totalCount: sessions.length,
    filteredCount: filteredAndSortedSessions.length
  };
};
