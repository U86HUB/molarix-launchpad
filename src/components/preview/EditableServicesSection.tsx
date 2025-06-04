
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedCopy } from "@/types/copy";
import EditableField from "./EditableField";

interface EditableServicesSectionProps {
  services: GeneratedCopy['services'];
  onUpdateTitle: (value: string) => void;
  onUpdateIntro: (value: string) => void;
  onUpdateService: (index: number, field: 'name' | 'description', value: string) => void;
  isEditing: boolean;
}

const EditableServicesSection = ({ 
  services, 
  onUpdateTitle, 
  onUpdateIntro, 
  onUpdateService, 
  isEditing 
}: EditableServicesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Copy</CardTitle>
        <CardDescription>Services section content and offerings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EditableField
          label="Services Title"
          value={services.title}
          onChange={onUpdateTitle}
          isEditing={isEditing}
          renderDisplay={(value) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
          )}
        />

        <EditableField
          label="Services Introduction"
          value={services.intro}
          onChange={onUpdateIntro}
          isEditing={isEditing}
          type="richtext"
        />

        <div className="space-y-4">
          <label className="text-sm font-medium">Individual Services</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.services.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Service Name</label>
                  {isEditing ? (
                    <Input
                      value={service.name}
                      onChange={(e) => onUpdateService(index, 'name', e.target.value)}
                      placeholder="Service name"
                    />
                  ) : (
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h4>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Service Description</label>
                  {isEditing ? (
                    <Textarea
                      value={service.description}
                      onChange={(e) => onUpdateService(index, 'description', e.target.value)}
                      placeholder="Service description"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableServicesSection;
