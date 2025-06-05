
import { AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MissingContentFallbackProps {
  type: 'sections' | 'copy' | 'clinics' | 'websites';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const MissingContentFallback = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  onRetry,
  showRetry = false
}: MissingContentFallbackProps) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'sections':
        return {
          title: 'No Sections Found',
          description: 'Your website doesn\'t have any sections yet. Add sections to build your website.',
          actionLabel: 'Add First Section'
        };
      case 'copy':
        return {
          title: 'No Content Available',
          description: 'AI-generated content is not available for this section. You can still customize it manually.',
          actionLabel: 'Generate Content'
        };
      case 'clinics':
        return {
          title: 'No Clinics Found',
          description: 'You haven\'t created any clinics yet. Create your first clinic to get started.',
          actionLabel: 'Create Clinic'
        };
      case 'websites':
        return {
          title: 'No Websites Found',
          description: 'You haven\'t created any websites yet. Create your first website to get started.',
          actionLabel: 'Create Website'
        };
      default:
        return {
          title: 'Content Not Available',
          description: 'The requested content could not be loaded.',
          actionLabel: 'Try Again'
        };
    }
  };

  const defaultContent = getDefaultContent();

  return (
    <Card className="border-dashed border-2 bg-gray-50 dark:bg-gray-900/50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-gray-400" />
        </div>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
          {title || defaultContent.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {description || defaultContent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <div className="flex gap-3 justify-center">
          {onAction && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel || defaultContent.actionLabel}
            </Button>
          )}
          {showRetry && onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissingContentFallback;
