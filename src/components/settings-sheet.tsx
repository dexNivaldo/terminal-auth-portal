import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, LogOut, Server } from 'lucide-react';

import { Alert } from './ui/alert';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import useMediaQuery from '@/hooks/use-media-query';
import { signOut } from '@/services/auth.service';
import type { ToastType } from '@/hooks/use-toast';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isProd: boolean;
  onProdChange: (value: boolean) => void;
  userName?: string;
  userEmail?: string;
  userPicture?: string;
  notify: (message: string, type?: ToastType) => void;
}

export function SettingsSheet({
  open,
  onOpenChange,
  isProd,
  onProdChange,
  userName,
  userEmail,
  userPicture,
  notify,
}: SettingsSheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const direction = isDesktop ? 'right' : 'bottom';

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      onOpenChange(false);
      navigate('/login');
    } catch {
      notify('Could not sign out. Please try again.', 'error');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent direction={direction}>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Manage the environment and your account.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-5 overflow-y-auto p-5">
          <section aria-labelledby="env-heading">
            <h3
              id="env-heading"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Environment
            </h3>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-brand-50 p-2 dark:bg-brand-950">
                  <Server className="size-4 text-brand-700 dark:text-brand-300" />
                </div>
                <div>
                  <Label htmlFor="isProd" className="text-sm">
                    Production environment
                  </Label>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Use the production API. Changes affect live systems.
                  </p>
                </div>
              </div>
              <Switch
                id="isProd"
                checked={isProd}
                onCheckedChange={onProdChange}
              />
            </div>
            {isProd && (
              <Alert variant="warning" className="mt-3" title="Production mode is on">
                Tokens are generated against the live environment. Verify the terminal
                and patente before continuing.
              </Alert>
            )}
          </section>

          <Separator />

          <section aria-labelledby="account-heading">
            <h3
              id="account-heading"
              className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Account
            </h3>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              {userPicture ? (
                <img
                  src={userPicture}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="size-9 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {userName || 'Signed in'}
                </p>
                {userEmail && (
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={handleSignOut}
              disabled={signingOut}
              aria-busy={signingOut}
            >
              {signingOut ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogOut />
              )}
              {signingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
