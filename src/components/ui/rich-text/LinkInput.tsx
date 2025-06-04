
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkInputProps {
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  onSetLink: () => void;
  onCancel: () => void;
}

const LinkInput = ({ 
  linkUrl, 
  onLinkUrlChange, 
  onSetLink, 
  onCancel 
}: LinkInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSetLink();
    }
  };

  return (
    <div className="flex gap-2 p-2 border-b bg-gray-50 dark:bg-gray-800">
      <Input
        placeholder="Enter URL..."
        value={linkUrl}
        onChange={(e) => onLinkUrlChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Button size="sm" onClick={onSetLink} type="button">
        Add Link
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onCancel}
        type="button"
      >
        Cancel
      </Button>
    </div>
  );
};

export default LinkInput;
