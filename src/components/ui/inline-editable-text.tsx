
import React from 'react';
import { Input } from './input';
import { Loader2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInlineEdit } from '@/hooks/useInlineEdit';

interface InlineEditableTextProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
  placeholder?: string;
  variant?: 'title' | 'subtitle';
}

export const InlineEditableText = ({ 
  value, 
  onSave, 
  className,
  placeholder = "Enter text...",
  variant = 'title'
}: InlineEditableTextProps) => {
  const {
    value: editValue,
    setValue,
    isEditing,
    isSaving,
    inputRef,
    handleEdit,
    handleKeyDown,
    handleBlur
  } = useInlineEdit({
    initialValue: value,
    onSave
  });

  const baseClasses = variant === 'title' 
    ? "text-lg font-semibold" 
    : "text-sm text-gray-600 dark:text-gray-300";

  if (isEditing) {
    return (
      <div className="relative flex items-center gap-2">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn("min-w-0 flex-1", variant === 'title' ? "font-semibold" : "text-sm")}
          placeholder={placeholder}
          disabled={isSaving}
        />
        {isSaving && (
          <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 py-0.5 -mx-1 flex items-center gap-1 min-w-0",
        baseClasses,
        className
      )}
      onClick={handleEdit}
    >
      <span className="truncate flex-1">
        {value || placeholder}
      </span>
      <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
    </div>
  );
};
