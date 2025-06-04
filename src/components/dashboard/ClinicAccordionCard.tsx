
import { useState } from 'react';
import { DashboardSession } from '@/hooks/useDashboardSessions';
import EnhancedSessionCard from './EnhancedSessionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Building2, ChevronDown, ChevronRight, Globe, Plus, MapPin, Phone, Mail } from 'lucide-react';
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

  // Calculate some simple analytics
  const publishedCount = sessions.filter(s => s.completion_score === 100).length;
  const draftCount = sessions.filter(s => (s.completion_score || 0) < 50).length;
  const inProgressCount = sessions.filter(s => (s.completion_score || 0) >= 50 && (s.completion_score || 0) < 100).length;

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {clinicName}
                  </h3>
                  {clinic?.address && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{clinic.address}</span>
                    </div>
                  )}
                  {(clinic?.phone || clinic?.email) && (
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {clinic.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{clinic.phone}</span>
                        </div>
                      )}
                      {clinic.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{clinic.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {websiteCount} website{websiteCount !== 1 ? 's' : ''}
                  </Badge>
                  {websiteCount > 0 && (
                    <div className="flex gap-1">
                      {publishedCount > 0 && (
                        <Badge variant="default" className="text-xs">
                          {publishedCount} live
                        </Badge>
                      )}
                      {inProgressCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {inProgressCount} in progress
                        </Badge>
                      )}
                      {draftCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {draftCount} draft{draftCount !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                {onCreateWebsite && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 flex-shrink-0"
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
