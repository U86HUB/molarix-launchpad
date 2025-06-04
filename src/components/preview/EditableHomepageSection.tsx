
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneratedCopy } from "@/types/copy";
import EditableField from "./EditableField";

interface EditableHomepageSectionProps {
  homepage: GeneratedCopy['homepage'];
  onUpdate: (field: keyof GeneratedCopy['homepage'], value: string) => void;
  isEditing: boolean;
}

const EditableHomepageSection = ({ homepage, onUpdate, isEditing }: EditableHomepageSectionProps) => {
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
          isEditing={isEditing}
          renderDisplay={(value) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h2>
          )}
        />

        <EditableField
          label="Subheadline"
          value={homepage.subheadline}
          onChange={(value) => onUpdate('subheadline', value)}
          isEditing={isEditing}
          type="textarea"
          rows={2}
          renderDisplay={(value) => (
            <p className="text-lg text-gray-600 dark:text-gray-300">{value}</p>
          )}
        />

        <EditableField
          label="Welcome Message"
          value={homepage.welcomeMessage}
          onChange={(value) => onUpdate('welcomeMessage', value)}
          isEditing={isEditing}
          type="textarea"
          rows={3}
        />

        <EditableField
          label="Call-to-Action Text"
          value={homepage.ctaText}
          onChange={(value) => onUpdate('ctaText', value)}
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
