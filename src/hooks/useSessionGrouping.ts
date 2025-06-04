
import { useMemo } from 'react';
import { groupBy } from 'lodash';
import dayjs from 'dayjs';
import { DashboardSession } from './useDashboardSessions';

export type GroupingType = 'date' | 'template' | 'clinic';

interface SessionGroup {
  title: string;
  sessions: DashboardSession[];
  order: number;
}

export const useSessionGrouping = (sessions: DashboardSession[], groupingType: GroupingType): SessionGroup[] => {
  const groupedSessions = useMemo(() => {
    if (groupingType === 'date') {
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
    } else if (groupingType === 'clinic') {
      // Group by clinic
      const clinicGroups = groupBy(sessions, session => {
        return session.clinic?.name || session.clinic_name || 'No Clinic';
      });
      
      return Object.entries(clinicGroups).map(([clinicName, sessionsList]) => ({
        title: clinicName,
        sessions: sessionsList as DashboardSession[],
        order: clinicName === 'No Clinic' ? 999 : 0
      })).sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      });
    } else {
      // Group by template - use lodash groupBy function correctly
      const templateGroups = groupBy(sessions, session => session.selected_template || 'No Template');
      
      return Object.entries(templateGroups).map(([template, sessionsList]) => ({
        title: template,
        sessions: sessionsList as DashboardSession[],
        order: template === 'No Template' ? 999 : Number(template.replace(/\D/g, '')) || 0
      })).sort((a, b) => a.order - b.order);
    }
  }, [sessions, groupingType]);

  return groupedSessions;
};
