
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";

interface TemplatePreviewEmptyStatesProps {
  sessionData: any;
  noPublishedCopyFound: boolean;
  sessionId: string | null;
}

const TemplatePreviewEmptyStates = ({ 
  sessionData, 
  noPublishedCopyFound, 
  sessionId 
}: TemplatePreviewEmptyStatesProps) => {
  const navigate = useNavigate();

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <EmptyState
          title="Session Not Found"
          description="The onboarding session could not be found."
          actions={[
            {
              label: 'Go Back',
              onClick: () => navigate(-1),
              variant: 'default',
              icon: ArrowLeft,
            }
          ]}
        />
      </div>
    );
  }

  if (noPublishedCopyFound) {
    return (
      <EmptyState
        title="No Published Version Available"
        description="No published version available yet. Please publish from editing mode first."
        actions={[
          {
            label: 'Go to Editing Mode',
            onClick: () => navigate(`/ai-copy-preview?sessionId=${sessionId}&mode=edit`),
            variant: 'default',
          },
          {
            label: 'Go Back',
            onClick: () => navigate(-1),
            variant: 'outline',
            icon: ArrowLeft,
          }
        ]}
      />
    );
  }

  return null;
};

export default TemplatePreviewEmptyStates;
