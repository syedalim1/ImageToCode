export interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: { content: string };
  description: string | null;
  email: string | null;
  createdAt: string;
  options: string[];
}

export interface DesignCardProps {
  design: Design;
  index: number;
}

export interface DesignListItemProps {
  design: Design;
  index: number;
}

export interface EmptyStateProps {
  hasSearchOrFilter: boolean;
}

export interface ErrorStateProps {
  error: string;
  retryFn: () => void;
}

export interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  filterModel: string | null;
  setFilterModel: (model: string | null) => void;
  uniqueModels: string[];
  isRefreshing: boolean;
  handleRefresh: () => void;
}

export interface StatsBarProps {
  designsCount: number;
  generatedCodeCount: number;
  thisWeekCount: number;
  filteredResultsCount: number;
}
