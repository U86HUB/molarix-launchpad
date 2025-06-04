
-- Fix orphaned websites records
-- This script repairs websites missing critical fields

-- ============================================================================
-- REPAIR FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fix_orphaned_websites(target_user_id UUID DEFAULT NULL)
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
  websites_fixed INTEGER := 0;
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

  -- Step 1: Fix websites missing created_by
  UPDATE websites 
  SET created_by = user_id_to_use
  WHERE created_by IS NULL;
  
  GET DIAGNOSTICS websites_fixed = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'FIXED_MISSING_CREATED_BY'::TEXT,
    websites_fixed,
    jsonb_build_object(
      'user_id', user_id_to_use,
      'websites_fixed', websites_fixed
    );

  -- Step 2: Get or create default clinic for user
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

  -- Step 3: Fix websites missing clinic_id
  UPDATE websites 
  SET clinic_id = default_clinic_id
  WHERE clinic_id IS NULL 
    AND created_by = user_id_to_use;
  
  GET DIAGNOSTICS websites_fixed = ROW_COUNT;
  
  RETURN QUERY SELECT 
    'FIXED_MISSING_CLINIC_ID'::TEXT,
    websites_fixed,
    jsonb_build_object(
      'clinic_id', default_clinic_id,
      'websites_assigned', websites_fixed
    );

  -- Step 4: Fix websites with invalid clinic references
  UPDATE websites 
  SET clinic_id = default_clinic_id
  WHERE clinic_id IS NOT NULL 
    AND NOT EXISTS (
      SELECT 1 FROM clinics c WHERE c.id = clinic_id
    )
    AND created_by = user_id_to_use;

  RETURN QUERY SELECT 
    'REPAIR_COMPLETE'::TEXT,
    websites_fixed,
    jsonb_build_object(
      'total_fixed', websites_fixed,
      'default_clinic_used', default_clinic_id
    );
END;
$$;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
-- Fix for current authenticated user:
-- SELECT * FROM public.fix_orphaned_websites();

-- Fix for specific user:
-- SELECT * FROM public.fix_orphaned_websites('user-uuid-here');
