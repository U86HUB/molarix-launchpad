
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Section } from '@/types/website';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, FileText, Plus } from 'lucide-react';

interface SectionCopyControlsProps {
  section: Section;
  copy: any;
  loading: boolean;
  onUpdate: (sectionId: string, updates: Partial<Section>) => void;
}

const SectionCopyControls = ({ section, copy, loading, onUpdate }: SectionCopyControlsProps) => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateCopy = async () => {
    console.log('Generating copy for section:', {
      sectionId: section.id,
      sectionType: section.type,
      websiteId: section.website_id
    });

    setGenerating(true);
    try {
      // Call the copy generation service for this specific section
      const { data, error } = await supabase.functions.invoke('generate-copy', {
        body: { 
          sessionId: section.website_id, 
          sectionType: section.type,
          stream: false 
        }
      });

      console.log('Copy generation result:', { data, error });

      if (error) {
        console.error('Copy generation error:', error);
        throw error;
      }

      if (data && data.success) {
        console.log('Copy generated successfully:', data);
        
        // Link the new copy to this section
        if (data.copyId) {
          console.log('Linking copy to section:', {
            sectionId: section.id,
            copyId: data.copyId
          });
          
          await onUpdate(section.id, { copy_id: data.copyId });
        }

        toast({
          title: "Copy Generated",
          description: `AI copy has been generated for your ${section.type} section.`,
        });
      } else {
        throw new Error(data?.error || 'Failed to generate copy');
      }
    } catch (error: any) {
      console.error('Error generating copy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate copy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateCopy = async () => {
    console.log('Regenerating copy for section:', section.id);
    // Same as generate but for existing copy
    await handleGenerateCopy();
  };

  return (
    <div className="space-y-3">
      <Separator />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">AI Copy</span>
          {copy ? (
            <Badge variant="secondary" className="text-xs">
              Generated
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Not Generated
            </Badge>
          )}
          {section.copy_id && (
            <Badge variant="outline" className="text-xs">
              ID: {section.copy_id.slice(0, 8)}...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {copy ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerateCopy}
              disabled={generating || loading}
              className="h-7 text-xs"
            >
              {generating ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Regenerate
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleGenerateCopy}
              disabled={generating || loading}
              className="h-7 text-xs"
            >
              {generating ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Plus className="h-3 w-3 mr-1" />
              )}
              Generate Copy
            </Button>
          )}
        </div>
      </div>

      {copy && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Preview:</p>
          <p className="text-sm text-gray-800 truncate">
            {typeof copy === 'object' ? 
              copy.headline || copy.title || JSON.stringify(copy).slice(0, 50) + '...' : 
              String(copy).slice(0, 50) + '...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionCopyControls;
