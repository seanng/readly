import { useStore } from 'contexts/store';
import { useEffect } from 'react';

export function useInitialize() {
  const { setCollections, setUser, setIsLoading, setBrowserTab, setActiveIdx } =
    useStore();

  useEffect(() => {
    initBodyWidth();
    disableEscapeKey();
    initStoreValues();
  }, []);

  function initBodyWidth() {
    // Set width, as visible width can sometimes be less than 800px
    const $body = document.querySelector('body');
    if ($body) $body.style.width = `${window.innerWidth}px`;
  }

  function disableEscapeKey() {
    window.onkeydown = function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
      }
    };
  }

  function initStoreValues() {
    chrome.storage.local.get(
      ['collections', 'user', 'activeIdx'],
      function (store) {
        const { collections, user, activeIdx } = store;
        setCollections(collections ?? []);
        setActiveIdx(activeIdx ?? -1);
        setUser(user ?? {});
        setIsLoading(false);
      }
    );
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => setBrowserTab(tab)
    );
  }
}
