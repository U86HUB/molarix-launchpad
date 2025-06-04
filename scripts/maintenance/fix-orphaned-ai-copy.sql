
-- Fix orphaned ai_generated_copy records
-- This script repairs AI copy missing critical fields or invalid references

-- ============================================================================
-- REPAIR FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fix_orphaned_ai_copy(target_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  action TEXT,
  affected_rows INTEGER,
  details JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_to_use UUID;
  copy_fixed INTEGER := 0;
  copy_deleted INTEGER := 0;
BEGIN
  -- Use provided user_id or default to auth.uid()
  user_id_to_use := COALESCE(target_user_id, auth.uid());
  
  IF user_id_to_use IS NULL THEN
    RETURN QUERY SELECT 
      'ERROR'::TEXT,
      0,
      '{"error": "No user ID provided and no authenticated user"}'::JSONB;
    RETURN;
  END IF;

  -- Step 1: Fix AI copy missing created_by where session exists and belongs to user
  UPDATE ai_generated_copy 
  SET created_by = user_id_to_use
  WHERE created_by IS NULL 
    AND EXISTS (
      SELECT 1 FROM onboarding_sessions s 
      WHERE s.id = session_id 
        AND s.created_by = user_id_to_use
    );
  
  GET DIAGNOSTICS copy_fixed = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'FIXED_MISSING_CREATED_BY'::TEXT,
    copy_fixed,
    jsonb_build_object(
      'user_id', user_id_to_use,
      'copies_fixed', copy_fixed
    );

  -- Step 2: Delete AI copy with invalid session references
  DELETE FROM ai_generated_copy 
  WHERE NOT EXISTS (
    SELECT 1 FROM onboarding_sessions s WHERE s.id = session_id
  );
  
  GET DIAGNOSTICS copy_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'DELETED_INVALID_REFERENCES'::TEXT,
    copy_deleted,
    jsonb_build_object(
      'copies_deleted', copy_deleted,
      'reason', 'Invalid session references'
    );

  -- Step 3: Delete AI copy that still has no created_by (orphaned beyond repair)
  DELETE FROM ai_generated_copy 
  WHERE created_by IS NULL;
  
  GET DIAGNOSTICS copy_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'DELETED_UNREPAIRABLE_ORPHANS'::TEXT,
    copy_deleted,
    jsonb_build_object(
      'copies_deleted', copy_deleted,
      'reason', 'No valid owner could be determined'
    );

  RETURN QUERY SELECT 
    'REPAIR_COMPLETE'::TEXT,
    copy_fixed,
    jsonb_build_object(
      'total_fixed', copy_fixed,
      'total_deleted', copy_deleted
    );
END;
$$;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
-- Fix for current authenticated user:
-- SELECT * FROM public.fix_orphaned_ai_copy();

-- Fix for specific user:
-- SELECT * FROM public.fix_orphaned_ai_copy('user-uuid-here');
