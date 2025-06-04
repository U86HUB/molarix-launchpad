
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { ArrowDown, ArrowUp, ListFilter } from 'lucide-react';

interface DashboardFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  totalCount: number;
  filteredCount: number;
}

const DashboardFilters = ({ 
  sortBy, 
  filterBy, 
  onSortChange, 
  onFilterChange, 
  totalCount, 
  filteredCount 
}: DashboardFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[140px]">
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

            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
              <Select value={filterBy} onValueChange={onFilterChange}>
                <SelectTrigger className="w-[140px]">
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

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredCount === totalCount 
              ? `${totalCount} website${totalCount !== 1 ? 's' : ''}`
              : `${filteredCount} of ${totalCount} website${totalCount !== 1 ? 's' : ''}`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
