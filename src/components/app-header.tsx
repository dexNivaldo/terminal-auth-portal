import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/cn';

interface AppHeaderProps {
  isProd: boolean;
  userName?: string;
  userPicture?: string;
  onOpenSettings: () => void;
}

export function AppHeader({
  isProd,
  userName,
  userPicture,
  onOpenSettings,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <a
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/40"
        >
          <img src="/favicon.svg" alt="" className="size-6" />
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            Hatch
          </span>
          <span className="hidden border-l border-zinc-200 pl-3 text-sm text-zinc-500 sm:inline">
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
                isProd ? 'bg-amber-500' : 'bg-zinc-400'
              )}
            />
            {isProd ? 'Production' : 'Development'}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Account and settings"
            onClick={onOpenSettings}
          >
            {userPicture ? (
              <img
                src={userPicture}
                alt=""
                referrerPolicy="no-referrer"
                className="size-8 rounded-full border border-zinc-200 object-cover"
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-800">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
