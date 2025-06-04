
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
  // Always show enhanced clinic view when grouping by clinic (which is now the default)
  // or when filtering by a specific clinic
  if (groupBy === 'clinic' || selectedClinicId) {
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

  if (sessions.length === 0) {
    const hasActiveFilters = searchQuery || selectedClinicId;
    
    return (
      <EmptyState
        icon={hasActiveFilters ? Search : Filter}
        title={hasActiveFilters ? 'No websites match your filters' : 'No websites found'}
        description={
          hasActiveFilters
            ? 'Try adjusting your search or clinic filter to see more results'
            : 'Create your first website to get started'
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
            label: hasActiveFilters ? 'Reset All Filters' : 'Create Website',
            onClick: hasActiveFilters ? onResetAllFilters : onCreateWebsite,
            variant: hasActiveFilters ? 'outline' as const : 'default' as const,
            icon: hasActiveFilters ? RotateCcw : undefined,
          }
        ]}
        suggestions={hasActiveFilters ? [
          'Check your spelling in the search box',
          'Try selecting a different clinic',
          'Remove some filter criteria',
          'Use broader search terms'
        ] : [
          'Add your first clinic and create a website',
          'Import existing websites if you have them',
          'Explore available templates',
          'Set up your clinic profile first'
        ]}
      />
    );
  }

  // Fallback to other grouping views for non-clinic grouping
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
