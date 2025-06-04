
import PreviewModal from './PreviewModal';
import { CreateWebsiteModal } from './CreateWebsiteModal';

interface DashboardModalsProps {
  previewSessionId: string | null;
  isPreviewModalOpen: boolean;
  isCreateModalOpen: boolean;
  onClosePreviewModal: () => void;
  onCloseCreateModal: () => void;
}

const DashboardModals = ({
  previewSessionId,
  isPreviewModalOpen,
  isCreateModalOpen,
  onClosePreviewModal,
  onCloseCreateModal
}: DashboardModalsProps) => {
  return (
    <>
      <PreviewModal
        sessionId={previewSessionId}
        isOpen={isPreviewModalOpen}
        onClose={onClosePreviewModal}
      />
      <CreateWebsiteModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
      />
    </>
  );
};

export default DashboardModals;
