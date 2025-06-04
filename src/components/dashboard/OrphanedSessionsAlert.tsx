
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { useOrphanedSessions } from '@/hooks/useOrphanedSessions';
import { OrphanedSessionsModal } from './OrphanedSessionsModal';

interface OrphanedSessionsAlertProps {
  onDismiss?: () => void;
}

export const OrphanedSessionsAlert = ({ onDismiss }: OrphanedSessionsAlertProps) => {
  const { orphanedSessions, loading } = useOrphanedSessions();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (loading || orphanedSessions.length === 0 || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <>
      <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <div className="flex-1">
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            Unassigned Websites Found
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            You have {orphanedSessions.length} website{orphanedSessions.length !== 1 ? 's' : ''} that 
            {orphanedSessions.length === 1 ? ' is' : ' are'} not assigned to any clinic. 
            Assign them to a clinic to organize your websites better.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowModal(true)}
            className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700"
          >
            View & Assign
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 dark:text-amber-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>

      <OrphanedSessionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orphanedSessions={orphanedSessions}
      />
    </>
  );
};
