
import { useMemo } from 'react';
import { groupBy } from 'lodash';
import dayjs from 'dayjs';
import { DashboardSession } from './useDashboardSessions';

export type GroupingType = 'date' | 'template';

interface SessionGroup {
  title: string;
  sessions: DashboardSession[];
  order: number;
}

export const useSessionGrouping = (sessions: DashboardSession[], groupBy: GroupingType): SessionGroup[] => {
  const groupedSessions = useMemo(() => {
    if (groupBy === 'date') {
      const now = dayjs();
      const today = now.startOf('day');
      const sevenDaysAgo = now.subtract(7, 'days').startOf('day');

      const groups: SessionGroup[] = [
        { title: 'Today', sessions: [], order: 1 },
        { title: 'Last 7 Days', sessions: [], order: 2 },
        { title: 'Older', sessions: [], order: 3 }
      ];

      sessions.forEach(session => {
        const sessionDate = dayjs(session.created_at).startOf('day');
        
        if (sessionDate.isSame(today, 'day')) {
          groups[0].sessions.push(session);
        } else if (sessionDate.isAfter(sevenDaysAgo)) {
          groups[1].sessions.push(session);
        } else {
          groups[2].sessions.push(session);
        }
      });

      // Only return groups that have sessions
      return groups.filter(group => group.sessions.length > 0);
    } else {
      // Group by template - use lodash groupBy function correctly
      const templateGroups = groupBy(sessions, session => session.selected_template || 'No Template');
      
      return Object.entries(templateGroups).map(([template, sessions]) => ({
        title: template,
        sessions,
        order: template === 'No Template' ? 999 : Number(template.replace(/\D/g, '')) || 0
      })).sort((a, b) => a.order - b.order);
    }
  }, [sessions, groupBy]);

  return groupedSessions;
};
