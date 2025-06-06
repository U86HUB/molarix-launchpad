
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/rich-text/TiptapEditor';
import { supabase } from '@/integrations/supabase/client';

const AboutPage = () => {
  const [editorJSON, setEditorJSON] = useState<any>(null);
  const [initialContent, setInitialContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userSiteId, setUserSiteId] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // First get the user's site ID
      const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
        .limit(1);

      if (sites && sites.length > 0) {
        const siteId = sites[0].id;
        setUserSiteId(siteId);

        // Fetch existing content
        const { data } = await supabase
          .from('site_content')
          .select('content')
          .eq('site_id', siteId)
          .eq('section_name', 'about')
          .single();

        const content = data?.content || null;
        setInitialContent(content);
        setEditorJSON(content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userSiteId || !editorJSON) return;

    setIsSaving(true);
    try {
      await supabase
        .from('site_content')
        .upsert({
          site_id: userSiteId,
          section_name: 'about',
          content: editorJSON
        });

      toast({
        title: "Success",
        description: "Content saved successfully",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
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

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>About Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TiptapEditor
            initialContent={initialContent}
            onUpdate={setEditorJSON}
            sectionType="about"
          />
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Content'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
