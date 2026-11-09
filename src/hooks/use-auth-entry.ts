import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { createAuthEntry, deleteEntry, getAuthEntries } from '../services/auth-entries.service';
import { authTerminal } from '../services/auth.service';
import { AuthResponse } from '../types/auth';
import type { AuthApplication, AuthEntry, AuthEntryInput, EntryRole } from '../types/auth-entry';
import type { Terminal } from '../types/terminal';
import useAsyncList from './use-async-list';
import useDebounce from './use-debounce';
import type { ToastType } from './use-toast';
import { getTerminals } from '../services/terminal.service';

export type Notify = (message: string, type?: ToastType) => void;

export type RoleFilter = 'ALL' | EntryRole;
export type AppFilter = 'ALL' | AuthApplication;

export interface EntryErrors {
  patente?: string;
  terminal?: string;
}

export interface GeneratedMeta {
  patente: string;
  terminalCode: string;
  terminalName?: string;
  role: EntryRole;
  application: AuthApplication;
  createdAt: string;
}

export const roleLabels: Record<EntryRole, string> = {
  AA: 'Customs Agent (AA)',
  CARRIER: 'Carrier',
  BROKER: 'Broker',
};

export default function useAuthEntry({ notify }: { notify: Notify }) {
  const [searchParams] = useSearchParams();

  const [patente, setPatente] = useState(searchParams.get('patente') ?? '');
  const [terminal, setTerminal] = useState<number | null>(() => {
    const value = searchParams.get('terminal');
    return value ? Number(value) : null;
  });
  const [role, setRole] = useState<EntryRole>(
    (searchParams.get('role') as EntryRole) || 'AA'
  );
  const [application, setApplication] = useState<AuthApplication>(
    (searchParams.get('application') as AuthApplication) || 'TAS'
  );

  const [errors, setErrors] = useState<EntryErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthResponse | null>(null);
  const [meta, setMeta] = useState<GeneratedMeta | null>(null);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [appFilter, setAppFilter] = useState<AppFilter>('ALL');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const {
    items: terminals,
    loading: loadingTerminals,
    error: terminalsError,
    fetch: refetchTerminals,
  } = useAsyncList<Terminal[]>(getTerminals);

  const {
    items: savedEntries,
    fetch: fetchEntries,
    loading: loadingEntries,
    error: entriesError,
  } = useAsyncList<AuthEntry[]>(getAuthEntries);

  const filteredEntries = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return savedEntries.filter((entry) => {
      const matchesQuery =
        !query ||
        entry.patente.toLowerCase().includes(query) ||
        entry.terminal.code.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'ALL' || entry.role === roleFilter;
      const matchesApp = appFilter === 'ALL' || entry.application === appFilter;
      return matchesQuery && matchesRole && matchesApp;
    });
  }, [savedEntries, debouncedSearch, roleFilter, appFilter]);

  const validate = useCallback((): EntryErrors => {
    const next: EntryErrors = {};
    if (!patente.trim()) {
      next.patente = 'Patente is required.';
    }
    if (!terminal) {
      next.terminal = 'Select a terminal.';
    }
    return next;
  }, [patente, terminal]);

  const clearError = useCallback((field: keyof EntryErrors) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }, []);

  const authenticate = useCallback(
    async (authEntry?: AuthEntry) => {
      setIsGenerating(true);
      setResult(null);
      setMeta(null);
      setAuthError(null);

      try {
        const selectedTerminal = terminals.find((item) => item.id === terminal);
        const terminalCode = authEntry?.terminal?.code || selectedTerminal?.code || '';
        const response = await authTerminal(
          terminalCode,
          (authEntry?.patente || patente).trim(),
          authEntry?.role || role,
          authEntry?.application || application
        );
        const data = (await response.json()) as AuthResponse & { message?: string };

        if (response.ok) {
          setResult(data);
          setMeta({
            patente: (authEntry?.patente || patente).trim(),
            terminalCode,
            terminalName: selectedTerminal?.name,
            role: authEntry?.role || role,
            application: authEntry?.application || application,
            createdAt: new Date().toISOString(),
          });
        } else {
          setAuthError(
            data.message || 'The token could not be generated. Please try again.'
          );
        }
      } catch {
        setAuthError(
          'Could not connect to the server. Check your connection and try again.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [terminals, terminal, patente, role, application]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const nextErrors = validate();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
      await authenticate();
    },
    [validate, authenticate]
  );

  const handleSave = useCallback(async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      notify('Complete the required fields before saving.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const newEntry: Partial<AuthEntryInput> = {
        patente: patente.trim(),
        terminal: terminal as number,
        role,
        application,
      };
      await createAuthEntry(newEntry);
      notify('Entry saved.');
      await fetchEntries();
    } catch (error) {
      console.error(error);
      notify('Could not save the entry. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [validate, patente, terminal, role, application, notify, fetchEntries]);

  const handleShare = useCallback(async () => {
    if (!patente.trim() || !terminal) {
      notify('Complete Patente and Terminal to share the link.', 'error');
      return;
    }

    const params = new URLSearchParams({
      patente: patente.trim(),
      terminal: String(terminal),
      role,
      application,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      notify('Share link copied to clipboard.');
    } catch {
      notify('Could not copy the link. Copy it from the address bar.', 'error');
    }
  }, [patente, terminal, role, application, notify]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteEntry(id);
        setConfirmDeleteId(null);
        notify('Entry deleted.');
        await fetchEntries();
      } catch (error) {
        console.error(error);
        notify('Could not delete the entry. Please try again.', 'error');
      }
    },
    [notify, fetchEntries]
  );

  const handleTagClick = useCallback(
    (entry: AuthEntry) => {
      setPatente(entry.patente);
      setTerminal(entry.terminal?.id ?? null);
      setRole(entry.role);
      setApplication(entry.application);
      setErrors({});
      void authenticate(entry);
    },
    [authenticate]
  );

  const handleOpenLink = useCallback((link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, label = 'Copied to clipboard.') => {
      try {
        await navigator.clipboard.writeText(text);
        notify(label);
      } catch {
        notify('Could not copy. Select and copy manually.', 'error');
      }
    },
    [notify]
  );

  return {
    patente,
    setPatente,
    terminal,
    setTerminal,
    role,
    setRole,
    application,
    setApplication,
    terminals,
    loadingTerminals,
    terminalsError,
    refetchTerminals,
    errors,
    validate,
    clearError,
    isGenerating,
    result,
    authError,
    meta,
    authenticate,
    handleSubmit,
    handleSave,
    handleShare,
    handleDelete,
    handleTagClick,
    handleOpenLink,
    copyToClipboard,
    isSaving,
    savedEntries,
    filteredEntries,
    loadingEntries,
    entriesError,
    fetchEntries,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    appFilter,
    setAppFilter,
    confirmDeleteId,
    setConfirmDeleteId,
  };
}
