
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneratedCopy } from "@/types/copy";
import EditableField from "./EditableField";

interface EditableHomepageSectionProps {
  homepage: GeneratedCopy['homepage'];
  onUpdate: (field: keyof GeneratedCopy['homepage'], value: string) => void;
  onBlur?: () => void;
  isEditing: boolean;
}

const EditableHomepageSection = ({ homepage, onUpdate, onBlur, isEditing }: EditableHomepageSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Copy</CardTitle>
        <CardDescription>Main homepage content and hero section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EditableField
          label="Headline"
          value={homepage.headline}
          onChange={(value) => onUpdate('headline', value)}
          onBlur={onBlur}
          isEditing={isEditing}
          renderDisplay={(value) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
          )}
        />

        <EditableField
          label="Subheadline"
          value={homepage.subheadline}
          onChange={(value) => onUpdate('subheadline', value)}
          onBlur={onBlur}
          isEditing={isEditing}
          type="richtext"
          renderDisplay={(value) => (
            <div 
              className="text-lg text-gray-600 dark:text-gray-300 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          )}
        />

        <EditableField
          label="Welcome Message"
          value={homepage.welcomeMessage}
          onChange={(value) => onUpdate('welcomeMessage', value)}
          onBlur={onBlur}
          isEditing={isEditing}
          type="richtext"
        />

        <EditableField
          label="Call-to-Action Text"
          value={homepage.ctaText}
          onChange={(value) => onUpdate('ctaText', value)}
          onBlur={onBlur}
          isEditing={isEditing}
          renderDisplay={(value) => (
            <Button size="lg" className="font-semibold">{value}</Button>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default EditableHomepageSection;
