
import { Card } from "@/components/ui/card";
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { useSessionCopy } from '@/hooks/useSessionCopy';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SessionCardHeader from './SessionCardHeader';
import SessionCardContent from './SessionCardContent';

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
      <SessionCardHeader 
        session={session} 
        status={status} 
        onSaveClinicName={handleSaveClinicName} 
      />
      
      <SessionCardContent
        session={session}
        status={status}
        copy={copy}
        copyLoading={copyLoading}
        onContinueEditing={onContinueEditing}
        onPreview={onPreview}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    </Card>
  );
};

export default SessionCard;
