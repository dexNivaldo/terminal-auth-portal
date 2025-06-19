export function setLocalStorageItem(key: string, value: string): void {
  localStorage.setItem(key, value);
  window.dispatchEvent(new CustomEvent('local-storage-change', {
    detail: { key, value }
  }));
}
