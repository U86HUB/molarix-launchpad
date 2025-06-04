
-- Fix orphaned clinics records
-- This script repairs clinics missing critical fields

-- ============================================================================
-- REPAIR FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fix_orphaned_clinics(target_user_id UUID DEFAULT NULL)
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
  clinics_fixed INTEGER := 0;
  clinics_deleted INTEGER := 0;
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

  -- Step 1: Fix clinics missing created_by (assign to current user)
  -- Note: This is a risky operation and should be done carefully
  UPDATE clinics 
  SET created_by = user_id_to_use
  WHERE created_by IS NULL;
  
  GET DIAGNOSTICS clinics_fixed = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'FIXED_MISSING_CREATED_BY'::TEXT,
    clinics_fixed,
    jsonb_build_object(
      'user_id', user_id_to_use,
      'clinics_assigned', clinics_fixed,
      'warning', 'Clinics were assigned to current user - verify ownership'
    );

  -- Step 2: Identify unused clinics (optional cleanup)
  -- We don't auto-delete these as they might be intentionally empty
  RETURN QUERY 
  SELECT 
    'IDENTIFIED_UNUSED_CLINICS'::TEXT,
    COUNT(*)::INTEGER,
    jsonb_build_object(
      'unused_clinic_ids', ARRAY_AGG(c.id),
      'note', 'These clinics have no sessions - manual review recommended'
    )
  FROM clinics c
  LEFT JOIN onboarding_sessions s ON c.id = s.clinic_id
  WHERE s.clinic_id IS NULL
    AND c.created_by = user_id_to_use;

  RETURN QUERY SELECT 
    'REPAIR_COMPLETE'::TEXT,
    clinics_fixed,
    jsonb_build_object(
      'total_fixed', clinics_fixed
    );
END;
$$;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
-- Fix for current authenticated user:
-- SELECT * FROM public.fix_orphaned_clinics();

-- Fix for specific user:
-- SELECT * FROM public.fix_orphaned_clinics('user-uuid-here');
