
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, AlertTriangle } from 'lucide-react';
import { LinkedWebsite } from '@/services/clinicDeletionService';

interface ClinicDeletionWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicName: string;
  linkedWebsites: LinkedWebsite[];
}

export const ClinicDeletionWarningModal = ({
  open,
  onOpenChange,
  clinicName,
  linkedWebsites
}: ClinicDeletionWarningModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Cannot Delete Clinic</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>
              You must delete or reassign all websites linked to "{clinicName}" before deleting this clinic.
            </p>
            
            {linkedWebsites.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Linked websites ({linkedWebsites.length}):</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {linkedWebsites.map((website) => (
                    <div key={website.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{website.name}</span>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(website.status)}`}>
                        {website.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Please manage these websites first through the Website Management section.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
