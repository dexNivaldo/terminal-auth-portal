import { AlertCircle, KeyRound, Loader2, Save, Share2 } from 'lucide-react';

import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '@/lib/cn';
import type { EntryErrors } from '@/hooks/use-auth-entry';
import type { AuthApplication, EntryRole } from '@/types/auth-entry';
import type { Terminal } from '@/types/terminal';

const applications: AuthApplication[] = ['TAS', 'DPE'];

const roleOptions: Array<{ value: EntryRole; label: string }> = [
  { value: 'AA', label: 'Customs Agent (AA)' },
  { value: 'CARRIER', label: 'Carrier' },
  { value: 'BROKER', label: 'Broker' },
];

interface TokenFormProps {
  patente: string;
  onPatenteChange: (value: string) => void;
  terminal: number | null;
  onTerminalChange: (value: number | null) => void;
  role: EntryRole;
  onRoleChange: (value: EntryRole) => void;
  application: AuthApplication;
  onApplicationChange: (value: AuthApplication) => void;
  terminals: Terminal[];
  loadingTerminals: boolean;
  terminalsError: unknown;
  onRetryTerminals: () => void;
  errors: EntryErrors;
  isGenerating: boolean;
  isSaving: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onSave: () => void;
  onShare: () => void;
}

export function TokenForm({
  patente,
  onPatenteChange,
  terminal,
  onTerminalChange,
  role,
  onRoleChange,
  application,
  onApplicationChange,
  terminals,
  loadingTerminals,
  terminalsError,
  onRetryTerminals,
  errors,
  isGenerating,
  isSaving,
  onSubmit,
  onSave,
  onShare,
}: TokenFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      noValidate
      className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 shadow-card dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
    >
      <div className="space-y-1.5">
        <Label htmlFor="patente">Patente</Label>
        <Input
          id="patente"
          value={patente}
          onChange={(event) => onPatenteChange(event.target.value.toUpperCase())}
          placeholder="ABCD1234"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          invalid={Boolean(errors.patente)}
          aria-describedby={errors.patente ? 'patente-error' : 'patente-hint'}
        />
        {errors.patente ? (
          <p id="patente-error" className="text-xs text-red-600 dark:text-red-400">
            {errors.patente}
          </p>
        ) : (
          <p id="patente-hint" className="text-xs text-zinc-500 dark:text-zinc-400">
            Customs patent or identifier.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <span
          id="application-label"
          className="text-sm font-medium leading-none text-zinc-800 dark:text-zinc-200"
        >
          Application
        </span>
        <div
          role="group"
          aria-labelledby="application-label"
          className="grid grid-cols-2 gap-1 rounded-lg border border-zinc-300 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800"
        >
          {applications.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={application === value}
              onClick={() => onApplicationChange(value)}
              className={cn(
                'h-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40',
                application === value
                  ? 'bg-brand-700 text-white shadow-sm dark:bg-brand-600'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="terminal">Terminal</Label>
        <Select
          value={terminal?.toString() ?? ''}
          onValueChange={(value) => onTerminalChange(Number(value))}
        >
          <SelectTrigger
            id="terminal"
            className={cn(
              errors.terminal &&
                'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 dark:border-red-500 dark:focus-visible:border-red-500 dark:focus-visible:ring-red-500/20'
            )}
            aria-invalid={Boolean(errors.terminal)}
            aria-describedby={errors.terminal ? 'terminal-error' : undefined}
            disabled={loadingTerminals || terminalsError != null}
          >
            <SelectValue
              placeholder={
                loadingTerminals ? 'Loading terminals…' : 'Select a terminal'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {terminals.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.code}
                {item.name ? ` — ${item.name}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.terminal && (
          <p id="terminal-error" className="text-xs text-red-600 dark:text-red-400">
            {errors.terminal}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => onRoleChange(value as EntryRole)}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {terminalsError != null && (
        <Alert variant="error" title="Could not load terminals">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onRetryTerminals}>
              Retry
            </Button>
            <span className="text-xs">Selecting a terminal is required.</span>
          </div>
        </Alert>
      )}

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <Button
          type="submit"
          className="sm:flex-[2]"
          disabled={isGenerating}
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin" />
          ) : (
            <KeyRound />
          )}
          {isGenerating ? 'Generating…' : 'Generate token'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="sm:flex-1"
          onClick={onSave}
          disabled={isSaving || isGenerating}
          aria-busy={isSaving}
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          Save
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="sm:flex-1"
          onClick={onShare}
          disabled={isGenerating}
        >
          <Share2 />
          Share link
        </Button>
      </div>

      {!terminalsError && terminals.length === 0 && !loadingTerminals && (
        <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <AlertCircle className="size-3.5" />
          No terminals are available. Check your connection and try again.
        </p>
      )}
    </form>
  );
}
