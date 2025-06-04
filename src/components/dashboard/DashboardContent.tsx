
import { useState } from 'react';
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionFilters, SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { useMultipleSessionStatuses } from '@/hooks/useSessionStatus';
import { GroupingType } from '@/hooks/useSessionGrouping';
import DashboardStats from './DashboardStats';
import DashboardFiltersSection from './DashboardFiltersSection';
import DashboardEmpty from './DashboardEmpty';
import DashboardActionsSection from './DashboardActionsSection';
import DashboardContentRenderer from './DashboardContentRenderer';
import DashboardModals from './DashboardModals';

interface DashboardContentProps {
  sessions: DashboardSession[];
  refreshSessions: () => void;
  deleteSession: (sessionId: string) => Promise<boolean>;
  duplicateSession: (sessionId: string) => Promise<boolean>;
  onContinueEditing: (sessionId: string) => void;
}

const DashboardContent = ({ 
  sessions, 
  refreshSessions, 
  deleteSession, 
  duplicateSession,
  onContinueEditing 
}: DashboardContentProps) => {
  // Filtering, sorting, and grouping state
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupingType>('date');
  const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Preview modal state
  const [previewSessionId, setPreviewSessionId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Create website modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get session statuses for filtering
  const sessionStatuses = useMultipleSessionStatuses(sessions);

  const { filteredSessions, totalCount, filteredCount } = useSessionFilters({
    sessions,
    sortBy,
    filterBy,
    sessionStatuses
  });

  // Apply search filtering
  const searchFilteredSessions = filteredSessions.filter(session => {
    const matchesSearch = session.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         session.clinic?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesClinic = !selectedClinicId || session.clinic_id === selectedClinicId;
    return matchesSearch && matchesClinic;
  });

  const handlePreview = (sessionId: string) => {
    setPreviewSessionId(sessionId);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewSessionId(null);
    refreshSessions();
  };

  const handleDelete = async (sessionId: string, clinicName: string) => {
    if (confirm(`Are you sure you want to delete "${clinicName}"? This action cannot be undone.`)) {
      const success = await deleteSession(sessionId);
      if (success) {
        refreshSessions();
      }
    }
  };

  const handleDuplicate = async (sessionId: string, clinicName: string) => {
    if (confirm(`Do you want to create a copy of "${clinicName}"?`)) {
      const success = await duplicateSession(sessionId);
      if (success) {
        refreshSessions();
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    refreshSessions();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedClinicId(undefined);
  };

  const handleResetAllFilters = () => {
    setSortBy('newest');
    setFilterBy('all');
    setSearchQuery('');
    setSelectedClinicId(undefined);
  };

  // Show empty state for first-time users
  if (sessions.length === 0) {
    return (
      <div className="mt-12">
        <DashboardEmpty onCreateNew={handleCreateNew} />
        <DashboardModals
          previewSessionId={previewSessionId}
          isPreviewModalOpen={isPreviewModalOpen}
          isCreateModalOpen={isCreateModalOpen}
          onClosePreviewModal={handleClosePreviewModal}
          onCloseCreateModal={handleCloseCreateModal}
        />
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Analytics Stats Section with background container */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20 mb-8">
        <DashboardStats sessions={sessions} />
      </div>
      
      <DashboardActionsSection onCreateNew={handleCreateNew} />

      {/* Enhanced Filters with clinic filter and search functionality */}
      <DashboardFiltersSection
        sortBy={sortBy}
        filterBy={filterBy}
        groupBy={groupBy}
        selectedClinicId={selectedClinicId}
        searchQuery={searchQuery}
        totalCount={totalCount}
        filteredCount={searchQuery ? searchFilteredSessions.length : filteredCount}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
        onGroupChange={setGroupBy}
        onClinicChange={setSelectedClinicId}
        onSearchChange={setSearchQuery}
      />

      <DashboardContentRenderer
        sessions={searchFilteredSessions}
        groupBy={groupBy}
        selectedClinicId={selectedClinicId}
        searchQuery={searchQuery}
        onContinueEditing={onContinueEditing}
        onPreview={handlePreview}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onUpdate={refreshSessions}
        onClearFilters={handleClearFilters}
        onResetAllFilters={handleResetAllFilters}
      />

      <DashboardModals
        previewSessionId={previewSessionId}
        isPreviewModalOpen={isPreviewModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        onClosePreviewModal={handleClosePreviewModal}
        onCloseCreateModal={handleCloseCreateModal}
      />
    </>
  );
};

export default DashboardContent;
