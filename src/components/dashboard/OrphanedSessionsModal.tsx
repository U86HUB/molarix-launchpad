
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calendar, Building2 } from 'lucide-react';
import { useOrphanedSessions } from '@/hooks/useOrphanedSessions';
import { useUserClinics } from '@/hooks/useUserClinics';
import { formatDistanceToNow } from 'date-fns';

interface OrphanedSession {
  id: string;
  clinic_name: string;
  created_at: string;
  last_updated: string;
  created_by: string;
}

interface OrphanedSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orphanedSessions: OrphanedSession[];
}

export const OrphanedSessionsModal = ({
  isOpen,
  onClose,
  orphanedSessions
}: OrphanedSessionsModalProps) => {
  const { clinics } = useUserClinics();
  const { reassignSessionToClinic } = useOrphanedSessions();
  const [selectedClinics, setSelectedClinics] = useState<Record<string, string>>({});
  const [reassigning, setReassigning] = useState<Record<string, boolean>>({});

  const handleReassign = async (sessionId: string) => {
    const clinicId = selectedClinics[sessionId];
    if (!clinicId) return;

    setReassigning(prev => ({ ...prev, [sessionId]: true }));
    
    const success = await reassignSessionToClinic(sessionId, clinicId);
    
    setReassigning(prev => ({ ...prev, [sessionId]: false }));
    
    if (success) {
      // Remove from local state
      setSelectedClinics(prev => {
        const newState = { ...prev };
        delete newState[sessionId];
        return newState;
      });
    }
  };

  const handleClinicSelect = (sessionId: string, clinicId: string) => {
    setSelectedClinics(prev => ({ ...prev, [sessionId]: clinicId }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Unassigned Websites
          </DialogTitle>
          <DialogDescription>
            These websites are not assigned to any clinic. Assign them to better organize your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {orphanedSessions.map((session) => (
            <Card key={session.id} className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{session.clinic_name || 'Unnamed Website'}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(session.last_updated))} ago
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select
                      value={selectedClinics[session.id] || ''}
                      onValueChange={(value) => handleClinicSelect(session.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a clinic to assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((clinic) => (
                          <SelectItem key={clinic.id} value={clinic.id}>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {clinic.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => handleReassign(session.id)}
                    disabled={!selectedClinics[session.id] || reassigning[session.id]}
                    className="shrink-0"
                  >
                    {reassigning[session.id] ? 'Assigning...' : 'Assign'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {orphanedSessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">All websites are assigned!</p>
              <p>Great job keeping your dashboard organized.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
