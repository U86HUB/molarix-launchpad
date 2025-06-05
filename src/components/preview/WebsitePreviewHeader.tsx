
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { Website } from '@/types/website';
import TemplateSelectionControls from "./TemplateSelectionControls";

interface WebsitePreviewHeaderProps {
  website: Website;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onSaveTemplate: () => void;
  onEditWebsite: () => void;
  onBack: () => void;
  saving: boolean;
  hasUnsavedChanges: boolean;
}

const WebsitePreviewHeader = ({
  website,
  selectedTemplate,
  onTemplateChange,
  onSaveTemplate,
  onEditWebsite,
  onBack,
  saving,
  hasUnsavedChanges
}: WebsitePreviewHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {website.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Website Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TemplateSelectionControls
              selectedTemplate={selectedTemplate}
              onTemplateChange={onTemplateChange}
            />

            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Button
                  onClick={onSaveTemplate}
                  disabled={saving}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Template'}
                </Button>
              )}

              <Button
                onClick={onEditWebsite}
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Website
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreviewHeader;
