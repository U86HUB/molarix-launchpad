
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Globe, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Domain {
  id: string;
  custom_domain: string;
  is_verified: boolean;
  created_at: string;
  site_id: string;
}

const DashboardDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userSiteId, setUserSiteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // First get the user's site ID
      const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .limit(1);

      if (sites && sites.length > 0) {
        const siteId = sites[0].id;
        setUserSiteId(siteId);

        // Fetch domains for this site
        const { data: domainsData } = await supabase
          .from('domains')
          .select('*')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false });

        setDomains(domainsData || []);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast({
        title: "Error",
        description: "Failed to load domains",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!userSiteId || !newDomain.trim()) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('domains')
        .insert({
          site_id: userSiteId,
          custom_domain: newDomain.trim(),
          is_verified: false
        })
        .select()
        .single();

      if (error) throw error;

      setDomains([data, ...domains]);
      setNewDomain('');
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Domain added successfully",
      });
    } catch (error) {
      console.error('Error adding domain:', error);
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      // In a real application, this would trigger a verification process
      // For now, we'll just mark it as verified
      await supabase
        .from('domains')
        .update({ is_verified: true })
        .eq('id', domainId);

      setDomains(domains.map(domain => 
        domain.id === domainId 
          ? { ...domain, is_verified: true }
          : domain
      ));

      toast({
        title: "Success",
        description: "Domain verified successfully",
      });
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast({
        title: "Error",
        description: "Failed to verify domain",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    try {
      await supabase
        .from('domains')
        .delete()
        .eq('id', domainId);

      setDomains(domains.filter(domain => domain.id !== domainId));

      toast({
        title: "Success",
        description: "Domain deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast({
        title: "Error",
        description: "Failed to delete domain",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Domain Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage custom domains for your site
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Domain</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your custom domain without https://
                  </p>
                </div>
                <Button 
                  onClick={handleAddDomain} 
                  disabled={isSaving || !newDomain.trim()}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Domain'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No custom domains</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a custom domain to make your site accessible via your own URL
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Domain
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => (
                <Card key={domain.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{domain.custom_domain}</h3>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(domain.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={domain.is_verified ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        {domain.is_verified ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Pending
                          </>
                        )}
                      </Badge>
                      <div className="flex space-x-2">
                        {!domain.is_verified && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyDomain(domain.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDomain(domain.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {!domain.is_verified && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-2">DNS Configuration Required</h4>
                      <p className="text-xs text-muted-foreground">
                        Add a CNAME record pointing {domain.custom_domain} to your-site.vercel.app
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardDomains;
