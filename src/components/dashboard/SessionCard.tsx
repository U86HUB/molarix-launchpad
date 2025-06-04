import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { Calendar, Eye, Edit, Trash2, Building } from 'lucide-react';
import TemplateThumbnail from './TemplateThumbnail';

interface SessionCardProps {
  session: DashboardSession;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
}

const SessionCard = ({ session, onContinueEditing, onPreview, onDelete }: SessionCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = () => {
    // For now, we'll show all as "Draft" since we don't have a status field
    return <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {session.logo_url ? (
              <img 
                src={session.logo_url} 
                alt={`${session.clinic_name} logo`}
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: session.primary_color || '#4f46e5' }}
              >
                <Building className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{session.clinic_name || 'Untitled Clinic'}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-gray-500" />
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
          
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Template: <span className="font-medium">{session.selected_template || 'Not selected'}</span>
          </div>
          
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
