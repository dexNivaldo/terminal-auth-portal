import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router';
import type { User } from '@supabase/supabase-js';

import { AppHeader } from './components/app-header';
import { SavedEntries } from './components/saved-entries';
import { SettingsSheet } from './components/settings-sheet';
import { Toast } from './components/toast';
import { TokenForm } from './components/token-form';
import { TokenResult } from './components/token-result';
import useAuthEntry from './hooks/use-auth-entry';
import { useLocalStorageChange } from './hooks/use-local-storage-listener';
import { useToast } from './hooks/use-toast';
import { loadSettings, saveSettings, type AppSettings } from './utils/settings';

export default function Home() {
  const { user } = useLoaderData() as { user: User };
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast, notify } = useToast();
  const authEntry = useAuthEntry({ notify });
  const resultRef = useRef<HTMLDivElement>(null);

  useLocalStorageChange((key) => {
    if (key === 'settings') setSettings(loadSettings());
  });

  const handleProdChange = useCallback(
    (isProd: boolean) => {
      const next = { ...settings, isProd };
      setSettings(next);
      saveSettings(next);
    },
    [settings]
  );

  const scrollToResult = useCallback(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  useEffect(() => {
    if (!authEntry.result) return;
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    scrollToResult();
  }, [authEntry.result, scrollToResult]);

  const userName = user?.user_metadata?.name;
  const userEmail = user?.email;
  const userPicture = user?.user_metadata?.picture;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        isProd={settings.isProd}
        userName={userName}
        userPicture={userPicture}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TokenForm
              patente={authEntry.patente}
              onPatenteChange={(value) => {
                authEntry.setPatente(value);
                authEntry.clearError('patente');
              }}
              terminal={authEntry.terminal}
              onTerminalChange={(value) => {
                authEntry.setTerminal(value);
                authEntry.clearError('terminal');
              }}
              role={authEntry.role}
              onRoleChange={authEntry.setRole}
              application={authEntry.application}
              onApplicationChange={authEntry.setApplication}
              terminals={authEntry.terminals}
              loadingTerminals={authEntry.loadingTerminals}
              terminalsError={authEntry.terminalsError}
              onRetryTerminals={authEntry.refetchTerminals}
              errors={authEntry.errors}
              isGenerating={authEntry.isGenerating}
              isSaving={authEntry.isSaving}
              onSubmit={authEntry.handleSubmit}
              onSave={authEntry.handleSave}
              onShare={authEntry.handleShare}
            />
          </div>

          <div className="scroll-mt-20 lg:col-span-7" ref={resultRef}>
            <TokenResult
              result={authEntry.result}
              isLoading={authEntry.isGenerating}
              error={authEntry.authError}
              meta={authEntry.meta}
              onCopy={authEntry.copyToClipboard}
              onOpen={authEntry.handleOpenLink}
              onRetry={() => void authEntry.authenticate()}
            />
          </div>
        </div>

        <SavedEntries
          entries={authEntry.savedEntries}
          filteredEntries={authEntry.filteredEntries}
          loading={authEntry.loadingEntries}
          error={authEntry.entriesError}
          search={authEntry.search}
          onSearchChange={authEntry.setSearch}
          roleFilter={authEntry.roleFilter}
          onRoleFilterChange={authEntry.setRoleFilter}
          appFilter={authEntry.appFilter}
          onAppFilterChange={authEntry.setAppFilter}
          confirmDeleteId={authEntry.confirmDeleteId}
          onRequestDelete={authEntry.setConfirmDeleteId}
          onCancelDelete={() => authEntry.setConfirmDeleteId(null)}
          onConfirmDelete={(id) => void authEntry.handleDelete(id)}
          onUse={(entry) => {
            authEntry.handleTagClick(entry);
            scrollToResult();
          }}
          onRetry={authEntry.fetchEntries}
        />
      </main>

      <footer className="border-t border-zinc-200 py-4 dark:border-zinc-800">
        <p className="mx-auto w-full max-w-7xl px-4 text-xs text-zinc-500 sm:px-6 dark:text-zinc-500">
          Hatch.
        </p>
      </footer>

      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        isProd={settings.isProd}
        onProdChange={handleProdChange}
        userName={userName}
        userEmail={userEmail}
        userPicture={userPicture}
        notify={notify}
      />

      <Toast toast={toast} />
    </div>
  );
}
