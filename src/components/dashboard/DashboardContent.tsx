
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionFilters, SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { useMultipleSessionStatuses } from '@/hooks/useSessionStatus';
import { GroupingType } from '@/hooks/useSessionGrouping';
import DashboardStats from './DashboardStats';
import DashboardFiltersSection from './DashboardFiltersSection';
import DashboardEmpty from './DashboardEmpty';
import GroupedSessionsGrid from './GroupedSessionsGrid';
import ClinicGroupedSessionsGrid from './ClinicGroupedSessionsGrid';
import PreviewModal from './PreviewModal';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { Plus } from 'lucide-react';

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
    // Refresh sessions to get updated data after any publishes
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
    // Refresh sessions to show the newly created website
    refreshSessions();
  };

  // Show empty state for first-time users
  if (sessions.length === 0) {
    return (
      <div className="mt-12">
        <DashboardEmpty onCreateNew={handleCreateNew} />
        <CreateWebsiteModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
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
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your Clinic Websites</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and preview your dental clinic websites
          </p>
        </div>
        <Button 
          onClick={handleCreateNew} 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-md"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Create New Website
        </Button>
      </div>

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

      {searchFilteredSessions.length === 0 ? (
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
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedClinicId(undefined);
                  }} 
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Clear Filters
                </Button>
              )}
              <Button 
                onClick={() => {
                  setSortBy('newest');
                  setFilterBy('all');
                  setSearchQuery('');
                  setSelectedClinicId(undefined);
                }} 
                variant="outline"
              >
                Reset All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Show clinic-grouped sessions when clinic filter is applied or group by clinic
        selectedClinicId || groupBy === 'clinic' ? (
          <ClinicGroupedSessionsGrid
            sessions={searchFilteredSessions}
            selectedClinicId={selectedClinicId}
            onContinueEditing={onContinueEditing}
            onPreview={handlePreview}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onUpdate={refreshSessions}
          />
        ) : (
          <GroupedSessionsGrid
            sessions={searchFilteredSessions}
            groupBy={groupBy}
            onContinueEditing={onContinueEditing}
            onPreview={handlePreview}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onUpdate={refreshSessions}
          />
        )
      )}

      {/* Preview Modal */}
      <PreviewModal
        sessionId={previewSessionId}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
      />

      {/* Create Website Modal */}
      <CreateWebsiteModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  );
};

export default DashboardContent;
