import { useEffect } from 'react';
import { Collection, User } from 'utils/types';

interface Props {
  setCollections: (c: Collection[]) => void;
  setUser: (u: User) => void;
  setIsLoading: (p: boolean) => void;
  setBrowserTab: (tab: chrome.tabs.Tab) => void;
}

export function useProviderInit({
  setCollections,
  setUser,
  setIsLoading,
  setBrowserTab,
}: Props) {
  useEffect(() => {
    chrome.storage.local.get(['collections', 'user'], function (store) {
      setCollections(store.collections);
      setUser(store.user);
      setIsLoading(false);
    });
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => setBrowserTab(tab)
    );
  }, []);
}
