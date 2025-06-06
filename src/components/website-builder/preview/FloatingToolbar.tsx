
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { Section } from '@/types/website';

interface FloatingToolbarProps {
  sections: Section[];
  activeSection: string | null;
  viewMode: 'desktop' | 'mobile';
  copyMode: 'draft' | 'published';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  onCopyModeChange: (mode: 'draft' | 'published') => void;
  onScrollToSection: (sectionId: string) => void;
}

const FloatingToolbar = ({
  sections,
  activeSection,
  viewMode,
  copyMode,
  onViewModeChange,
  onCopyModeChange,
  onScrollToSection,
}: FloatingToolbarProps) => {
  const visibleSections = sections.filter(section => section.is_visible !== false);

  return (
    <Card className="fixed top-20 right-6 z-50 p-3 shadow-lg border bg-white/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Section Navigator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Section:</span>
          <Select 
            value={activeSection || ''} 
            onValueChange={onScrollToSection}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Jump to..." />
            </SelectTrigger>
            <SelectContent>
              {visibleSections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border rounded-md">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('desktop')}
            className="h-8 px-3"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('mobile')}
            className="h-8 px-3"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        {/* Copy Mode Toggle */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={copyMode === 'draft' ? 'outline' : 'default'}
            className="text-xs"
          >
            {copyMode === 'draft' ? '📝 Draft' : '✅ Published'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopyModeChange(copyMode === 'draft' ? 'published' : 'draft')}
            className="h-8 p-1"
          >
            {copyMode === 'draft' ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FloatingToolbar;
