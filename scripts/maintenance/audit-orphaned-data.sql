
-- Comprehensive audit script to detect orphaned data across all platform tables
-- Run this to identify potential permission issues before they cause problems

-- ============================================================================
-- ONBOARDING SESSIONS AUDIT
-- ============================================================================
SELECT 'ONBOARDING_SESSIONS_AUDIT' as audit_type, COUNT(*) as total_rows FROM onboarding_sessions;

-- Sessions missing created_by (critical - breaks RLS)
SELECT 
  'SESSIONS_MISSING_CREATED_BY' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as session_ids
FROM onboarding_sessions 
WHERE created_by IS NULL;

-- Sessions missing clinic_id (causes orphaned state)
SELECT 
  'SESSIONS_MISSING_CLINIC_ID' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as session_ids
FROM onboarding_sessions 
WHERE clinic_id IS NULL;

-- Sessions with invalid clinic_id references
SELECT 
  'SESSIONS_INVALID_CLINIC_REF' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(s.id) as session_ids
FROM onboarding_sessions s
LEFT JOIN clinics c ON s.clinic_id = c.id
WHERE s.clinic_id IS NOT NULL AND c.id IS NULL;

-- ============================================================================
-- AI GENERATED COPY AUDIT
-- ============================================================================
SELECT 'AI_COPY_AUDIT' as audit_type, COUNT(*) as total_rows FROM ai_generated_copy;

-- AI copy missing created_by (critical - breaks RLS)
SELECT 
  'AI_COPY_MISSING_CREATED_BY' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as copy_ids
FROM ai_generated_copy 
WHERE created_by IS NULL;

-- AI copy with invalid session references
SELECT 
  'AI_COPY_INVALID_SESSION_REF' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(ac.id) as copy_ids
FROM ai_generated_copy ac
LEFT JOIN onboarding_sessions s ON ac.session_id = s.id
WHERE s.id IS NULL;

-- AI copy orphaned (session exists but has no clinic)
SELECT 
  'AI_COPY_ORPHANED_VIA_SESSION' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(ac.id) as copy_ids
FROM ai_generated_copy ac
JOIN onboarding_sessions s ON ac.session_id = s.id
WHERE s.clinic_id IS NULL;

-- ============================================================================
-- CLINICS AUDIT
-- ============================================================================
SELECT 'CLINICS_AUDIT' as audit_type, COUNT(*) as total_rows FROM clinics;

-- Clinics missing created_by (critical - breaks RLS)
SELECT 
  'CLINICS_MISSING_CREATED_BY' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as clinic_ids
FROM clinics 
WHERE created_by IS NULL;

-- Unused clinics (no sessions reference them)
SELECT 
  'CLINICS_UNUSED' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(c.id) as clinic_ids
FROM clinics c
LEFT JOIN onboarding_sessions s ON c.id = s.clinic_id
WHERE s.clinic_id IS NULL;

-- ============================================================================
-- WEBSITES AUDIT
-- ============================================================================
SELECT 'WEBSITES_AUDIT' as audit_type, COUNT(*) as total_rows FROM websites;

-- Websites missing created_by (critical - breaks RLS)
SELECT 
  'WEBSITES_MISSING_CREATED_BY' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as website_ids
FROM websites 
WHERE created_by IS NULL;

-- Websites missing clinic_id (critical - breaks organization)
SELECT 
  'WEBSITES_MISSING_CLINIC_ID' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as website_ids
FROM websites 
WHERE clinic_id IS NULL;

-- Websites with invalid clinic references
SELECT 
  'WEBSITES_INVALID_CLINIC_REF' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(w.id) as website_ids
FROM websites w
LEFT JOIN clinics c ON w.clinic_id = c.id
WHERE w.clinic_id IS NOT NULL AND c.id IS NULL;

-- ============================================================================
-- SECTIONS AUDIT
-- ============================================================================
SELECT 'SECTIONS_AUDIT' as audit_type, COUNT(*) as total_rows FROM sections;

-- Sections with invalid website references
SELECT 
  'SECTIONS_INVALID_WEBSITE_REF' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(s.id) as section_ids
FROM sections s
LEFT JOIN websites w ON s.website_id = w.id
WHERE w.id IS NULL;

-- Sections orphaned via website (website has no clinic)
SELECT 
  'SECTIONS_ORPHANED_VIA_WEBSITE' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(s.id) as section_ids
FROM sections s
JOIN websites w ON s.website_id = w.id
WHERE w.clinic_id IS NULL;

-- ============================================================================
-- PROFILES AUDIT
-- ============================================================================
SELECT 'PROFILES_AUDIT' as audit_type, COUNT(*) as total_rows FROM profiles;

-- Note: Profiles table doesn't need created_by since it references auth.users directly
-- But we can check for consistency issues

-- Profiles with missing or empty names
SELECT 
  'PROFILES_INCOMPLETE_DATA' as issue_type,
  COUNT(*) as affected_rows,
  ARRAY_AGG(id) as profile_ids
FROM profiles 
WHERE (first_name IS NULL OR first_name = '') 
  AND (last_name IS NULL OR last_name = '');

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT 
  'AUDIT_COMPLETE' as status,
  NOW() as audit_timestamp,
  'Review results above for orphaned data' as next_steps;
