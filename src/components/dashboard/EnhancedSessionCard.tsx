
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSessionCopy } from '@/hooks/useSessionCopy';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Copy, Trash2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
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
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800 font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ready to Publish
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800 font-medium">
            In Progress
          </Badge>
        );
      case 'Draft':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800 font-medium">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Incomplete Copy
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-medium">
            {status}
          </Badge>
        );
    }
  };

  const getTemplateBadge = () => {
    if (!session.selected_template) return null;
    
    const templateName = session.selected_template.replace('template-', 'Template ').toUpperCase();
    return (
      <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 text-xs">
        {templateName}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                {session.clinic_name || 'Untitled Clinic'}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {getTemplateBadge()}
                {getStatusBadge()}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Last updated info with icon */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Last updated: {dayjs(session.last_updated || session.created_at).fromNow()}</span>
            </div>
            
            {/* Enhanced action buttons with improved styling */}
            <div className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={() => onContinueEditing(session.id)}
                    className="flex-1 min-w-[140px] flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-medium transition-colors duration-200"
                  >
                    <Edit className="h-3 w-3" />
                    Continue Editing
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit your latest draft content</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onPreview(session.id)}
                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 font-medium transition-colors duration-200"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View saved content in your chosen template</p>
                </TooltipContent>
              </Tooltip>
              
              <div className="flex gap-2 ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDuplicate(session.id, session.clinic_name || 'Untitled')}
                      className="flex items-center gap-1 px-3 border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Make a copy of this site draft</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDelete(session.id, session.clinic_name || 'Untitled')}
                      className="flex items-center gap-1 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 border-red-200 dark:border-red-800 transition-colors duration-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this website project</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedSessionCard;
