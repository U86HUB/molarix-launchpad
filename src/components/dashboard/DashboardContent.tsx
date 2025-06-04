
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useDashboardState } from '@/hooks/useDashboardState';
import DashboardEmptyContent from './DashboardEmptyContent';
import DashboardMainContent from './DashboardMainContent';
import { OrphanedSessionsAlert } from './OrphanedSessionsAlert';

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
  const {
    sortBy,
    filterBy,
    groupBy,
    selectedClinicId,
    searchQuery,
    previewSessionId,
    isPreviewModalOpen,
    isCreateModalOpen,
    showGettingStarted,
    setSortBy,
    setFilterBy,
    setGroupBy,
    setSelectedClinicId,
    setSearchQuery,
    setPreviewSessionId,
    setIsPreviewModalOpen,
    setIsCreateModalOpen,
    setShowGettingStarted,
    handleClearFilters,
    handleResetAllFilters,
  } = useDashboardState();

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
    console.log('🗑️ Delete button clicked for session:', { sessionId, clinicName });
    
    if (confirm(`Are you sure you want to delete "${clinicName}"? This action cannot be undone.`)) {
      console.log('✅ User confirmed deletion');
      
      const success = await deleteSession(sessionId);
      console.log('🔄 Deletion result:', success);
      
      if (success) {
        console.log('🔄 Session deleted successfully, no additional refresh needed');
        // No need to call refreshSessions here since deleteSession already updates local state
        // and we want to avoid unnecessary network calls
      } else {
        console.log('❌ Deletion failed, attempting to refresh to sync state');
        // Only refresh if deletion failed to ensure UI is in sync with DB
        await refreshSessions();
      }
    } else {
      console.log('❌ User cancelled deletion');
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

  // Show empty content for first-time users only if they have no sessions AND groupBy is not 'clinic'
  if (sessions.length === 0 && groupBy !== 'clinic') {
    return (
      <DashboardEmptyContent
        sessions={sessions}
        groupBy={groupBy}
        showGettingStarted={showGettingStarted}
        setShowGettingStarted={setShowGettingStarted}
        previewSessionId={previewSessionId}
        isPreviewModalOpen={isPreviewModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        onCreateWebsite={handleCreateNew}
        onClosePreviewModal={handleClosePreviewModal}
        onCloseCreateModal={handleCloseCreateModal}
      />
    );
  }

  return (
    <>
      {/* Show orphaned sessions alert */}
      <OrphanedSessionsAlert onDismiss={() => refreshSessions()} />
      
      <DashboardMainContent
        sessions={sessions}
        sortBy={sortBy}
        filterBy={filterBy}
        groupBy={groupBy}
        selectedClinicId={selectedClinicId}
        searchQuery={searchQuery}
        showGettingStarted={showGettingStarted}
        previewSessionId={previewSessionId}
        isPreviewModalOpen={isPreviewModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        setSortBy={setSortBy}
        setFilterBy={setFilterBy}
        setGroupBy={setGroupBy}
        setSelectedClinicId={setSelectedClinicId}
        setSearchQuery={setSearchQuery}
        setShowGettingStarted={setShowGettingStarted}
        onContinueEditing={onContinueEditing}
        onPreview={handlePreview}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onUpdate={refreshSessions}
        onClearFilters={handleClearFilters}
        onResetAllFilters={handleResetAllFilters}
        onCreateWebsite={handleCreateNew}
        onClosePreviewModal={handleClosePreviewModal}
        onCloseCreateModal={handleCloseCreateModal}
      />
    </>
  );
};

export default DashboardContent;
