
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, BarChart3, Eye, Building2 } from 'lucide-react';

interface QuickActionsProps {
  onCreateWebsite: () => void;
  clinicsCount: number;
}

export const QuickActions = ({ onCreateWebsite, clinicsCount }: QuickActionsProps) => {
  if (clinicsCount === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No clinics found</h3>
          <p className="text-muted-foreground text-center mb-4">
            You need to create a clinic before you can build websites
          </p>
          <Button onClick={() => window.location.href = '/dashboard/clinic'}>
            <Building2 className="h-4 w-4 mr-2" />
            Go to Clinic Settings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onCreateWebsite}>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
          <h3 className="font-medium">Create New</h3>
          <p className="text-sm text-muted-foreground">Start a new website</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Settings className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
          <h3 className="font-medium">Templates</h3>
          <p className="text-sm text-muted-foreground">Browse templates</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
          <h3 className="font-medium">Analytics</h3>
          <p className="text-sm text-muted-foreground">View performance</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Eye className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
          <h3 className="font-medium">Preview</h3>
          <p className="text-sm text-muted-foreground">See live sites</p>
        </CardContent>
      </Card>
    </div>
  );
};
