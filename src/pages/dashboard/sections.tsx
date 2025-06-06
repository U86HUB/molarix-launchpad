
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Layout, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSection {
  id: string;
  site_id: string;
  section_id: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
}

interface TemplateSection {
  id: string;
  name: string;
  slug: string;
  default_props: any;
}

const DashboardSections = () => {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [templateSections, setTemplateSections] = useState<TemplateSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userSiteId, setUserSiteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

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

        // Fetch site sections and template sections in parallel
        const [
          { data: siteSections },
          { data: templates }
        ] = await Promise.all([
          supabase
            .from('site_sections')
            .select('*')
            .eq('site_id', siteId)
            .order('order_index', { ascending: true }),
          supabase
            .from('template_sections')
            .select('*')
            .order('name', { ascending: true })
        ]);

        setSections(siteSections || []);
        setTemplateSections(templates || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: "Error",
        description: "Failed to load sections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!userSiteId || !selectedTemplate) return;

    setIsSaving(true);
    try {
      const nextOrderIndex = Math.max(...sections.map(s => s.order_index), -1) + 1;

      const { data, error } = await supabase
        .from('site_sections')
        .insert({
          site_id: userSiteId,
          section_id: selectedTemplate,
          order_index: nextOrderIndex,
          is_visible: true
        })
        .select()
        .single();

      if (error) throw error;

      setSections([...sections, data]);
      setSelectedTemplate('');
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Section added successfully",
      });
    } catch (error) {
      console.error('Error adding section:', error);
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (sectionId: string, currentVisibility: boolean) => {
    try {
      await supabase
        .from('site_sections')
        .update({ is_visible: !currentVisibility })
        .eq('id', sectionId);

      setSections(sections.map(section => 
        section.id === sectionId 
          ? { ...section, is_visible: !currentVisibility }
          : section
      ));

      toast({
        title: "Success",
        description: `Section ${!currentVisibility ? 'shown' : 'hidden'}`,
      });
    } catch (error) {
      console.error('Error toggling section visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update section visibility",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await supabase
        .from('site_sections')
        .delete()
        .eq('id', sectionId);

      setSections(sections.filter(section => section.id !== sectionId));

      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      });
    }
  };

  const handleReorderSection = async (sectionId: string, newOrderIndex: number) => {
    try {
      await supabase
        .from('site_sections')
        .update({ order_index: newOrderIndex })
        .eq('id', sectionId);

      setSections(sections.map(section => 
        section.id === sectionId 
          ? { ...section, order_index: newOrderIndex }
          : section
      ).sort((a, b) => a.order_index - b.order_index));

      toast({
        title: "Success",
        description: "Section order updated",
      });
    } catch (error) {
      console.error('Error reordering section:', error);
      toast({
        title: "Error",
        description: "Failed to reorder section",
        variant: "destructive",
      });
    }
  };

  const getTemplateSectionName = (sectionId: string) => {
    const template = templateSections.find(t => t.id === sectionId);
    return template ? template.name : 'Unknown Section';
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
              <Layout className="h-5 w-5" />
              Site Sections
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage the sections that appear on your site
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">Section Template</Label>
                  <select
                    id="template"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a template...</option>
                    {templateSections.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={handleAddSection} 
                  disabled={isSaving || !selectedTemplate}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Section'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No sections added</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add sections to build your site's layout and content
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <Card key={section.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <div>
                        <h3 className="font-medium">
                          {getTemplateSectionName(section.section_id)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Order: {section.order_index + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={section.is_visible ? "default" : "secondary"}>
                        {section.is_visible ? "Visible" : "Hidden"}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleVisibility(section.id, section.is_visible)}
                        >
                          {section.is_visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        {index > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorderSection(section.id, section.order_index - 1)}
                          >
                            ↑
                          </Button>
                        )}
                        {index < sections.length - 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorderSection(section.id, section.order_index + 1)}
                          >
                            ↓
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSections;
