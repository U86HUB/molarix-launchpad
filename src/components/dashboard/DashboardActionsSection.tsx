
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface DashboardActionsSectionProps {
  onCreateNew: () => void;
}

const DashboardActionsSection = ({ onCreateNew }: DashboardActionsSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your Clinic Websites</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and preview your dental clinic websites
        </p>
      </div>
      <Button 
        onClick={onCreateNew} 
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-md"
        size="lg"
      >
        <Plus className="h-5 w-5" />
        Create New Website
      </Button>
    </div>
  );
};

export default DashboardActionsSection;
