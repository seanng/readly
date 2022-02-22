export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export async function getStorageItems() {
  const items = await chrome.storage.local.get(null);
  return items;
}

export function getPageDescription(
  browserTab: chrome.tabs.Tab | null
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!browserTab || !browserTab.id) {
      reject('Browser Tab ID not found');
      return;
    }
    chrome.tabs.sendMessage(
      browserTab.id,
      { message: 'PAGE_DESCRIPTION' },
      (description: string) => {
        resolve(description ?? '');
      }
    );
  });
}

export async function signout() {
  chrome.runtime.sendMessage({ message: 'SIGNOUT' }, () => {
    window.location.href = 'popup_unauth.html';
  });
}
