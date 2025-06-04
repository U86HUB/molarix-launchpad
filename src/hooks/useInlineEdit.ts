
import { useState, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseInlineEditProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  delay?: number;
}

export const useInlineEdit = ({ 
  initialValue, 
  onSave, 
  delay = 1000 
}: UseInlineEditProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedValue = useDebounce(value, delay);

  const handleSave = useCallback(async () => {
    if (value !== initialValue && value.trim() !== '') {
      setIsSaving(true);
      try {
        await onSave(value.trim());
      } catch (error) {
        console.error('Error saving:', error);
        setValue(initialValue); // Revert on error
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  }, [value, initialValue, onSave]);

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return {
    value,
    setValue,
    isEditing,
    isSaving,
    inputRef,
    handleEdit,
    handleKeyDown,
    handleBlur
  };
};
