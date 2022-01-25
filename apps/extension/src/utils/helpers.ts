export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export async function getStorageItems() {
  const items = await chrome.storage.local.get(null);
  return items;
}
