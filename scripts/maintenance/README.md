
# Orphaned Data Maintenance Scripts

This directory contains SQL repair scripts and TypeScript utilities to detect and fix orphaned data across all platform tables. These tools future-proof the platform by preventing permission issues and maintaining data integrity.

## Overview

The platform uses Row Level Security (RLS) and requires proper ownership (`created_by`) and organization (`clinic_id`) fields. Orphaned data can cause:
- Permission denied errors
- UI inconsistencies  
- Data access issues
- Delete operation failures

## Files Structure

```
scripts/maintenance/
├── README.md                      # This file
├── audit-orphaned-data.sql        # Detect orphaned data across all tables
├── fix-orphaned-sessions.sql      # Repair onboarding_sessions issues
├── fix-orphaned-ai-copy.sql       # Repair ai_generated_copy issues  
├── fix-orphaned-clinics.sql       # Repair clinics issues
├── fix-orphaned-websites.sql      # Repair websites issues
├── fix-orphaned-sections.sql      # Repair sections issues
├── run-all-repairs.sql            # Comprehensive repair function
└── fix-orphaned-websites.ts       # TypeScript utility for programmatic repairs
```

## SQL Scripts

### 1. Audit Script
```sql
-- Run comprehensive audit
\i scripts/maintenance/audit-orphaned-data.sql
```

Detects:
- Sessions missing `created_by` or `clinic_id`
- AI copy with invalid session references
- Clinics missing `created_by`
- Websites with missing/invalid clinic references
- Sections with invalid website references

### 2. Individual Repair Scripts

Each table has its own repair function:

```sql
-- Fix sessions
SELECT * FROM public.fix_orphaned_sessions();

-- Fix AI copy  
SELECT * FROM public.fix_orphaned_ai_copy();

-- Fix clinics
SELECT * FROM public.fix_orphaned_clinics();

-- Fix websites
SELECT * FROM public.fix_orphaned_websites();

-- Fix sections
SELECT * FROM public.fix_orphaned_sections();
```

### 3. Comprehensive Repair
```sql
-- Fix everything at once
SELECT * FROM public.fix_all_orphaned_data();
```

## TypeScript Utility

The `fix-orphaned-websites.ts` utility provides programmatic access to repair functions:

```typescript
import { OrphanedDataRepair } from './scripts/maintenance/fix-orphaned-websites';

// Run audit
await OrphanedDataRepair.runAudit();

// Fix specific issues
await OrphanedDataRepair.fixOrphanedSessions();
await OrphanedDataRepair.fixOrphanedAiCopy();

// Comprehensive repair
await OrphanedDataRepair.fixAllOrphanedData();
```

### Command Line Usage

Add to your `package.json`:
```json
{
  "scripts": {
    "maintenance": "tsx scripts/maintenance/fix-orphaned-websites.ts"
  }
}
```

Then run:
```bash
# Audit for issues
npm run maintenance audit

# Fix all issues for current user
npm run maintenance fix-all

# Fix specific issues
npm run maintenance fix-sessions
npm run maintenance fix-ai-copy

# Fix for specific user
npm run maintenance fix-all user-uuid-here
```

## Repair Logic

### Onboarding Sessions
- **Missing `created_by`**: Assigns to current user
- **Missing `clinic_id`**: Creates/assigns default clinic
- **Invalid clinic references**: Assigns to default clinic

### AI Generated Copy  
- **Missing `created_by`**: Assigns to session owner
- **Invalid session references**: Deletes orphaned copy
- **Unrepairable orphans**: Deletes after logging

### Clinics
- **Missing `created_by`**: Assigns to current user (with warning)
- **Unused clinics**: Identifies but doesn't auto-delete

### Websites
- **Missing `created_by`**: Assigns to current user  
- **Missing `clinic_id`**: Creates/assigns default clinic
- **Invalid clinic references**: Assigns to default clinic

### Sections
- **Invalid website references**: Deletes orphaned sections
- **Orphaned via website**: Deletes if parent website has no clinic

## Safety Features

1. **User Validation**: All functions require authenticated user or explicit user ID
2. **Transactional**: Operations are atomic where possible  
3. **Logging**: Detailed results with affected row counts
4. **Non-Destructive Default**: Prefers assignment over deletion
5. **Ownership Respect**: Only operates on user's own data

## CI/CD Integration

Add to your deployment pipeline:

```yaml
# .github/workflows/maintenance.yml
- name: Check for orphaned data
  run: |
    npm run maintenance audit
    if [ $? -ne 0 ]; then
      echo "Orphaned data detected, running repairs..."
      npm run maintenance fix-all
    fi
```

## Monitoring

Set up regular audits:

```javascript
// Scheduled function
export const weeklyOrphanAudit = async () => {
  const hasIssues = !(await OrphanedDataRepair.runAudit());
  
  if (hasIssues) {
    // Send alert to monitoring system
    await sendAlert('Orphaned data detected in production');
  }
};
```

## Best Practices

1. **Run audit before repairs** to understand scope
2. **Test on staging** before production repairs
3. **Backup data** before running comprehensive repairs
4. **Monitor results** and verify expected outcomes
5. **Schedule regular audits** to catch issues early

## Troubleshooting

### Permission Errors
- Ensure user is authenticated before running repairs
- Check RLS policies are properly configured
- Verify user has access to their own data

### Unexpected Results
- Check function logs for detailed error messages
- Verify data relationships are as expected  
- Run audit again after repairs to confirm success

### Performance Issues
- Run repairs during low-traffic periods
- Consider batching large operations
- Monitor database performance during repairs

## Future Enhancements

1. **Automated Scheduling**: Cron-based automatic repairs
2. **Email Notifications**: Alert admins of orphaned data
3. **Recovery Logging**: Detailed audit trail of all repairs
4. **Custom Rules**: User-configurable repair policies
5. **Rollback Support**: Undo repairs if needed
