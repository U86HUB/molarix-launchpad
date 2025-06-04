
import { CardContent } from "@/components/ui/card";
import { DashboardSession } from '@/types/dashboard';
import { SessionStatus } from '@/hooks/useSessionStatus';
import { GeneratedCopy } from '@/types/copy';
import TemplateThumbnail from './TemplateThumbnail';
import CopySuggestions from './CopySuggestions';
import SessionCardInfo from './SessionCardInfo';
import SessionCardActions from './SessionCardActions';

interface SessionCardContentProps {
  session: DashboardSession;
  status: SessionStatus;
  copy: GeneratedCopy | null;
  copyLoading: boolean;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
}

const SessionCardContent = ({ 
  session, 
  status, 
  copy, 
  copyLoading, 
  onContinueEditing, 
  onPreview, 
  onDelete, 
  onDuplicate 
}: SessionCardContentProps) => {
  return (
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
        
        <SessionCardInfo session={session} status={status} />

        {/* AI Copy Suggestions */}
        {!copyLoading && (
          <CopySuggestions 
            copy={copy} 
            sessionId={session.id}
            onEditClick={() => onContinueEditing(session.id)}
          />
        )}
        
        <SessionCardActions
          sessionId={session.id}
          clinicName={session.clinic_name || 'Untitled Clinic'}
          onContinueEditing={onContinueEditing}
          onPreview={onPreview}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </div>
    </CardContent>
  );
};

export default SessionCardContent;
