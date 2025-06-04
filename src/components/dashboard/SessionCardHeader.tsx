
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader } from "@/components/ui/card";
import { Building, Calendar } from 'lucide-react';
import { InlineEditableText } from '@/components/ui/inline-editable-text';
import { DashboardSession } from '@/types/dashboard';
import { SessionStatus } from '@/hooks/useSessionStatus';

interface SessionCardHeaderProps {
  session: DashboardSession;
  status: SessionStatus;
  onSaveClinicName: (newName: string) => Promise<void>;
}

const SessionCardHeader = ({ session, status, onSaveClinicName }: SessionCardHeaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
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
              onSave={onSaveClinicName}
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
  );
};

export default SessionCardHeader;
