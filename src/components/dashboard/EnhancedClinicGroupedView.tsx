
import { DashboardSession } from '@/hooks/useDashboardSessions';
import { useClinicGrouping } from '@/hooks/useClinicGrouping';
import { useUserClinics } from '@/hooks/useUserClinics';
import ClinicAccordionCard from './ClinicAccordionCard';
import DashboardEmptyClinicState from './DashboardEmptyClinicState';

interface EnhancedClinicGroupedViewProps {
  sessions: DashboardSession[];
  selectedClinicId?: string;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate?: () => void;
  onCreateWebsite?: () => void;
}

const EnhancedClinicGroupedView = ({
  sessions,
  selectedClinicId,
  onContinueEditing,
  onPreview,
  onDelete,
  onDuplicate,
  onUpdate,
  onCreateWebsite
}: EnhancedClinicGroupedViewProps) => {
  const { clinics } = useUserClinics();
  const clinicGroups = useClinicGrouping(sessions, selectedClinicId);

  // If no clinics exist at all, show empty state
  if (clinics.length === 0) {
    return (
      <DashboardEmptyClinicState 
        onCreateClinic={() => onCreateWebsite?.()}
      />
    );
  }

  // If filtering by specific clinic and no sessions exist for that clinic
  if (selectedClinicId && clinicGroups.length === 0) {
    const selectedClinic = clinics.find(c => c.id === selectedClinicId);
    return (
      <ClinicAccordionCard
        key={selectedClinicId}
        clinicId={selectedClinicId}
        clinicName={selectedClinic?.name || 'Unknown Clinic'}
        sessions={[]}
        onContinueEditing={onContinueEditing}
        onPreview={onPreview}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onUpdate={onUpdate}
        onCreateWebsite={onCreateWebsite}
        defaultOpen={true}
      />
    );
  }

  // Show all clinics with their sessions, including clinics with no sessions
  const allClinicsWithSessions = clinics.map(clinic => {
    const group = clinicGroups.find(g => g.clinicId === clinic.id);
    return {
      clinicId: clinic.id,
      clinicName: clinic.name,
      sessions: group?.sessions || [],
      clinic: clinic
    };
  });

  // Add sessions without clinic_id (legacy sessions)
  const noClinicGroup = clinicGroups.find(g => g.clinicId === null);
  if (noClinicGroup && !selectedClinicId) {
    allClinicsWithSessions.push({
      clinicId: null,
      clinicName: noClinicGroup.clinicName,
      sessions: noClinicGroup.sessions,
      clinic: null
    });
  }

  return (
    <div className="space-y-6">
      {allClinicsWithSessions.map((group) => (
        <ClinicAccordionCard
          key={group.clinicId || 'no-clinic'}
          clinicId={group.clinicId}
          clinicName={group.clinicName}
          sessions={group.sessions}
          onContinueEditing={onContinueEditing}
          onPreview={onPreview}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onUpdate={onUpdate}
          onCreateWebsite={onCreateWebsite}
          defaultOpen={group.sessions.length > 0 || selectedClinicId === group.clinicId}
        />
      ))}
    </div>
  );
};

export default EnhancedClinicGroupedView;
