
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WebsiteManagementHeaderProps {
  onCreateWebsite: () => void;
  clinicsCount: number;
}

export const WebsiteManagementHeader = ({ onCreateWebsite, clinicsCount }: WebsiteManagementHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your clinic websites
        </p>
      </div>
      <Button 
        onClick={onCreateWebsite}
        disabled={clinicsCount === 0}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Website
      </Button>
    </div>
  );
};
