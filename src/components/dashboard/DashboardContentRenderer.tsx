
import { Button } from "@/components/ui/button";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { GroupingType } from '@/hooks/useSessionGrouping';
import GroupedSessionsGrid from './GroupedSessionsGrid';
import EnhancedClinicGroupedView from './EnhancedClinicGroupedView';
import EmptyState from '@/components/ui/empty-state';
import { Search, Filter, RotateCcw } from 'lucide-react';

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
  onCreateWebsite?: () => void;
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
  onResetAllFilters,
  onCreateWebsite
}: DashboardContentRendererProps) => {
  if (sessions.length === 0 && !selectedClinicId && !searchQuery) {
    // Show enhanced clinic view even when no sessions exist to display clinics without websites
    if (groupBy === 'clinic') {
      return (
        <EnhancedClinicGroupedView
          sessions={sessions}
          selectedClinicId={selectedClinicId}
          onContinueEditing={onContinueEditing}
          onPreview={onPreview}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onUpdate={onUpdate}
          onCreateWebsite={onCreateWebsite}
        />
      );
    }
  }

  if (sessions.length === 0) {
    const hasActiveFilters = searchQuery || selectedClinicId;
    
    return (
      <EmptyState
        icon={hasActiveFilters ? Search : Filter}
        title={hasActiveFilters ? 'No websites match your filters' : 'No websites match your filters'}
        description={
          hasActiveFilters
            ? 'Try adjusting your search or clinic filter to see more results'
            : 'Try adjusting your sort and filter options to see more results'
        }
        actions={[
          ...(hasActiveFilters ? [
            {
              label: 'Clear Filters',
              onClick: onClearFilters,
              variant: 'outline' as const,
              icon: Filter,
            }
          ] : []),
          {
            label: 'Reset All Filters',
            onClick: onResetAllFilters,
            variant: 'outline' as const,
            icon: RotateCcw,
          }
        ]}
        suggestions={hasActiveFilters ? [
          'Check your spelling in the search box',
          'Try selecting a different clinic',
          'Remove some filter criteria',
          'Use broader search terms'
        ] : [
          'Try changing the sort order',
          'Adjust the status filter',
          'Check if you have any websites created',
          'Create a new website to get started'
        ]}
      />
    );
  }

  // Show enhanced clinic-grouped view when grouping by clinic or filtering by clinic
  if (selectedClinicId || groupBy === 'clinic') {
    return (
      <EnhancedClinicGroupedView
        sessions={sessions}
        selectedClinicId={selectedClinicId}
        onContinueEditing={onContinueEditing}
        onPreview={onPreview}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onUpdate={onUpdate}
        onCreateWebsite={onCreateWebsite}
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
