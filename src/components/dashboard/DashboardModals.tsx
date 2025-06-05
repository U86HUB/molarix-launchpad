
import PreviewModal from './PreviewModal';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { Website } from '@/types/website';

interface Clinic {
  id: string;
  name: string;
}

interface DashboardModalsProps {
  previewSessionId: string | null;
  isPreviewModalOpen: boolean;
  isCreateModalOpen: boolean;
  onClosePreviewModal: () => void;
  onCloseCreateModal: () => void;
  onWebsiteCreate?: (website: Website) => void;
  clinics?: Clinic[];
}

const DashboardModals = ({
  previewSessionId,
  isPreviewModalOpen,
  isCreateModalOpen,
  onClosePreviewModal,
  onCloseCreateModal,
  onWebsiteCreate = () => {},
  clinics = []
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
        onWebsiteCreate={onWebsiteCreate}
        clinics={clinics}
      />
    </>
  );
};

export default DashboardModals;
