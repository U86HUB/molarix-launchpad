
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sectionTemplates } from '@/data/sectionTemplates';
import { Section } from '@/types/website';
import * as Icons from 'lucide-react';
import { Plus } from 'lucide-react';

interface SectionLibraryProps {
  onAddSection: (type: Section['type']) => void;
  isAdding: boolean;
}

const SectionLibrary = ({ onAddSection, isAdding }: SectionLibraryProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Section
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose from our pre-built section templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionTemplates.map((template) => {
          const IconComponent = Icons[template.icon as keyof typeof Icons] as React.ComponentType<any>;
          
          return (
            <Card key={template.type} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-5 w-5 text-blue-600" />}
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => onAddSection(template.type)}
                  disabled={isAdding}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SectionLibrary;
