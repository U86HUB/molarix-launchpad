
import { supabase } from '../../src/integrations/supabase/client';

interface RepairResult {
  action: string;
  affected_rows: number;
  details: Record<string, any>;
}

interface RepairStageResult extends RepairResult {
  repair_stage: string;
}

/**
 * Utility class for fixing orphaned data in the platform
 * Can be used in CI/CD pipelines or as a manual maintenance tool
 */
export class OrphanedDataRepair {
  private static logResult(stage: string, result: RepairResult) {
    console.log(`\n🔧 ${stage}: ${result.action}`);
    console.log(`   📊 Affected rows: ${result.affected_rows}`);
    if (result.details) {
      console.log(`   📋 Details:`, JSON.stringify(result.details, null, 2));
    }
  }

  private static logError(stage: string, error: any) {
    console.error(`\n❌ ${stage} failed:`, error);
  }

  /**
   * Run audit to detect orphaned data across all tables
   */
  static async runAudit(): Promise<boolean> {
    try {
      console.log('\n🔍 STARTING ORPHANED DATA AUDIT');
      console.log('=====================================');

      // Since we can't execute raw SQL files directly through the client,
      // we'll check specific known issues using individual queries

      // Check orphaned sessions
      const { data: orphanedSessions, error: sessionsError } = await supabase
        .rpc('get_orphaned_sessions');

      if (sessionsError) {
        console.error('❌ Error checking orphaned sessions:', sessionsError);
        return false;
      }

      console.log(`\n📋 Orphaned Sessions: ${orphanedSessions?.length || 0}`);
      if (orphanedSessions && orphanedSessions.length > 0) {
        console.log('   Session IDs:', orphanedSessions.map(s => s.id));
      }

      // Check for sessions with missing created_by
      const { data: sessionsWithoutOwner, error: ownerError } = await supabase
        .from('onboarding_sessions')
        .select('id, clinic_name')
        .is('created_by', null);

      if (ownerError) {
        console.error('❌ Error checking sessions without owner:', ownerError);
        return false;
      }

      console.log(`\n📋 Sessions Missing Owner: ${sessionsWithoutOwner?.length || 0}`);

      // Check AI copy without owner
      const { data: copyWithoutOwner, error: copyError } = await supabase
        .from('ai_generated_copy')
        .select('id')
        .is('created_by', null);

      if (copyError) {
        console.error('❌ Error checking AI copy without owner:', copyError);
        return false;
      }

      console.log(`\n📋 AI Copy Missing Owner: ${copyWithoutOwner?.length || 0}`);

      // Check clinics without owner
      const { data: clinicsWithoutOwner, error: clinicsError } = await supabase
        .from('clinics')
        .select('id, name')
        .is('created_by', null);

      if (clinicsError) {
        console.error('❌ Error checking clinics without owner:', clinicsError);
        return false;
      }

      console.log(`\n📋 Clinics Missing Owner: ${clinicsWithoutOwner?.length || 0}`);

      console.log('\n✅ AUDIT COMPLETE');
      
      const hasIssues = (orphanedSessions?.length || 0) > 0 || 
                       (sessionsWithoutOwner?.length || 0) > 0 ||
                       (copyWithoutOwner?.length || 0) > 0 ||
                       (clinicsWithoutOwner?.length || 0) > 0;

      if (hasIssues) {
        console.log('\n⚠️  ISSUES DETECTED - Consider running repair functions');
        console.log('   Use: OrphanedDataRepair.fixAllOrphanedData()');
      } else {
        console.log('\n🎉 NO ORPHANED DATA DETECTED - Everything looks good!');
      }

      return !hasIssues;
    } catch (error) {
      console.error('❌ Audit failed:', error);
      return false;
    }
  }

  /**
   * Fix orphaned sessions
   */
  static async fixOrphanedSessions(userId?: string): Promise<boolean> {
    try {
      console.log('\n🔧 FIXING ORPHANED SESSIONS');
      console.log('==============================');

      const { data: results, error } = await supabase
        .rpc('fix_orphaned_sessions', { target_user_id: userId || null });

      if (error) {
        this.logError('Sessions Repair', error);
        return false;
      }

      if (results) {
        results.forEach((result: RepairResult) => {
          this.logResult('Sessions', result);
        });
      }

      console.log('\n✅ Sessions repair completed');
      return true;
    } catch (error) {
      this.logError('Sessions Repair', error);
      return false;
    }
  }

  /**
   * Fix orphaned AI copy
   */
  static async fixOrphanedAiCopy(userId?: string): Promise<boolean> {
    try {
      console.log('\n🔧 FIXING ORPHANED AI COPY');
      console.log('============================');

      const { data: results, error } = await supabase
        .rpc('fix_orphaned_ai_copy', { target_user_id: userId || null });

      if (error) {
        this.logError('AI Copy Repair', error);
        return false;
      }

      if (results) {
        results.forEach((result: RepairResult) => {
          this.logResult('AI Copy', result);
        });
      }

      console.log('\n✅ AI Copy repair completed');
      return true;
    } catch (error) {
      this.logError('AI Copy Repair', error);
      return false;
    }
  }

  /**
   * Fix orphaned clinics
   */
  static async fixOrphanedClinics(userId?: string): Promise<boolean> {
    try {
      console.log('\n🔧 FIXING ORPHANED CLINICS');
      console.log('============================');

      const { data: results, error } = await supabase
        .rpc('fix_orphaned_clinics', { target_user_id: userId || null });

      if (error) {
        this.logError('Clinics Repair', error);
        return false;
      }

      if (results) {
        results.forEach((result: RepairResult) => {
          this.logResult('Clinics', result);
        });
      }

      console.log('\n✅ Clinics repair completed');
      return true;
    } catch (error) {
      this.logError('Clinics Repair', error);
      return false;
    }
  }

  /**
   * Fix orphaned websites
   */
  static async fixOrphanedWebsites(userId?: string): Promise<boolean> {
    try {
      console.log('\n🔧 FIXING ORPHANED WEBSITES');
      console.log('=============================');

      const { data: results, error } = await supabase
        .rpc('fix_orphaned_websites', { target_user_id: userId || null });

      if (error) {
        this.logError('Websites Repair', error);
        return false;
      }

      if (results) {
        results.forEach((result: RepairResult) => {
          this.logResult('Websites', result);
        });
      }

      console.log('\n✅ Websites repair completed');
      return true;
    } catch (error) {
      this.logError('Websites Repair', error);
      return false;
    }
  }

  /**
   * Fix orphaned sections
   */
  static async fixOrphanedSections(userId?: string): Promise<boolean> {
    try {
      console.log('\n🔧 FIXING ORPHANED SECTIONS');
      console.log('=============================');

      const { data: results, error } = await supabase
        .rpc('fix_orphaned_sections', { target_user_id: userId || null });

      if (error) {
        this.logError('Sections Repair', error);
        return false;
      }

      if (results) {
        results.forEach((result: RepairResult) => {
          this.logResult('Sections', result);
        });
      }

      console.log('\n✅ Sections repair completed');
      return true;
    } catch (error) {
      this.logError('Sections Repair', error);
      return false;
    }
  }

  /**
   * Run comprehensive repair for all orphaned data
   */
  static async fixAllOrphanedData(userId?: string): Promise<boolean> {
    try {
      console.log('\n🚀 COMPREHENSIVE ORPHANED DATA REPAIR');
      console.log('======================================');

      const { data: results, error } = await supabase
        .rpc('fix_all_orphaned_data', { target_user_id: userId || null });

      if (error) {
        this.logError('Comprehensive Repair', error);
        return false;
      }

      if (results) {
        let currentStage = '';
        results.forEach((result: RepairStageResult) => {
          if (result.repair_stage !== currentStage) {
            currentStage = result.repair_stage;
            console.log(`\n📍 ${currentStage}`);
            console.log('─'.repeat(40));
          }
          this.logResult(result.repair_stage, result);
        });
      }

      console.log('\n🎉 COMPREHENSIVE REPAIR COMPLETED');
      console.log('   Run audit again to verify all issues are resolved');
      return true;
    } catch (error) {
      this.logError('Comprehensive Repair', error);
      return false;
    }
  }
}

/**
 * Command-line interface for the repair utility
 */
export const runMaintenanceScript = async () => {
  const args = process.argv.slice(2);
  const command = args[0];
  const userId = args[1];

  console.log('🔧 Orphaned Data Maintenance Tool');
  console.log('==================================');

  switch (command) {
    case 'audit':
      await OrphanedDataRepair.runAudit();
      break;
    
    case 'fix-sessions':
      await OrphanedDataRepair.fixOrphanedSessions(userId);
      break;
    
    case 'fix-ai-copy':
      await OrphanedDataRepair.fixOrphanedAiCopy(userId);
      break;
    
    case 'fix-clinics':
      await OrphanedDataRepair.fixOrphanedClinics(userId);
      break;
    
    case 'fix-websites':
      await OrphanedDataRepair.fixOrphanedWebsites(userId);
      break;
    
    case 'fix-sections':
      await OrphanedDataRepair.fixOrphanedSections(userId);
      break;
    
    case 'fix-all':
      await OrphanedDataRepair.fixAllOrphanedData(userId);
      break;
    
    default:
      console.log('\nUsage:');
      console.log('  npm run maintenance audit');
      console.log('  npm run maintenance fix-all [user-id]');
      console.log('  npm run maintenance fix-sessions [user-id]');
      console.log('  npm run maintenance fix-ai-copy [user-id]');
      console.log('  npm run maintenance fix-clinics [user-id]');
      console.log('  npm run maintenance fix-websites [user-id]');
      console.log('  npm run maintenance fix-sections [user-id]');
      console.log('\nNote: If no user-id is provided, operations will use the authenticated user');
      break;
  }
};

// Run if called directly
if (require.main === module) {
  runMaintenanceScript();
}
