
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Copy } from 'lucide-react';

interface SessionCardActionsProps {
  sessionId: string;
  clinicName: string;
  onContinueEditing: (sessionId: string) => void;
  onPreview: (sessionId: string) => void;
  onDelete: (sessionId: string, clinicName: string) => void;
  onDuplicate: (sessionId: string, clinicName: string) => void;
}

const SessionCardActions = ({ 
  sessionId, 
  clinicName, 
  onContinueEditing, 
  onPreview, 
  onDelete, 
  onDuplicate 
}: SessionCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        onClick={() => onContinueEditing(sessionId)}
        className="flex-1 flex items-center gap-1"
      >
        <Edit className="h-3 w-3" />
        Continue Editing
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onPreview(sessionId)}
        className="flex items-center gap-1"
      >
        <Eye className="h-3 w-3" />
        Preview
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onDuplicate(sessionId, clinicName)}
        className="flex items-center gap-1"
      >
        <Copy className="h-3 w-3" />
        Duplicate
      </Button>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onDelete(sessionId, clinicName)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default SessionCardActions;
