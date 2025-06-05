
import { useState } from 'react';
import { Section } from '@/types/website';
import { GeneratedCopy } from '@/types/copy';
import { Button } from '@/components/ui/button';
import { InlineEditableText } from '@/components/ui/inline-editable-text';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit3, Save, X } from 'lucide-react';

interface InlineEditableSectionProps {
  section: Section;
  copy: any;
  copyMode: 'draft' | 'published';
  children: React.ReactNode;
  onCopyUpdated?: (updatedCopy: any) => void;
}

const InlineEditableSection = ({
  section,
  copy,
  copyMode,
  children,
  onCopyUpdated
}: InlineEditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveCopyField = async (field: string, value: string) => {
    if (!copy || !section.copy_id) return;

    setSaving(true);
    try {
      // Update the copy data
      const updatedCopyData = {
        ...copy,
        [field]: value
      };

      const { error } = await supabase
        .from('ai_generated_copy')
        .update({ data: updatedCopyData })
        .eq('id', section.copy_id);

      if (error) throw error;

      onCopyUpdated?.(updatedCopyData);

      toast({
        title: "Saved",
        description: "Copy updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving copy:', error);
      toast({
        title: "Error",
        description: "Failed to save copy changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderEditableContent = () => {
    if (!isEditing || !copy) return children;

    // Return editable version based on section type
    switch (section.type) {
      case 'hero':
        return (
          <div className="relative">
            <div className="absolute top-2 right-2 z-10 bg-white rounded-lg shadow-lg p-2 space-y-2">
              <InlineEditableText
                value={copy.headline || ''}
                onSave={(value) => handleSaveCopyField('headline', value)}
                placeholder="Enter headline..."
                variant="title"
              />
              <InlineEditableText
                value={copy.subheadline || ''}
                onSave={(value) => handleSaveCopyField('subheadline', value)}
                placeholder="Enter subheadline..."
                variant="subtitle"
              />
              <InlineEditableText
                value={copy.ctaText || ''}
                onSave={(value) => handleSaveCopyField('ctaText', value)}
                placeholder="Enter CTA text..."
                variant="subtitle"
              />
            </div>
            {children}
          </div>
        );
      default:
        return children;
    }
  };

  return (
    <div className="relative group">
      {/* Edit Toggle Button */}
      {copy && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant={isEditing ? "default" : "secondary"}
            onClick={() => setIsEditing(!isEditing)}
            disabled={saving}
            className="h-8 w-8 p-0"
          >
            {isEditing ? <X className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
          </Button>
        </div>
      )}

      {renderEditableContent()}
    </div>
  );
};

export default InlineEditableSection;
