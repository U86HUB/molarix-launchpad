
import { useState } from 'react';
import { DashboardSession } from '@/hooks/useDashboardSessions';
import EnhancedSessionCard from './EnhancedSessionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Building2, ChevronDown, ChevronRight, Globe, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClinicAccordionCardProps {
  clinicId: string | null;
  clinicName: string;
  sessions: DashboardSession[];
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
  onUpdate?: () => void;
  onCreateWebsite?: () => void;
  defaultOpen?: boolean;
}

const ClinicAccordionCard = ({
  clinicId,
  clinicName,
  sessions,
  onContinueEditing,
  onPreview,
  onDelete,
  onDuplicate,
  onUpdate,
  onCreateWebsite,
  defaultOpen = true
}: ClinicAccordionCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const clinic = sessions[0]?.clinic;
  const websiteCount = sessions.length;

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {clinicName}
                  </h3>
                  {clinic?.address && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {clinic.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {websiteCount} website{websiteCount !== 1 ? 's' : ''}
                </Badge>
                {onCreateWebsite && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateWebsite();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Website
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {sessions.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Globe className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No websites yet
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first website for {clinicName}
                </p>
                {onCreateWebsite && (
                  <Button onClick={onCreateWebsite} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Website
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                  <EnhancedSessionCard
                    key={session.id}
                    session={session}
                    onContinueEditing={onContinueEditing}
                    onPreview={onPreview}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onUpdate={onUpdate}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ClinicAccordionCard;
