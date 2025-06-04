
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { GroupingType } from '@/hooks/useSessionGrouping';
import GroupedSessionsGrid from './GroupedSessionsGrid';
import ClinicGroupedSessionsGrid from './ClinicGroupedSessionsGrid';

interface DashboardContentRendererProps {
  sessions: DashboardSession[];
  groupBy: GroupingType;
  selectedClinicId?: string;
  searchQuery: string;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate: () => void;
  onClearFilters: () => void;
  onResetAllFilters: () => void;
}

const DashboardContentRenderer = ({
  sessions,
  groupBy,
  selectedClinicId,
  searchQuery,
  onContinueEditing,
  onPreview,
  onDelete,
  onDuplicate,
  onUpdate,
  onClearFilters,
  onResetAllFilters
}: DashboardContentRendererProps) => {
  if (sessions.length === 0) {
    return (
      <Card className="text-center py-12 shadow-sm border-border bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">
            {searchQuery || selectedClinicId ? 'No websites match your filters' : 'No websites match your filters'}
          </CardTitle>
          <CardDescription className="text-base">
            {searchQuery || selectedClinicId
              ? `Try adjusting your search or clinic filter to see more results`
              : `Try adjusting your sort and filter options to see more results`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(searchQuery || selectedClinicId) && (
              <Button 
                onClick={onClearFilters} 
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Clear Filters
              </Button>
            )}
            <Button 
              onClick={onResetAllFilters} 
              variant="outline"
            >
              Reset All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show clinic-grouped sessions when clinic filter is applied or group by clinic
  if (selectedClinicId || groupBy === 'clinic') {
    return (
      <ClinicGroupedSessionsGrid
        sessions={sessions}
        selectedClinicId={selectedClinicId}
        onContinueEditing={onContinueEditing}
        onPreview={onPreview}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <GroupedSessionsGrid
      sessions={sessions}
      groupBy={groupBy}
      onContinueEditing={onContinueEditing}
      onPreview={onPreview}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onUpdate={onUpdate}
    />
  );
};

export default DashboardContentRenderer;
