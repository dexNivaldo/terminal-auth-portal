import { setLocalStorageItem } from './set-local-storage';

export interface AppSettings {
  isProd: boolean;
}

export const defaultSettings: AppSettings = { isProd: false };

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('settings');
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { isProd: Boolean(parsed.isProd) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  setLocalStorageItem('settings', JSON.stringify(settings));
}
