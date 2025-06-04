
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSessionCopy } from '@/hooks/useSessionCopy';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Copy, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface EnhancedSessionCardProps {
  session: DashboardSession;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate?: () => void;
}

const EnhancedSessionCard = ({ 
  session, 
  onContinueEditing, 
  onPreview, 
  onDelete, 
  onDuplicate,
  onUpdate 
}: EnhancedSessionCardProps) => {
  const { status } = useSessionStatus(session);
  const { copy, loading: copyLoading } = useSessionCopy(session.id);
  const { toast } = useToast();

  const getStatusBadge = () => {
    switch (status) {
      case 'Ready to Publish':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ready to Publish
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800">
            In Progress
          </Badge>
        );
      case 'Draft':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Incomplete Copy
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <TooltipProvider>
      <Card className="hover:shadow-md transition-all duration-200 border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {session.clinic_name || 'Untitled Clinic'}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-sm text-muted-foreground">
                  Template: <span className="font-medium">{session.selected_template || 'None'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {getStatusBadge()}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Last updated info */}
            <div className="text-xs text-muted-foreground">
              Last updated: {dayjs(session.last_updated || session.created_at).fromNow()}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={() => onContinueEditing(session.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Continue Editing
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit AI content and design</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onPreview(session.id)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your site with current content</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDuplicate(session.id, session.clinic_name || 'Untitled')}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Duplicate
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Make a copy of this site draft</p>
                </TooltipContent>
              </Tooltip>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDelete(session.id, session.clinic_name || 'Untitled')}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedSessionCard;
