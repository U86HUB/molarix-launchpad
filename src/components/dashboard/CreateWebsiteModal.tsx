
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2 } from 'lucide-react';
import { CreateWebsiteForm } from './CreateWebsiteForm';

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWebsiteModal = ({ isOpen, onClose }: CreateWebsiteModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Website
          </DialogTitle>
          <DialogDescription>
            Create a new website for one of your clinics. You can start with a template and customize it later.
          </DialogDescription>
        </DialogHeader>

        <CreateWebsiteForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
