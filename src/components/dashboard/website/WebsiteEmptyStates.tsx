
import { Plus, Building, Globe } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/ui/enhanced-empty-state';

interface WebsiteEmptyStatesProps {
  clinicsCount: number;
  websitesCount: number;
  onCreateWebsite: () => void;
  isCreating: boolean;
}

export const WebsiteEmptyStates = ({
  clinicsCount,
  websitesCount,
  onCreateWebsite,
  isCreating
}: WebsiteEmptyStatesProps) => {
  if (clinicsCount === 0) {
    return (
      <EnhancedEmptyState
        icon={Building}
        title="No Clinics Found"
        description="You need to create a clinic before you can build websites."
        illustration="create"
        actions={[
          {
            label: "Create First Clinic",
            onClick: () => {/* TODO: Implement clinic creation */},
            icon: Plus
          }
        ]}
        suggestions={[
          "A clinic profile is required to organize your websites",
          "You can create multiple clinics for different locations",
          "Each clinic can have its own branding and settings"
        ]}
      />
    );
  }

  if (websitesCount === 0) {
    return (
      <EnhancedEmptyState
        icon={Globe}
        title="No Websites Yet"
        description="Start building professional websites for your clinics."
        illustration="create"
        actions={[
          {
            label: "Create First Website",
            onClick: onCreateWebsite,
            loading: isCreating,
            icon: Plus
          }
        ]}
        suggestions={[
          "Choose from professionally designed templates",
          "AI-powered content generation",
          "Mobile-responsive and SEO optimized",
          "Easy drag-and-drop customization"
        ]}
      />
    );
  }

  return null;
};
