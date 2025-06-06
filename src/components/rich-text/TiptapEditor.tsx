
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TiptapEditorProps {
  initialContent: any;
  onUpdate: (contentJSON: any) => void;
  sectionType?: string; // e.g., 'about', 'services', 'contact'
}

export function TiptapEditor({ initialContent, onUpdate, sectionType }: TiptapEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

  const generateAIContent = async () => {
    if (!sectionType) {
      toast({
        title: "Error",
        description: "AI generation not available for this section",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get user's site ID
      const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
        .limit(1);

      if (!sites || sites.length === 0) {
        throw new Error('No site found');
      }

      const siteId = sites[0].id;

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: {
          siteId,
          fieldType: sectionType,
          contextData: {
            specialties: ['general dental care'],
            location: 'our location'
          }
        }
      });

      if (error) throw error;

      if (data?.text) {
        // Update editor content
        editor?.commands.setContent(data.text);
        
        toast({
          title: "Success",
          description: data.cached ? "Content loaded from cache" : "AI content generated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {sectionType && (
        <div className="flex justify-end">
          <Button
            onClick={generateAIContent}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Content
              </>
            )}
          </Button>
        </div>
      )}
      <div className="prose max-w-full min-h-[200px] border rounded-lg p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
