
import { GeneratedCopy } from '@/types/copy';
import { Section } from '@/types/website';

interface WebsiteBuilderStatusBarProps {
  sections: Section[];
  currentCopy: GeneratedCopy | null;
  copyMode: 'draft' | 'published';
}

const WebsiteBuilderStatusBar = ({ sections, currentCopy, copyMode }: WebsiteBuilderStatusBarProps) => {
  if (!currentCopy && sections.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-b px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-blue-700">
            Sections: {sections.length}
          </span>
          <span className="text-blue-700">
            Copy: {currentCopy ? `${copyMode} available` : 'No copy loaded'}
          </span>
        </div>
        {!currentCopy && (
          <span className="text-amber-600">
            Generate copy in the AI Preview to see content
          </span>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilderStatusBar;
