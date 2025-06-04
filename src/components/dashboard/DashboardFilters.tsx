
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { GroupingType } from '@/hooks/useSessionGrouping';
import { ArrowDown, ListFilter, Layers } from 'lucide-react';

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
    <Card className="mb-6 shadow-sm border-border">
      <CardContent className="pt-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-3">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Group by:</span>
              <Select value={groupBy} onValueChange={onGroupChange}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:block w-px h-6 bg-border" />

            <div className="flex items-center gap-3">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[130px] h-9">
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

            <div className="hidden sm:block w-px h-6 bg-border" />

            <div className="flex items-center gap-3">
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter by:</span>
              <Select value={filterBy} onValueChange={onFilterChange}>
                <SelectTrigger className="w-[140px] h-9">
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

          <div className="text-sm text-muted-foreground">
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
