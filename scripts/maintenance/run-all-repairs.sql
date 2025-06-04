
-- Master repair script that runs all orphaned data fixes
-- Use this for comprehensive cleanup

-- ============================================================================
-- COMPREHENSIVE REPAIR FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fix_all_orphaned_data(target_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  repair_stage TEXT,
  action TEXT,
  affected_rows INTEGER,
  details JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_to_use UUID;
BEGIN
  -- Use provided user_id or default to auth.uid()
  user_id_to_use := COALESCE(target_user_id, auth.uid());
  
  IF user_id_to_use IS NULL THEN
    RETURN QUERY SELECT 
      'ERROR'::TEXT,
      'AUTHENTICATION_REQUIRED'::TEXT,
      0,
      '{"error": "No user ID provided and no authenticated user"}'::JSONB;
    RETURN;
  END IF;

  -- Start repair process
  RETURN QUERY SELECT 
    'INITIALIZATION'::TEXT,
    'REPAIR_STARTED'::TEXT,
    0,
    jsonb_build_object(
      'user_id', user_id_to_use,
      'timestamp', NOW(),
      'stage', 'Starting comprehensive data repair'
    );

  -- Stage 1: Fix clinics first (other tables depend on them)
  RETURN QUERY 
  SELECT 
    'STAGE_1_CLINICS'::TEXT,
    r.action,
    r.affected_rows,
    r.details
  FROM public.fix_orphaned_clinics(user_id_to_use) r;

  -- Stage 2: Fix sessions (depend on clinics)
  RETURN QUERY 
  SELECT 
    'STAGE_2_SESSIONS'::TEXT,
    r.action,
    r.affected_rows,
    r.details
  FROM public.fix_orphaned_sessions(user_id_to_use) r;

  -- Stage 3: Fix AI copy (depends on sessions)
  RETURN QUERY 
  SELECT 
    'STAGE_3_AI_COPY'::TEXT,
    r.action,
    r.affected_rows,
    r.details
  FROM public.fix_orphaned_ai_copy(user_id_to_use) r;

  -- Stage 4: Fix websites (depend on clinics)
  RETURN QUERY 
  SELECT 
    'STAGE_4_WEBSITES'::TEXT,
    r.action,
    r.affected_rows,
    r.details
  FROM public.fix_orphaned_websites(user_id_to_use) r;

  -- Stage 5: Fix sections (depend on websites)
  RETURN QUERY 
  SELECT 
    'STAGE_5_SECTIONS'::TEXT,
    r.action,
    r.affected_rows,
    r.details
  FROM public.fix_orphaned_sections(user_id_to_use) r;

  -- Final summary
  RETURN QUERY SELECT 
    'COMPLETION'::TEXT,
    'REPAIR_FINISHED'::TEXT,
    0,
    jsonb_build_object(
      'status', 'All repair stages completed',
      'timestamp', NOW(),
      'user_id', user_id_to_use,
      'recommendation', 'Run audit script to verify repairs'
    );
END;
$$;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
-- Run comprehensive repair for current user:
-- SELECT * FROM public.fix_all_orphaned_data();

-- Run comprehensive repair for specific user:
-- SELECT * FROM public.fix_all_orphaned_data('user-uuid-here');

-- Quick audit after repair:
-- \i scripts/maintenance/audit-orphaned-data.sql
