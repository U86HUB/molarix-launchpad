
import { useMemo } from 'react';
import { DashboardSession } from './useDashboardSessions';

interface ClinicGroup {
  clinicId: string | null;
  clinicName: string;
  sessions: DashboardSession[];
  order: number;
}

export const useClinicGrouping = (sessions: DashboardSession[], selectedClinicId?: string): ClinicGroup[] => {
  const groupedSessions = useMemo(() => {
    // If a specific clinic is selected, filter sessions for that clinic only
    const filteredSessions = selectedClinicId 
      ? sessions.filter(session => session.clinic_id === selectedClinicId)
      : sessions;

    // Group sessions by clinic
    const clinicMap = new Map<string, ClinicGroup>();

    filteredSessions.forEach(session => {
      const clinicId = session.clinic_id || 'no-clinic';
      const clinicName = session.clinic?.name || session.clinic_name || 'Untitled Clinic';
      
      if (!clinicMap.has(clinicId)) {
        clinicMap.set(clinicId, {
          clinicId: session.clinic_id || null,
          clinicName,
          sessions: [],
          order: clinicId === 'no-clinic' ? 999 : 0
        });
      }
      
      clinicMap.get(clinicId)!.sessions.push(session);
    });

    // Convert to array and sort
    return Array.from(clinicMap.values()).sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.clinicName.localeCompare(b.clinicName);
    });
  }, [sessions, selectedClinicId]);

  return groupedSessions;
};
