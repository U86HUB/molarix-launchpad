
import { DashboardSession } from '@/types/dashboard';
import { GroupingType } from '@/hooks/useSessionGrouping';
import DashboardEmpty from './DashboardEmpty';
import DashboardModals from './DashboardModals';
import DashboardGettingStarted from './DashboardGettingStarted';

interface DashboardEmptyContentProps {
  sessions: DashboardSession[];
  groupBy: GroupingType;
  showGettingStarted: boolean;
  setShowGettingStarted: (show: boolean) => void;
  previewSessionId: string | null;
  isPreviewModalOpen: boolean;
  isCreateModalOpen: boolean;
  onCreateWebsite: () => void;
  onClosePreviewModal: () => void;
  onCloseCreateModal: () => void;
}

const DashboardEmptyContent = ({
  sessions,
  groupBy,
  showGettingStarted,
  setShowGettingStarted,
  previewSessionId,
  isPreviewModalOpen,
  isCreateModalOpen,
  onCreateWebsite,
  onClosePreviewModal,
  onCloseCreateModal
}: DashboardEmptyContentProps) => {
  // Show empty state for first-time users only if they have no sessions AND no clinics
  if (sessions.length === 0 && groupBy !== 'clinic') {
    return (
      <div className="mt-12">
        <DashboardGettingStarted
          sessions={sessions}
          showGettingStarted={showGettingStarted}
          setShowGettingStarted={setShowGettingStarted}
          onCreateWebsite={onCreateWebsite}
        />
        <DashboardEmpty onCreateNew={onCreateWebsite} />
        <DashboardModals
          previewSessionId={previewSessionId}
          isPreviewModalOpen={isPreviewModalOpen}
          isCreateModalOpen={isCreateModalOpen}
          onClosePreviewModal={onClosePreviewModal}
          onCloseCreateModal={onCloseCreateModal}
        />
      </div>
    );
  }

  return null;
};

export default DashboardEmptyContent;
