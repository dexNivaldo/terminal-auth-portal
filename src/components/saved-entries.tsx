import { Bookmark, Search, Trash2 } from 'lucide-react';

import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '@/lib/cn';
import type { AppFilter, RoleFilter } from '@/hooks/use-auth-entry';
import { roleLabels } from '@/hooks/use-auth-entry';
import type { AuthEntry } from '@/types/auth-entry';
import { formatDate } from '@/utils/format';

const roleFilters: Array<{ value: RoleFilter; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'AA', label: 'Agent' },
  { value: 'CARRIER', label: 'Carrier' },
  { value: 'BROKER', label: 'Broker' },
];

const applicationFilters: Array<{ value: AppFilter; label: string }> = [
  { value: 'ALL', label: 'All applications' },
  { value: 'TAS', label: 'TAS' },
  { value: 'DPE', label: 'DPE' },
];

interface SavedEntriesProps {
  entries: AuthEntry[];
  filteredEntries: AuthEntry[];
  loading: boolean;
  error: unknown;
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (value: RoleFilter) => void;
  appFilter: AppFilter;
  onAppFilterChange: (value: AppFilter) => void;
  confirmDeleteId: number | null;
  onRequestDelete: (id: number) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: number) => void;
  onUse: (entry: AuthEntry) => void;
  onRetry: () => void;
}

export function SavedEntries({
  entries,
  filteredEntries,
  loading,
  error,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  appFilter,
  onAppFilterChange,
  confirmDeleteId,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onUse,
  onRetry,
}: SavedEntriesProps) {
  return (
    <section aria-labelledby="saved-entries-heading" className="mt-8">
      <div className="sticky top-14 z-20 border-b border-zinc-200 bg-zinc-50 pb-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="saved-entries-heading"
              className="text-base font-semibold tracking-tight text-zinc-900"
            >
              Saved entries
            </h2>
            <p className="mt-0.5 hidden text-sm text-zinc-500 sm:block">
              Reuse a configuration to generate a token in one click.
            </p>
          </div>
          <span className="text-sm text-zinc-500">
            {filteredEntries.length} of {entries.length}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search patente or terminal"
              aria-label="Search saved entries"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Filter by role"
              className="flex rounded-lg border border-zinc-300 bg-white p-0.5"
            >
              {roleFilters.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={roleFilter === option.value}
                  onClick={() => onRoleFilterChange(option.value)}
                  className={cn(
                    'h-7 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40',
                    roleFilter === option.value
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:text-zinc-900'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Select
              value={appFilter}
              onValueChange={(value) => onAppFilterChange(value as AppFilter)}
            >
              <SelectTrigger aria-label="Filter by application" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {applicationFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <EntriesSkeleton />
        ) : error ? (
          <Alert variant="error" title="Could not load saved entries">
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Retry
              </Button>
              <span className="text-xs">
                Your saved configurations could not be retrieved.
              </span>
            </div>
          </Alert>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
            <div className="rounded-full bg-zinc-100 p-3">
              <Bookmark className="size-5 text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-700">
              {entries.length === 0 ? 'No saved entries yet' : 'No matching entries'}
            </p>
            <p className="max-w-sm text-xs text-zinc-500">
              {entries.length === 0
                ? 'Save a configuration from the form to reuse it later.'
                : 'Try a different search term or clear the filters.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
            {filteredEntries.map((entry) => (
              <li
                key={entry.id}
                className="relative flex cursor-pointer flex-col gap-3 p-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">
                      {entry.patente}
                    </span>
                    <Badge variant="neutral">{entry.terminal?.code}</Badge>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                    <Badge variant="neutral">{roleLabels[entry.role]}</Badge>
                    <Badge variant="brand">{entry.application}</Badge>
                    {entry.created_at && (
                      <span>{formatDate(entry.created_at)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label={`Use entry ${entry.patente}`}
                    className="after:absolute after:inset-0 after:content-['']"
                    onClick={() => onUse(entry)}
                  >
                    Use
                  </Button>
                  {confirmDeleteId === entry.id ? (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="relative z-10"
                        onClick={() => onConfirmDelete(entry.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative z-10"
                        onClick={onCancelDelete}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete entry ${entry.patente}`}
                      className="relative z-10"
                      onClick={() => onRequestDelete(entry.id)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function EntriesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading saved entries">
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {[0, 1, 2].map((item) => (
          <li key={item} className="flex items-center justify-between p-4">
            <div className="flex w-full flex-col gap-2 pr-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-20" />
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading saved entries…</span>
    </div>
  );
}
