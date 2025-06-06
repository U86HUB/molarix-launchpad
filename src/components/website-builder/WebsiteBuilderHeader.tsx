
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';

interface WebsiteBuilderHeaderProps {
  websiteName: string;
  copyMode: 'draft' | 'published';
  setCopyMode: (mode: 'draft' | 'published') => void;
  saving: boolean;
  onPreviewClick?: () => void;
  onPublishClick?: () => void;
}

const WebsiteBuilderHeader = ({
  websiteName,
  copyMode,
  setCopyMode,
  saving,
  onPreviewClick,
  onPublishClick
}: WebsiteBuilderHeaderProps) => {
  return (
    <div className="border-b bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {websiteName}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Website Builder
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={copyMode === 'published' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCopyMode(copyMode === 'published' ? 'draft' : 'published')}
          >
            {copyMode === 'published' ? 'Published Copy' : 'Draft Copy'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPreviewClick}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            size="sm" 
            disabled={saving}
            onClick={onPublishClick}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilderHeader;
