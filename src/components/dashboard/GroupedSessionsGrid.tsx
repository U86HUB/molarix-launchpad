
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionGrouping, GroupingType } from '@/hooks/useSessionGrouping';
import EnhancedSessionCard from './EnhancedSessionCard';

interface GroupedSessionsGridProps {
  sessions: DashboardSession[];
  groupBy: GroupingType;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate?: () => void;
}

const GroupedSessionsGrid = ({
  sessions,
  groupBy,
  onContinueEditing,
  onPreview,
  onDelete,
  onDuplicate,
  onUpdate
}: GroupedSessionsGridProps) => {
  const groupedSessions = useSessionGrouping(sessions, groupBy);

  return (
    <div className="space-y-8">
      {groupedSessions.map((group) => (
        <div key={group.title} className="space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {group.title}
            </h3>
            <p className="text-sm text-muted-foreground">
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

export default GroupedSessionsGrid;
