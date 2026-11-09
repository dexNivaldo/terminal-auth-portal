import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { cn } from '@/lib/cn';
import type { ToastData } from '@/hooks/use-toast';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

export function Toast({ toast }: { toast: ToastData | null }) {
  if (!toast) return null;

  const Icon = icons[toast.type];

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4 sm:left-auto sm:right-4 sm:translate-x-0 sm:px-0"
    >
      <div className="flex animate-fade-in items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-pop dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
        <Icon
          className={cn(
            'size-4 shrink-0',
            toast.type === 'error' && 'text-red-600 dark:text-red-400',
            toast.type === 'info' && 'text-zinc-500 dark:text-zinc-400',
            toast.type === 'success' && 'text-brand-600 dark:text-brand-300'
          )}
        />
        <span className="min-w-0">{toast.message}</span>
      </div>
    </div>
  );
}
