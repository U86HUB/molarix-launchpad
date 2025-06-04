
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedCopy } from "@/types/copy";
import EditableField from "./EditableField";

interface EditableAboutSectionProps {
  about: GeneratedCopy['about'];
  onUpdateTitle: (value: string) => void;
  onUpdateIntro: (value: string) => void;
  onUpdateMission: (value: string) => void;
  onUpdateValue: (index: number, field: 'name' | 'description', value: string) => void;
  isEditing: boolean;
}

const EditableAboutSection = ({ 
  about, 
  onUpdateTitle, 
  onUpdateIntro, 
  onUpdateMission, 
  onUpdateValue, 
  isEditing 
}: EditableAboutSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Copy</CardTitle>
        <CardDescription>About section content and practice values</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EditableField
          label="About Title"
          value={about.title}
          onChange={onUpdateTitle}
          isEditing={isEditing}
          renderDisplay={(value) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
          )}
        />

        <EditableField
          label="About Introduction"
          value={about.intro}
          onChange={onUpdateIntro}
          isEditing={isEditing}
          type="textarea"
          rows={3}
        />

        <EditableField
          label="Mission Statement"
          value={about.mission}
          onChange={onUpdateMission}
          isEditing={isEditing}
          type="textarea"
          rows={3}
          renderDisplay={(value) => (
            <p className="text-gray-800 dark:text-gray-200 italic">{value}</p>
          )}
        />

        <div className="space-y-4">
          <label className="text-sm font-medium">Core Values</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {about.values.map((value, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Value Name</label>
                  {isEditing ? (
                    <Input
                      value={value.name}
                      onChange={(e) => onUpdateValue(index, 'name', e.target.value)}
                      placeholder="Value name"
                    />
                  ) : (
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {value.name}
                    </h4>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Value Description</label>
                  {isEditing ? (
                    <Textarea
                      value={value.description}
                      onChange={(e) => onUpdateValue(index, 'description', e.target.value)}
                      placeholder="Value description"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {value.description}
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

export default EditableAboutSection;
