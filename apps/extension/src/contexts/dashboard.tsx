import { useIncomingMessageHandler } from 'hooks/useIncomingMessageHandler';
import { useProviderInit } from 'hooks/useProviderInit';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Collection, User } from 'utils/types';

interface ContextState {
  setActiveIdx: (i: number) => void;
  activeIdx: number;
  collections: Collection[];
  signout: () => void;
  saveBrowserLink: () => void;
  browserTab: chrome.tabs.Tab | null;
  createNewCollection: (n: string) => Promise<void>;
  isLoading: boolean;
}

const DashboardContext = createContext({} as ContextState);

export const DashboardProvider = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [browserTab, setBrowserTab] = useState<chrome.tabs.Tab | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [user, setUser] = useState<User>();

  useProviderInit({ setCollections, setUser, setIsLoading, setBrowserTab });
  useIncomingMessageHandler({
    activeIdx,
    setCollections,
    setIsLoading,
    setActiveIdx,
  });

  async function signout() {
    chrome.runtime.sendMessage({ message: 'SIGNOUT' }, () => {
      window.location.href = 'popup_unauth.html';
    });
  }

  async function saveBrowserLink() {
    if (!browserTab?.id) return;
    setIsLoading(true);
    const collectionId = collections[activeIdx].id;
    chrome.tabs.sendMessage(
      browserTab.id,
      { message: 'PAGE_DESCRIPTION' },
      (description: string) => {
        chrome.runtime.sendMessage({
          message: 'NEW_LINK',
          data: {
            title: browserTab.title,
            url: browserTab.url,
            faviconUrl: browserTab.favIconUrl,
            collectionId,
            description,
          },
        });
      }
    );
  }

  async function createNewCollection(name: string) {
    setIsLoading(true);
    chrome.runtime.sendMessage({
      message: 'NEW_COLLECTION',
      data: { name },
    });
  }

  return (
    <DashboardContext.Provider
      value={{
        setActiveIdx,
        activeIdx,
        collections,
        signout,
        browserTab,
        saveBrowserLink,
        createNewCollection,
        isLoading,
      }}
      {...props}
    />
  );
};

export const useDashStore = () => useContext(DashboardContext);
