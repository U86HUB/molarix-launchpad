
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useClinicGrouping } from '@/hooks/useClinicGrouping';
import EnhancedSessionCard from './EnhancedSessionCard';
import { Building2 } from 'lucide-react';

interface ClinicGroupedSessionsGridProps {
  sessions: DashboardSession[];
  selectedClinicId?: string;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate?: () => void;
}

const ClinicGroupedSessionsGrid = ({
  sessions,
  selectedClinicId,
  onContinueEditing,
  onPreview,
  onDelete,
  onDuplicate,
  onUpdate
}: ClinicGroupedSessionsGridProps) => {
  const clinicGroups = useClinicGrouping(sessions, selectedClinicId);

  return (
    <div className="space-y-8">
      {clinicGroups.map((group) => (
        <div key={group.clinicId || 'no-clinic'} className="space-y-4">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {group.clinicName}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {group.sessions.length} website{group.sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.sessions.map((session) => (
              <EnhancedSessionCard
                key={session.id}
                session={session}
                onContinueEditing={onContinueEditing}
                onPreview={onPreview}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClinicGroupedSessionsGrid;
