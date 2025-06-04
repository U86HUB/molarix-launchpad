
-- Fix orphaned sections records
-- This script repairs sections with invalid references

-- ============================================================================
-- REPAIR FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fix_orphaned_sections(target_user_id UUID DEFAULT NULL)
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
  sections_deleted INTEGER := 0;
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

  -- Step 1: Delete sections with invalid website references
  DELETE FROM sections 
  WHERE NOT EXISTS (
    SELECT 1 FROM websites w WHERE w.id = website_id
  );
  
  GET DIAGNOSTICS sections_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'DELETED_INVALID_WEBSITE_REFS'::TEXT,
    sections_deleted,
    jsonb_build_object(
      'sections_deleted', sections_deleted,
      'reason', 'Website no longer exists'
    );

  -- Step 2: Delete sections orphaned via websites (website has no clinic)
  -- Only if we're doing a comprehensive cleanup
  DELETE FROM sections 
  WHERE EXISTS (
    SELECT 1 FROM websites w 
    WHERE w.id = website_id 
      AND w.clinic_id IS NULL
      AND w.created_by = user_id_to_use
  );
  
  GET DIAGNOSTICS sections_deleted = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'DELETED_ORPHANED_VIA_WEBSITE'::TEXT,
    sections_deleted,
    jsonb_build_object(
      'sections_deleted', sections_deleted,
      'reason', 'Parent website has no clinic assignment'
    );

  RETURN QUERY SELECT 
    'REPAIR_COMPLETE'::TEXT,
    sections_deleted,
    jsonb_build_object(
      'total_deleted', sections_deleted,
      'note', 'Sections table does not have created_by - relies on website ownership'
    );
END;
$$;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
-- Fix for current authenticated user:
-- SELECT * FROM public.fix_orphaned_sections();

-- Fix for specific user:
-- SELECT * FROM public.fix_orphaned_sections('user-uuid-here');
