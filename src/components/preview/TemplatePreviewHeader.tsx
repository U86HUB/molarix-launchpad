
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TemplateSelectionControls from "./TemplateSelectionControls";

interface TemplatePreviewHeaderProps {
  onBack: () => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const TemplatePreviewHeader = ({ 
  onBack, 
  selectedTemplate, 
  onTemplateChange 
}: TemplatePreviewHeaderProps) => {
  return (
    <div className="mb-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Template Preview
            <span className="ml-2 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
              Published
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See how your published clinic content looks with different templates
          </p>
        </div>
        
        <TemplateSelectionControls
          selectedTemplate={selectedTemplate}
          onTemplateChange={onTemplateChange}
        />
      </div>
    </div>
  );
};

export default TemplatePreviewHeader;
