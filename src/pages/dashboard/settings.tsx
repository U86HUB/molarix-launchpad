
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save, Palette, Type, Link, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Site {
  id: string;
  name: string;
  slug: string;
  primary_color?: string;
  font_style?: string;
  calendly_url?: string;
  patient_portal_url?: string;
  tidio_key?: string;
  ga_measurement_id?: string;
}

const DashboardSettings = () => {
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    primary_color: '',
    font_style: '',
    calendly_url: '',
    patient_portal_url: '',
    tidio_key: '',
    ga_measurement_id: ''
  });

  useEffect(() => {
    fetchSite();
  }, []);

  const fetchSite = async () => {
    try {
      const { data: sites } = await supabase
        .from('sites')
        .select('*')
        .limit(1);

      if (sites && sites.length > 0) {
        const siteData = sites[0];
        setSite(siteData);
        setFormData({
          name: siteData.name || '',
          slug: siteData.slug || '',
          primary_color: siteData.primary_color || '',
          font_style: siteData.font_style || '',
          calendly_url: siteData.calendly_url || '',
          patient_portal_url: siteData.patient_portal_url || '',
          tidio_key: siteData.tidio_key || '',
          ga_measurement_id: siteData.ga_measurement_id || ''
        });
      }
    } catch (error) {
      console.error('Error fetching site:', error);
      toast({
        title: "Error",
        description: "Failed to load site settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!site) return;

    setIsSaving(true);
    try {
      await supabase
        .from('sites')
        .update({
          name: formData.name,
          slug: formData.slug,
          primary_color: formData.primary_color || null,
          font_style: formData.font_style || null,
          calendly_url: formData.calendly_url || null,
          patient_portal_url: formData.patient_portal_url || null,
          tidio_key: formData.tidio_key || null,
          ga_measurement_id: formData.ga_measurement_id || null
        })
        .eq('id', site.id);

      toast({
        title: "Success",
        description: "Site settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast({
        title: "Error",
        description: "Failed to save site settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-8 text-gray-500">
        No site found. Please create a site first.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your site's basic information and integrations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <Label htmlFor="slug">Site Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Enter site slug"
              />
            </div>
          </CardContent>
        </Card>

        {/* Design Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Design & Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="font_style">Font Style</Label>
              <Input
                id="font_style"
                value={formData.font_style}
                onChange={(e) => setFormData({ ...formData, font_style: e.target.value })}
                placeholder="e.g., Inter, Roboto, Arial"
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="calendly_url">Calendly URL</Label>
              <Input
                id="calendly_url"
                value={formData.calendly_url}
                onChange={(e) => setFormData({ ...formData, calendly_url: e.target.value })}
                placeholder="https://calendly.com/your-link"
              />
            </div>
            <div>
              <Label htmlFor="patient_portal_url">Patient Portal URL</Label>
              <Input
                id="patient_portal_url"
                value={formData.patient_portal_url}
                onChange={(e) => setFormData({ ...formData, patient_portal_url: e.target.value })}
                placeholder="https://your-patient-portal.com"
              />
            </div>
            <div>
              <Label htmlFor="tidio_key">Tidio Chat Key</Label>
              <Input
                id="tidio_key"
                value={formData.tidio_key}
                onChange={(e) => setFormData({ ...formData, tidio_key: e.target.value })}
                placeholder="Enter Tidio chat widget key"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ga_measurement_id">Google Analytics Measurement ID</Label>
              <Input
                id="ga_measurement_id"
                value={formData.ga_measurement_id}
                onChange={(e) => setFormData({ ...formData, ga_measurement_id: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !formData.name || !formData.slug}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSettings;
