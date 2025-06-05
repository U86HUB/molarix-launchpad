
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/types/website';
import { Eye, EyeOff, Settings, Trash2, GripVertical, FileText } from 'lucide-react';

interface SectionHeaderProps {
  section: Section;
  isUpdating: boolean;
  isActive?: boolean;
  onVisibilityToggle: () => void;
  onToggleEditing: () => void;
  onDelete: () => void;
  hasCopy?: boolean;
  copyLoading?: boolean;
}

const SectionHeader = ({
  section,
  isUpdating,
  isActive = false,
  onVisibilityToggle,
  onToggleEditing,
  onDelete,
  hasCopy = false,
  copyLoading = false,
}: SectionHeaderProps) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
          </h4>
          {isActive && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
              Active
            </Badge>
          )}
          {!section.is_visible && (
            <Badge variant="outline" className="text-xs">
              Hidden
            </Badge>
          )}
          {copyLoading ? (
            <Badge variant="outline" className="text-xs">
              Loading copy...
            </Badge>
          ) : hasCopy ? (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              <FileText className="h-3 w-3 mr-1" />
              Copy
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-gray-500">
              No copy
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVisibilityToggle}
            disabled={isUpdating}
            className="h-8 w-8 p-0"
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
            disabled={isUpdating}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isUpdating}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default SectionHeader;
