
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateSelectionControlsProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const TemplateSelectionControls = ({ 
  selectedTemplate, 
  onTemplateChange 
}: TemplateSelectionControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="template-select" className="text-sm font-medium">
        Template:
      </label>
      <Select value={selectedTemplate} onValueChange={onTemplateChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="template-a">Template A</SelectItem>
          <SelectItem value="template-b">Template B</SelectItem>
          <SelectItem value="template-c">Template C</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelectionControls;
