import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSessionCopy } from '@/hooks/useSessionCopy';
import { Calendar, Eye, Edit, Trash2, Building, Clock, Copy } from 'lucide-react';
import { InlineEditableText } from '@/components/ui/inline-editable-text';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TemplateThumbnail from './TemplateThumbnail';
import CopySuggestions from './CopySuggestions';

interface SessionCardProps {
  session: DashboardSession;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate?: () => void;
}

const SessionCard = ({ 
  session, 
  onContinueEditing, 
  onPreview, 
  onDelete, 
  onDuplicate,
  onUpdate 
}: SessionCardProps) => {
  const { status } = useSessionStatus(session);
  const { copy, loading: copyLoading } = useSessionCopy(session.id);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'Published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Published</Badge>;
      case 'Ready to Publish':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Ready to Publish</Badge>;
      case 'In Progress':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In Progress</Badge>;
      case 'Draft':
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const handleSaveClinicName = async (newName: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_sessions')
        .update({ 
          clinic_name: newName,
          last_updated: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Clinic name updated successfully",
      });

      // Trigger refresh of the sessions list
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating clinic name:', error);
      toast({
        title: "Error",
        description: "Failed to update clinic name",
        variant: "destructive",
      });
      throw error; // Re-throw to trigger revert in useInlineEdit
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {session.logo_url ? (
              <img 
                src={session.logo_url} 
                alt={`${session.clinic_name} logo`}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: session.primary_color || '#4f46e5' }}
              >
                <Building className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <InlineEditableText
                value={session.clinic_name || ''}
                onSave={handleSaveClinicName}
                placeholder="Untitled Clinic"
                variant="title"
                className="mb-1"
              />
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                <CardDescription className="text-xs">
                  Created {formatDate(session.created_at)}
                </CardDescription>
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Template Thumbnail */}
          {session.selected_template && (
            <div className="w-full h-32 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <TemplateThumbnail 
                templateId={session.selected_template}
                templateName={`Template ${session.selected_template}`}
                className="w-full h-full"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Template: <span className="font-medium">{session.selected_template || 'Not selected'}</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Status: <span className="font-medium">{status}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              Last updated {formatTimeAgo(session.last_updated || session.created_at)}
            </div>
          </div>

          {/* AI Copy Suggestions */}
          {!copyLoading && (
            <CopySuggestions 
              copy={copy} 
              sessionId={session.id}
              onEditClick={() => onContinueEditing(session.id)}
            />
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onContinueEditing(session.id)}
              className="flex-1 flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Continue Editing
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onPreview(session.id)}
              className="flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              Preview
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDuplicate(session.id, session.clinic_name || 'Untitled Clinic')}
              className="flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Duplicate
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDelete(session.id, session.clinic_name || 'Untitled Clinic')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
