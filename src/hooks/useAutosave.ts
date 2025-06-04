
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseAutosaveProps {
  sessionId: string;
  draftData: any;
  enabled?: boolean;
  delay?: number;
}

export const useAutosave = ({ 
  sessionId, 
  draftData, 
  enabled = true, 
  delay = 2000 
}: UseAutosaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const { user } = useAuth();

  const saveDraft = useCallback(async () => {
    if (!user || !enabled) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ai_generated_copy')
        .upsert({
          session_id: sessionId,
          type: 'draft',
          data: draftData,
          created_by: user.id
        });

      if (!error) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, draftData, enabled, user]);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveDraft();
  }, [saveDraft]);

  useEffect(() => {
    if (!enabled || !user) return;

    const currentData = JSON.stringify(draftData);
    
    // Only save if data has actually changed
    if (currentData !== previousDataRef.current) {
      previousDataRef.current = currentData;
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        saveDraft();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [draftData, enabled, delay, saveDraft, user]);

  return {
    isSaving,
    lastSaved,
    saveNow
  };
};
