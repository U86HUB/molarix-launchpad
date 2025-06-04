
import { useState, useEffect } from 'react';
import { SortOption, FilterOption } from '@/hooks/useSessionFilters';
import { GroupingType } from '@/hooks/useSessionGrouping';

export const useDashboardState = () => {
  // Filtering, sorting, and grouping state
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupingType>('clinic');
  const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [previewSessionId, setPreviewSessionId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Getting started guide state
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedClinicId(undefined);
  };

  const handleResetAllFilters = () => {
    setSortBy('newest');
    setFilterBy('all');
    setSearchQuery('');
    setSelectedClinicId(undefined);
  };

  return {
    // State
    sortBy,
    filterBy,
    groupBy,
    selectedClinicId,
    searchQuery,
    previewSessionId,
    isPreviewModalOpen,
    isCreateModalOpen,
    showGettingStarted,
    
    // Setters
    setSortBy,
    setFilterBy,
    setGroupBy,
    setSelectedClinicId,
    setSearchQuery,
    setPreviewSessionId,
    setIsPreviewModalOpen,
    setIsCreateModalOpen,
    setShowGettingStarted,
    
    // Handlers
    handleClearFilters,
    handleResetAllFilters,
  };
};
