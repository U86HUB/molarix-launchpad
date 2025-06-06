
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}

const ViewModeSelector = ({ viewMode, onViewModeChange }: ViewModeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={viewMode === 'desktop' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('desktop')}
        className="flex items-center gap-2"
      >
        <Monitor className="h-4 w-4" />
        Desktop
      </Button>
      <Button
        variant={viewMode === 'mobile' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('mobile')}
        className="flex items-center gap-2"
      >
        <Smartphone className="h-4 w-4" />
        Mobile
      </Button>
    </div>
  );
};

export default ViewModeSelector;
