
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/types/website';
import { sectionTemplates } from '@/data/sectionTemplates';
import { Trash2, GripVertical, Settings, Eye, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SectionHeaderProps {
  section: Section;
  isUpdating: boolean;
  onVisibilityToggle: () => void;
  onToggleEditing: () => void;
  onDelete: () => void;
}

const SectionHeader = ({ 
  section, 
  isUpdating, 
  onVisibilityToggle, 
  onToggleEditing, 
  onDelete 
}: SectionHeaderProps) => {
  const template = sectionTemplates.find(t => t.type === section.type);
  const IconComponent = template ? Icons[template.icon as keyof typeof Icons] as React.ComponentType<any> : null;

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
          {IconComponent && <IconComponent className="h-5 w-5 text-blue-600" />}
          <div>
            <CardTitle className="text-base">
              {template?.name || section.type}
            </CardTitle>
            <p className="text-sm text-gray-500">Position: {section.position + 1}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVisibilityToggle}
            disabled={isUpdating}
          >
            {section.is_visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEditing}
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default SectionHeader;
