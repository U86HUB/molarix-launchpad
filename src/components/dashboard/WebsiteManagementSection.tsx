
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Plus, Settings, BarChart3, Eye } from 'lucide-react';

export const WebsiteManagementSection = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your clinic websites
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Website
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
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

        {/* Website List */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Your Websites</CardTitle>
            </div>
            <CardDescription>
              Manage all your clinic websites from one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No websites yet</h3>
              <p className="mb-4">Create your first website to get started</p>
              <Button disabled>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coming Soon Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">Drag & drop website builder</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Mobile-responsive templates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm">SEO optimization tools</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Custom domain support</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Website Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm">Visitor tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Performance metrics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                <span className="text-sm">Conversion tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                <span className="text-sm">A/B testing tools</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
