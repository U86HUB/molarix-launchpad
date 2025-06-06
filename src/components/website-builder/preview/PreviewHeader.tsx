
import React from 'react';
import ViewModeSelector from './ViewModeSelector';

interface PreviewHeaderProps {
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  copyMode: 'draft' | 'published';
  hasFallbackCopy: boolean;
}

const PreviewHeader = ({ 
  viewMode, 
  onViewModeChange, 
  copyMode,
  hasFallbackCopy
}: PreviewHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <ViewModeSelector 
        viewMode={viewMode} 
        onViewModeChange={onViewModeChange}
      />

      <div className="text-sm text-gray-500">
        {hasFallbackCopy ? `Using ${copyMode} copy` : 'No copy loaded'}
      </div>
    </div>
  );
};

export default PreviewHeader;
