
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Eye, Settings, BarChart3, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Website } from '@/types/website';

interface WebsiteCardProps {
  website: Website;
  onUpdate?: (website: Website) => void;
  onDelete?: (websiteId: string) => void;
}

export const WebsiteCard = ({ website, onUpdate, onDelete }: WebsiteCardProps) => {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTemplate = (template: string) => {
    return template.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const calculateCompletion = () => {
    // This is a placeholder calculation - in real app would be based on actual completion criteria
    let completion = 60; // Base completion for having basic info
    
    if (website.status === 'published') completion = 100;
    else if (website.status === 'draft') completion = 85;
    
    return completion;
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setDeleting(true);
    try {
      await onDelete(website.id);
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = () => {
    navigate(`/website-preview/${website.id}`);
  };

  const handleEdit = () => {
    navigate(`/website-builder/${website.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">{website.name}</h3>
              <p className="text-sm text-muted-foreground">
                {website.clinic?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(website.status)}>
              {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="text-muted-foreground">Template</label>
            <p className="font-medium">{formatTemplate(website.template_type)}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Last Updated</label>
            <p className="font-medium">
              {new Date(website.updated_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground">Completion</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${calculateCompletion()}%` }}
                />
              </div>
              <span className="font-medium text-xs">{calculateCompletion()}%</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={deleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Website</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{website.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Website
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
