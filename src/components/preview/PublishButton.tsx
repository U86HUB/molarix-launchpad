
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PublishButtonProps {
  draftCopyId: string;
  sessionId: string;
  onPublished: () => void;
}

const PublishButton = ({ draftCopyId, sessionId, onPublished }: PublishButtonProps) => {
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // Update the draft copy to published
      const { error } = await supabase
        .from('ai_generated_copy')
        .update({ type: 'published' })
        .eq('id', draftCopyId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your content has been published successfully.",
      });

      onPublished();
    } catch (error) {
      console.error('Error publishing copy:', error);
      toast({
        title: "Error",
        description: "Failed to publish content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Button 
      onClick={handlePublish} 
      disabled={publishing}
      className="bg-green-600 hover:bg-green-700"
    >
      {publishing ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4 mr-2" />
      )}
      {publishing ? 'Publishing...' : 'Publish This Version'}
    </Button>
  );
};

export default PublishButton;
