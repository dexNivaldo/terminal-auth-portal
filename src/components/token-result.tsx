import { Copy, ExternalLink, KeyRound } from 'lucide-react';

import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import type { GeneratedMeta } from '@/hooks/use-auth-entry';
import { roleLabels } from '@/hooks/use-auth-entry';
import { buildLocalPortalUrl } from '@/services/auth.service';
import { formatDateTime } from '@/utils/format';
import type { AuthResponse } from '@/types/auth';

interface TokenResultProps {
  result: AuthResponse | null;
  isLoading: boolean;
  error: string | null;
  meta: GeneratedMeta | null;
  onCopy: (text: string, label?: string) => void;
  onOpen: (url: string) => void;
  onRetry: () => void;
}

export function TokenResult({
  result,
  isLoading,
  error,
  meta,
  onCopy,
  onOpen,
  onRetry,
}: TokenResultProps) {
  return (
    <Card className="flex h-full flex-col" aria-busy={isLoading}>
      <CardHeader className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <CardTitle>Auth token</CardTitle>
        <CardDescription aria-live="polite">
          {isLoading
            ? 'Generating token…'
            : result
              ? 'Ready to copy and use.'
              : 'Your generated token will appear here.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-5">
        {isLoading && <TokenSkeleton />}

        {error && !isLoading && (
          <Alert variant="error" title="Token generation failed">
            <p>{error}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              Try again
            </Button>
          </Alert>
        )}

        {result && !isLoading && (
          <>

            <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Token
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopy(result.token, 'Token copied to clipboard.')}
                >
                  <Copy />
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Local portal
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpen(buildLocalPortalUrl(result.token))}
                  >
                    <ExternalLink />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onCopy(
                        buildLocalPortalUrl(result.token),
                        'Local portal link copied to clipboard.'
                      )
                    }
                  >
                    <Copy />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Redirect URL
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpen(result.redirectUrl)}
                  >
                    <ExternalLink />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onCopy(result.redirectUrl, 'Redirect URL copied to clipboard.')
                    }
                  >
                    <Copy />
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {meta && (
              <dl className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs sm:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Application</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                    {meta.application}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Terminal</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                    {meta.terminalCode}
                    {meta.terminalName ? ` · ${meta.terminalName}` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Role</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                    {roleLabels[meta.role]}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Patente</dt>
                  <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-50">
                    {meta.patente}
                  </dd>
                </div>
              </dl>
            )}

            {meta && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Generated {formatDateTime(meta.createdAt)}
              </p>
            )}

            <details className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600/40 dark:text-zinc-300">
                Details
              </summary>
              <pre className="max-h-48 overflow-auto border-t border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </>
        )}

        {!isLoading && !error && !result && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
            <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
              <KeyRound className="size-5 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              No token yet
            </p>
            <p className="max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
              Fill in the form and generate a token to see it here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TokenSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-[72px] w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-[76px] w-full" />
      </div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
