
import { DashboardSession } from '@/types/dashboard';
import { useSessionFilters, SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { useMultipleSessionStatuses } from '@/hooks/useSessionStatus';
import { GroupingType } from '@/hooks/useSessionGrouping';
import DashboardStats from './DashboardStats';
import DashboardFiltersSection from './DashboardFiltersSection';
import DashboardActionsSection from './DashboardActionsSection';
import DashboardContentRenderer from './DashboardContentRenderer';
import DashboardModals from './DashboardModals';
import DashboardGettingStarted from './DashboardGettingStarted';

interface DashboardMainContentProps {
  sessions: DashboardSession[];
  sortBy: SortOption;
  filterBy: FilterOption;
  groupBy: GroupingType;
  selectedClinicId?: string;
  searchQuery: string;
  showGettingStarted: boolean;
  previewSessionId: string | null;
  isPreviewModalOpen: boolean;
  isCreateModalOpen: boolean;
  setSortBy: (sort: SortOption) => void;
  setFilterBy: (filter: FilterOption) => void;
  setGroupBy: (group: GroupingType) => void;
  setSelectedClinicId: (id?: string) => void;
  setSearchQuery: (query: string) => void;
  setShowGettingStarted: (show: boolean) => void;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate: () => void;
  onClearFilters: () => void;
  onResetAllFilters: () => void;
  onCreateWebsite: () => void;
  onClosePreviewModal: () => void;
  onCloseCreateModal: () => void;
}

const DashboardMainContent = ({
  sessions,
  sortBy,
  filterBy,
  groupBy,
  selectedClinicId,
  searchQuery,
  showGettingStarted,
  previewSessionId,
  isPreviewModalOpen,
  isCreateModalOpen,
  setSortBy,
  setFilterBy,
  setGroupBy,
  setSelectedClinicId,
  setSearchQuery,
  setShowGettingStarted,
  onContinueEditing,
  onPreview,
  onDelete,
  onDuplicate,
  onUpdate,
  onClearFilters,
  onResetAllFilters,
  onCreateWebsite,
  onClosePreviewModal,
  onCloseCreateModal
}: DashboardMainContentProps) => {
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

  return (
    <>
      <DashboardGettingStarted
        sessions={sessions}
        showGettingStarted={showGettingStarted}
        setShowGettingStarted={setShowGettingStarted}
        onCreateWebsite={onCreateWebsite}
      />

      {/* Enhanced Analytics Stats Section with background container */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 dark:border-gray-700/20 mb-8">
        <DashboardStats sessions={sessions} />
      </div>
      
      <DashboardActionsSection onCreateNew={onCreateWebsite} />

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
        onPreview={onPreview}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onUpdate={onUpdate}
        onClearFilters={onClearFilters}
        onResetAllFilters={onResetAllFilters}
        onCreateWebsite={onCreateWebsite}
      />

      <DashboardModals
        previewSessionId={previewSessionId}
        isPreviewModalOpen={isPreviewModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        onClosePreviewModal={onClosePreviewModal}
        onCloseCreateModal={onCloseCreateModal}
      />
    </>
  );
};

export default DashboardMainContent;
