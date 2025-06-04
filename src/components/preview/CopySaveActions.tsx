
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSaveCopy } from "@/hooks/useSaveCopy";

interface OnboardingSession {
  id: string;
  clinic_name: string;
}

interface CopySaveActionsProps {
  generatedCopy: any;
  sessionData: OnboardingSession | null;
}

const CopySaveActions = ({ generatedCopy, sessionData }: CopySaveActionsProps) => {
  const { toast } = useToast();
  const { saveCopy, loading } = useSaveCopy();

  const exportAsJson = () => {
    if (!generatedCopy) return;
    
    const dataStr = JSON.stringify(generatedCopy, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sessionData?.clinic_name || 'clinic'}-copy.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Copy exported as JSON file",
    });
  };

  const handleSaveCopy = async () => {
    if (!generatedCopy || !sessionData?.id) return;
    
    await saveCopy(sessionData.id, generatedCopy);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Your Copy</CardTitle>
        <CardDescription>
          Export or save your generated content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button onClick={exportAsJson} className="flex-1" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download as JSON
          </Button>
          <Button 
            onClick={handleSaveCopy} 
            className="flex-1"
            disabled={loading || !generatedCopy || !sessionData?.id}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save to Project'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopySaveActions;
