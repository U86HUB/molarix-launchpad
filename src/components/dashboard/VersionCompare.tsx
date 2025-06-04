
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Diff, GitCompare } from "lucide-react";
import { GeneratedCopy } from "@/types/copy";
import dayjs from "dayjs";

interface CopyVersion {
  id: string;
  data: GeneratedCopy;
  type: 'draft' | 'published';
  created_at: string;
}

interface VersionCompareProps {
  versions: CopyVersion[];
  currentVersionId: string;
}

interface VersionDifference {
  section: string;
  field: string;
  oldValue: string;
  newValue: string;
}

const VersionCompare = ({ versions, currentVersionId }: VersionCompareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState<string>("");

  const currentVersion = versions.find(v => v.id === currentVersionId);
  const compareVersion = versions.find(v => v.id === compareVersionId);

  const getVersionDiff = (oldCopy: GeneratedCopy, newCopy: GeneratedCopy): VersionDifference[] => {
    const differences: VersionDifference[] = [];

    // Compare homepage fields
    if (oldCopy.homepage?.headline !== newCopy.homepage?.headline) {
      differences.push({
        section: 'Homepage',
        field: 'headline',
        oldValue: oldCopy.homepage?.headline || '',
        newValue: newCopy.homepage?.headline || ''
      });
    }

    if (oldCopy.homepage?.subheadline !== newCopy.homepage?.subheadline) {
      differences.push({
        section: 'Homepage',
        field: 'subheadline',
        oldValue: oldCopy.homepage?.subheadline || '',
        newValue: newCopy.homepage?.subheadline || ''
      });
    }

    // Compare services
    if (oldCopy.services?.title !== newCopy.services?.title) {
      differences.push({
        section: 'Services',
        field: 'title',
        oldValue: oldCopy.services?.title || '',
        newValue: newCopy.services?.title || ''
      });
    }

    // Compare about section
    if (oldCopy.about?.mission !== newCopy.about?.mission) {
      differences.push({
        section: 'About',
        field: 'mission',
        oldValue: oldCopy.about?.mission || '',
        newValue: newCopy.about?.mission || ''
      });
    }

    return differences;
  };

  if (versions.length < 2) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <GitCompare className="h-4 w-4 mr-2" />
          Compare Versions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Version Comparison</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Current Version</label>
            <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-950 rounded border">
              {currentVersion && (
                <div className="flex items-center gap-2">
                  <Badge variant={currentVersion.type === 'published' ? 'default' : 'outline'}>
                    {currentVersion.type}
                  </Badge>
                  <span className="text-sm">
                    {dayjs(currentVersion.created_at).format('MMM D, YYYY')}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium">Compare With</label>
            <select 
              className="mt-1 w-full p-2 border rounded"
              value={compareVersionId}
              onChange={(e) => setCompareVersionId(e.target.value)}
            >
              <option value="">Select a version</option>
              {versions
                .filter(v => v.id !== currentVersionId)
                .map(version => (
                  <option key={version.id} value={version.id}>
                    {version.type} - {dayjs(version.created_at).format('MMM D, YYYY')}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {currentVersion && compareVersion ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Diff className="h-5 w-5" />
                Changes Detected
              </h3>
              
              {(() => {
                const differences = getVersionDiff(compareVersion.data, currentVersion.data);
                
                if (differences.length === 0) {
                  return (
                    <p className="text-gray-600 dark:text-gray-400">
                      No differences found between these versions.
                    </p>
                  );
                }

                return differences.map((diff, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {diff.section} → {diff.field}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-2">
                        <div className="text-sm font-medium text-red-800 dark:text-red-200">- Old</div>
                        <div className="text-sm text-red-700 dark:text-red-300">{diff.oldValue}</div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-2">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200">+ New</div>
                        <div className="text-sm text-green-700 dark:text-green-300">{diff.newValue}</div>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a version to compare
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionCompare;
