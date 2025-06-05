
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Plus } from 'lucide-react';
import { WebsiteCard } from './WebsiteCard';
import { Website } from '@/types/website';

interface WebsitesListProps {
  websites: Website[];
  onWebsiteDelete: (websiteId: string) => Promise<void>;
  onCreateWebsite: () => void;
}

export const WebsitesList = ({ websites, onWebsiteDelete, onCreateWebsite }: WebsitesListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <CardTitle>Your Websites</CardTitle>
        </div>
        <CardDescription>
          Manage all your clinic websites from one place ({websites.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {websites.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No websites yet</h3>
            <p className="mb-4">Create your first website to get started</p>
            <Button onClick={onCreateWebsite}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Website
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {websites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onDelete={onWebsiteDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
