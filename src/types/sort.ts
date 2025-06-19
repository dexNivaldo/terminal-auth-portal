export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  id: string
  label: string
  icon?: string
}

export interface SortState {
  field: string
  direction: SortDirection
}