
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { GroupingType } from '@/hooks/useSessionGrouping';
import { ArrowUpDown, Filter, Layers } from 'lucide-react';

interface DashboardFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  groupBy: GroupingType;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onGroupChange: (group: GroupingType) => void;
  totalCount: number;
  filteredCount: number;
}

const DashboardFilters = ({ 
  sortBy, 
  filterBy, 
  groupBy,
  onSortChange, 
  onFilterChange, 
  onGroupChange,
  totalCount, 
  filteredCount 
}: DashboardFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Group:</span>
          <Select value={groupBy} onValueChange={onGroupChange}>
            <SelectTrigger className="w-[120px] h-9 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="clinic">By Clinic</SelectItem>
              <SelectItem value="template">By Template</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Sort:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px] h-9 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Filter:</span>
          <Select value={filterBy} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[160px] h-9 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="ready-to-publish">Ready to Publish</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {filteredCount === totalCount 
          ? `${totalCount} website${totalCount !== 1 ? 's' : ''}`
          : `${filteredCount} of ${totalCount} website${totalCount !== 1 ? 's' : ''}`
        }
      </div>
    </div>
  );
};

export default DashboardFilters;
