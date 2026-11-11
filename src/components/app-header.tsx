import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/cn';
import { useTheme } from '@/hooks/use-theme';
import type { SeasonalEvent } from '@/events/seasonal-events';

interface AppHeaderProps {
  isProd: boolean;
  userName?: string;
  userPicture?: string;
  event: SeasonalEvent | null;
  onOpenSettings: () => void;
}

export function AppHeader({
  isProd,
  userName,
  userPicture,
  event,
  onOpenSettings,
}: AppHeaderProps) {
  const { theme } = useTheme();
  const EventIcon = event?.icon;
  const iconColor = event
    ? (event.iconColor?.[theme] ?? event.colors[0])
    : undefined;
  const ringBackground = event
    ? `conic-gradient(${event.colors
        .map((color, index) => {
          const start = (index / event.colors.length) * 100;
          const end = ((index + 1) / event.colors.length) * 100;
          return `${color} ${start}% ${end}%`;
        })
        .join(', ')})`
    : undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <a
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40"
        >
          <img src="/favicon.svg" alt="" className="size-6" />
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hatch
          </span>
          {EventIcon && event && (
            <span
              role="img"
              aria-label={event.message}
              className="group/event relative flex shrink-0"
            >
              <EventIcon className="size-4" style={{ color: iconColor }} />
              <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-pop transition-opacity group-hover/event:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                {event.message}
              </span>
            </span>
          )}
          <span className="hidden border-l border-zinc-200 pl-3 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:inline">
            Terminal Auth Portal
          </span>
        </a>

        <div className="ml-auto flex items-center gap-2">
          <Badge
            variant={isProd ? 'warning' : 'neutral'}
            aria-label={isProd ? 'Production environment' : 'Development environment'}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                isProd ? 'bg-amber-500' : 'bg-zinc-400 dark:bg-zinc-500'
              )}
            />
            {isProd ? 'Production' : 'Development'}
          </Badge>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Account and settings"
            onClick={onOpenSettings}
          >
            <span
              className="flex size-9 items-center justify-center rounded-full p-0.5"
              style={ringBackground ? { background: ringBackground } : undefined}
            >
              {userPicture ? (
                <img
                  src={userPicture}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="size-8 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                />
              ) : (
                <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
