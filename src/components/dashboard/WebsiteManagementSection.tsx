
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Settings, BarChart3, Eye, Building2, Loader2 } from 'lucide-react';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { WebsiteCard } from './website/WebsiteCard';

interface Website {
  id: string;
  name: string;
  template_type: string;
  status: 'draft' | 'published' | 'archived';
  clinic_id: string;
  created_at: string;
  updated_at: string;
  clinic?: {
    name: string;
  };
}

interface Clinic {
  id: string;
  name: string;
}

export const WebsiteManagementSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUserClinics = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('created_by', user.id);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching clinics:', error);
      toast({
        title: "Error",
        description: "Failed to load clinics",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchWebsites = async () => {
    if (!user) return;

    try {
      // First get user's clinics
      const userClinics = await fetchUserClinics();
      setClinics(userClinics);

      if (userClinics.length === 0) {
        setWebsites([]);
        return;
      }

      const clinicIds = userClinics.map(clinic => clinic.id);

      // Fetch websites for user's clinics
      const { data, error } = await supabase
        .from('websites')
        .select(`
          id,
          name,
          template_type,
          status,
          clinic_id,
          created_at,
          updated_at,
          clinics!inner(name)
        `)
        .in('clinic_id', clinicIds)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const transformedWebsites = (data || []).map(website => ({
        ...website,
        clinic: { name: website.clinics.name }
      }));

      setWebsites(transformedWebsites);
    } catch (error: any) {
      console.error('Error fetching websites:', error);
      toast({
        title: "Error",
        description: "Failed to load websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  const handleWebsiteCreate = (newWebsite: Website) => {
    setWebsites([newWebsite, ...websites]);
    setShowCreateModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTemplate = (template: string) => {
    return template.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your clinic websites
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your clinic websites
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          disabled={clinics.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Website
        </Button>
      </div>

      {clinics.length === 0 ? (
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
      ) : (
        <>
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowCreateModal(true)}>
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
                Manage all your clinic websites from one place ({websites.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {websites.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No websites yet</h3>
                  <p className="mb-4">Create your first website to get started</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Website
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {websites.map((website) => (
                    <div key={website.id} className="border rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="text-lg font-semibold">{website.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {website.clinic?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(website.status)}>
                            {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="text-muted-foreground">Template</label>
                          <p className="font-medium">{formatTemplate(website.template_type)}</p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Last Updated</label>
                          <p className="font-medium">
                            {new Date(website.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Completion</label>
                          <p className="font-medium">85%</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <CreateWebsiteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onWebsiteCreate={handleWebsiteCreate}
        clinics={clinics}
      />
    </div>
  );
};
