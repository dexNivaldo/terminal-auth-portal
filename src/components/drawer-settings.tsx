import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Server, Lock } from 'lucide-react';
import useAsync from '@/hooks/use-async';
import { getUser } from '@/services/auth.service';
import { AuthTokenSetting } from '@/types/setting';
import { setLocalStorageItem } from '@/utils/set-local-storage';

const loadSettings = () => {
  const settings = localStorage.getItem('settings')
  if (settings) return JSON.parse(settings)

    return {
    isProd: false,
    role: 'AA',
  }
}


export function AuthSettingsDrawer() {
  const [settings, setSettings] = useState<AuthTokenSetting>(loadSettings);

  const [isOpen, setIsOpen] = useState(false);
  const { value: user } = useAsync(getUser)

  useEffect(() => {
    setLocalStorageItem(
      'settings',
      JSON.stringify(settings)
    )
  }, [settings])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 glass-effect text-zinc-100"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto bg-zinc-950/90 border-zinc-800">
        <DrawerHeader className="text-left border-b border-zinc-800 pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl text-zinc-100">
            <Lock className="h-5 w-5 text-purple-400" />
            Auth token settings
          </DrawerTitle>
          <DrawerDescription className="text-zinc-400">
            View and manage auth portal settings and preferences.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-6 space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wide flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Auth Settings
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      <Server className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="isProd" className="text-sm font-medium text-zinc-200">
                        Production Environment
                      </Label>
                      <p className="text-xs text-zinc-400">
                        Enable production mode settings
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isProd"
                    checked={settings.isProd}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, isProd: checked })
                    }
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-zinc-800" />

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <img className="rounded-full" width={40} src={user?.user_metadata?.picture} alt={user?.user_metadata?.name} />
                <div className="space-y-0.5">
                  <Label htmlFor="isProd" className="text-sm font-medium text-zinc-200">
                    {user?.user_metadata?.name}
                  </Label>
                  <p className="text-xs text-zinc-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}