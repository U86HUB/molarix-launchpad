
import { Input } from "@/components/ui/input";
import ClinicFilter from './ClinicFilter';
import DashboardFilters from './DashboardFilters';
import { SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { GroupingType } from '@/hooks/useSessionGrouping';
import { Search } from 'lucide-react';

interface DashboardFiltersSectionProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  groupBy: GroupingType;
  selectedClinicId?: string;
  searchQuery: string;
  totalCount: number;
  filteredCount: number;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onGroupChange: (group: GroupingType) => void;
  onClinicChange: (clinicId?: string) => void;
  onSearchChange: (query: string) => void;
}

const DashboardFiltersSection = ({
  sortBy,
  filterBy,
  groupBy,
  selectedClinicId,
  searchQuery,
  totalCount,
  filteredCount,
  onSortChange,
  onFilterChange,
  onGroupChange,
  onClinicChange,
  onSearchChange
}: DashboardFiltersSectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <ClinicFilter
              selectedClinicId={selectedClinicId}
              onClinicChange={onClinicChange}
            />
            
            <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600" />
            
            <DashboardFilters
              sortBy={sortBy}
              filterBy={filterBy}
              groupBy={groupBy}
              onSortChange={onSortChange}
              onFilterChange={onFilterChange}
              onGroupChange={onGroupChange}
              totalCount={totalCount}
              filteredCount={filteredCount}
            />
          </div>
          
          {/* Search Input */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search websites..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFiltersSection;
