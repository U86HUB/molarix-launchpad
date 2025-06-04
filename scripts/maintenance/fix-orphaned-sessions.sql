
-- Fix orphaned onboarding_sessions
-- This script repairs sessions missing critical fields

-- ============================================================================
-- REPAIR FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fix_orphaned_sessions(target_user_id UUID DEFAULT NULL)
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
  sessions_fixed INTEGER := 0;
  clinic_assignments_fixed INTEGER := 0;
  default_clinic_id UUID;
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

  -- Step 1: Fix sessions missing created_by
  UPDATE onboarding_sessions 
  SET 
    created_by = user_id_to_use,
    last_updated = NOW()
  WHERE created_by IS NULL;
  
  GET DIAGNOSTICS sessions_fixed = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'FIXED_MISSING_CREATED_BY'::TEXT,
    sessions_fixed,
    jsonb_build_object(
      'user_id', user_id_to_use,
      'timestamp', NOW()
    );

  -- Step 2: Create default clinic for user if none exists
  SELECT id INTO default_clinic_id 
  FROM clinics 
  WHERE created_by = user_id_to_use 
  ORDER BY created_at ASC 
  LIMIT 1;

  IF default_clinic_id IS NULL THEN
    INSERT INTO clinics (name, created_by)
    VALUES ('Default Clinic', user_id_to_use)
    RETURNING id INTO default_clinic_id;
    
    RETURN QUERY SELECT 
      'CREATED_DEFAULT_CLINIC'::TEXT,
      1,
      jsonb_build_object(
        'clinic_id', default_clinic_id,
        'clinic_name', 'Default Clinic'
      );
  END IF;

  -- Step 3: Assign orphaned sessions to default clinic
  UPDATE onboarding_sessions 
  SET 
    clinic_id = default_clinic_id,
    last_updated = NOW()
  WHERE clinic_id IS NULL 
    AND created_by = user_id_to_use;
  
  GET DIAGNOSTICS clinic_assignments_fixed = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'ASSIGNED_TO_DEFAULT_CLINIC'::TEXT,
    clinic_assignments_fixed,
    jsonb_build_object(
      'clinic_id', default_clinic_id,
      'sessions_assigned', clinic_assignments_fixed
    );

  -- Step 4: Clean up invalid clinic references
  UPDATE onboarding_sessions 
  SET 
    clinic_id = default_clinic_id,
    last_updated = NOW()
  WHERE clinic_id IS NOT NULL 
    AND NOT EXISTS (
      SELECT 1 FROM clinics c WHERE c.id = clinic_id
    );

  RETURN QUERY SELECT 
    'REPAIR_COMPLETE'::TEXT,
    sessions_fixed + clinic_assignments_fixed,
    jsonb_build_object(
      'total_fixed', sessions_fixed + clinic_assignments_fixed,
      'default_clinic_used', default_clinic_id
    );
END;
$$;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
-- Fix for current authenticated user:
-- SELECT * FROM public.fix_orphaned_sessions();

-- Fix for specific user:
-- SELECT * FROM public.fix_orphaned_sessions('user-uuid-here');
