
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeneratedCopy } from '@/types/copy';

interface UseAutosaveProps {
  sessionId: string;
  draftData: GeneratedCopy;
  enabled?: boolean;
  debounceMs?: number;
}

export const useAutosave = ({ 
  sessionId, 
  draftData, 
  enabled = true,
  debounceMs = 10000 // 10 seconds
}: UseAutosaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const debounceTimer = useRef<NodeJS.Timeout>();
  const lastSavedData = useRef<string>('');
  const savePromise = useRef<Promise<void> | null>(null);

  const saveDraft = useCallback(async () => {
    if (!enabled || !sessionId || !draftData) return;

    const currentDataString = JSON.stringify(draftData);
    
    // Skip save if content hasn't changed
    if (currentDataString === lastSavedData.current) {
      return;
    }

    setIsSaving(true);
    
    try {
      // First check if there's an existing draft
      const { data: existingDraft, error: fetchError } = await supabase
        .from('ai_generated_copy')
        .select('*')
        .eq('session_id', sessionId)
        .eq('type', 'draft')
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existingDraft) {
        // Update existing draft
        const { error: updateError } = await supabase
          .from('ai_generated_copy')
          .update({
            data: draftData as any,
            created_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new draft
        const { error: insertError } = await supabase
          .from('ai_generated_copy')
          .insert({
            session_id: sessionId,
            type: 'draft',
            data: draftData as any
          });

        if (insertError) {
          throw insertError;
        }
      }

      lastSavedData.current = currentDataString;
      setLastSaved(new Date());
      
      toast({
        title: "Draft saved",
        description: "Your changes have been automatically saved",
        duration: 2000,
      });

    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast({
        title: "Auto-save failed",
        description: "Failed to save draft. Your changes are still preserved locally.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, draftData, enabled, toast]);

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      if (!savePromise.current) {
        savePromise.current = saveDraft().finally(() => {
          savePromise.current = null;
        });
      }
    }, debounceMs);
  }, [saveDraft, debounceMs]);

  // Manual save function (for onBlur events)
  const saveNow = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (!savePromise.current) {
      savePromise.current = saveDraft().finally(() => {
        savePromise.current = null;
      });
    }
    
    return savePromise.current;
  }, [saveDraft]);

  // Auto-save effect
  useEffect(() => {
    if (enabled && draftData) {
      debouncedSave();
    }
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [draftData, enabled, debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    saveNow,
    saveDraft
  };
};
