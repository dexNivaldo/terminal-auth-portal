import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';

import './index.css';
import { AppHeader } from './components/app-header';
import { SavedEntries } from './components/saved-entries';
import { SettingsSheet } from './components/settings-sheet';
import { Toast } from './components/toast';
import { TokenForm } from './components/token-form';
import { TokenResult } from './components/token-result';
import { useToast } from './hooks/use-toast';
import type { AuthResponse } from './types/auth';
import type { AuthEntry, AuthApplication, EntryRole } from './types/auth-entry';
import type { Terminal } from './types/terminal';

/**
 * Development-only visual preview. Renders the redesigned surfaces with
 * illustrative fixtures so the layout can be inspected without a live
 * Supabase session. Not part of the production build.
 */

const terminals: Terminal[] = [
  { id: 1, code: 'LCT', name: 'San Antonio' },
  { id: 2, code: 'VAL', name: 'Valparaíso' },
  { id: 3, code: 'COS', name: 'Concón' },
];

const entries: AuthEntry[] = [
  {
    id: 1,
    patente: 'ABCD1234',
    terminal: { id: 1, code: 'LCT' },
    role: 'AA',
    application: 'TAS',
    created_at: '2026-03-02T14:30:00.000Z',
  },
  {
    id: 2,
    patente: 'EFGH5678',
    terminal: { id: 2, code: 'VAL' },
    role: 'CARRIER',
    application: 'DPE',
    created_at: '2026-02-24T09:15:00.000Z',
  },
  {
    id: 3,
    patente: 'IJKL9012',
    terminal: { id: 1, code: 'LCT' },
    role: 'BROKER',
    application: 'TAS',
    created_at: '2026-02-18T18:45:00.000Z',
  },
];

const demoResult: AuthResponse = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJleHAiOjE3NTEyMzQ1Njd9.demo-signature',
  redirectUrl: 'https://portal.example.com/auth?token=demo-token',
};

type PreviewState = 'empty' | 'loading' | 'success' | 'error';

function Preview() {
  const params = new URLSearchParams(window.location.search);
  const state = (params.get('state') as PreviewState) || 'success';
  const showEmptyEntries = params.get('entries') === '0';
  const [isProd] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(params.get('settings') === '1');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(
    params.get('delete') === '1' ? entries[0].id : null
  );
  const { toast, notify } = useToast();
  const [patente, setPatente] = useState('ABCD1234');
  const [terminal, setTerminal] = useState<number | null>(1);
  const [role, setRole] = useState<EntryRole>('AA');
  const [application, setApplication] = useState<AuthApplication>('TAS');

  useEffect(() => {
    if (params.get('focus') !== '1') return;
    document.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        isProd={isProd}
        userName="Demo User"
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <p className="mb-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
          Design preview — illustrative fixtures only. Not the authenticated app.
        </p>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TokenForm
              patente={patente}
              onPatenteChange={setPatente}
              terminal={terminal}
              onTerminalChange={setTerminal}
              role={role}
              onRoleChange={setRole}
              application={application}
              onApplicationChange={setApplication}
              terminals={terminals}
              loadingTerminals={false}
              terminalsError={null}
              onRetryTerminals={() => undefined}
              errors={{}}
              isGenerating={state === 'loading'}
              isSaving={false}
              onSubmit={() => undefined}
              onSave={() => undefined}
              onShare={() => undefined}
            />
          </div>

          <div className="lg:col-span-7">
            <TokenResult
              result={state === 'success' ? demoResult : null}
              isLoading={state === 'loading'}
              error={
                state === 'error'
                  ? 'The token could not be generated. Please try again.'
                  : null
              }
              meta={
                state === 'success'
                  ? {
                      patente: 'ABCD1234',
                      terminalCode: 'LCT',
                      terminalName: 'San Antonio',
                      role: 'AA',
                      application: 'TAS',
                      createdAt: new Date().toISOString(),
                    }
                  : null
              }
              onCopy={() => notify('Copied to clipboard.')}
              onOpen={() => undefined}
              onRetry={() => undefined}
            />
          </div>
        </div>

        <SavedEntries
          entries={showEmptyEntries ? [] : entries}
          filteredEntries={showEmptyEntries ? [] : entries}
          loading={false}
          error={null}
          search=""
          onSearchChange={() => undefined}
          roleFilter="ALL"
          onRoleFilterChange={() => undefined}
          appFilter="ALL"
          onAppFilterChange={() => undefined}
          confirmDeleteId={confirmDeleteId}
          onRequestDelete={setConfirmDeleteId}
          onCancelDelete={() => setConfirmDeleteId(null)}
          onConfirmDelete={() => setConfirmDeleteId(null)}
          onUse={() => undefined}
          onRetry={() => undefined}
        />
      </main>

      <footer className="border-t border-zinc-200 py-4">
        <p className="mx-auto w-full max-w-7xl px-4 text-xs text-zinc-500 sm:px-6">
          Hatch.
        </p>
      </footer>

      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        isProd={isProd}
        onProdChange={() => undefined}
        userName="Demo User"
        userEmail="demo@example.com"
        notify={notify}
      />

      <Toast toast={toast} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter>
      <Preview />
    </MemoryRouter>
  </StrictMode>
);
