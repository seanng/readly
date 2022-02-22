import { useIncomingMessageHandler } from 'hooks/useIncomingMessageHandler';
import { useProviderInit } from 'hooks/useProviderInit';
import React, { createContext, useContext, useState } from 'react';
import { Collection, User } from 'utils/types';
import { getPageDescription } from 'utils/helpers';

interface ContextState {
  setActiveIdx: (i: number) => void;
  activeIdx: number;
  collections: Collection[];
  createLink: () => void;
  browserTab: chrome.tabs.Tab | null;
  createCollection: (n: string) => Promise<void>;
  isLoading: boolean;
  isCreatingCollection: boolean;
}

const DashboardContext = createContext({} as ContextState);

export const DashboardProvider = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [browserTab, setBrowserTab] = useState<chrome.tabs.Tab | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [user, setUser] = useState<User>();

  useProviderInit({ setCollections, setUser, setIsLoading, setBrowserTab });
  useIncomingMessageHandler({
    activeIdx,
    setCollections,
    setIsLoading,
    setIsCreatingCollection,
  });

  async function createLink() {
    if (!browserTab?.id) return;
    setIsLoading(true);
    const description = await getPageDescription(browserTab);
    const collectionId = collections[activeIdx].id;
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

  async function createCollection(name: string) {
    /* Create a temporary proxy collection for seamless user experience.
     * It will be replaced in IncomingMessageHandler */
    setCollections((c) => {
      const result = c.concat([
        {
          id: Date.now().toString() ?? '',
          name,
          links: [],
          participants: [
            {
              id: user?.id ?? '',
              email: user?.email ?? '',
              role: 'CREATOR',
            },
          ],
        },
      ]);
      setActiveIdx(result.length - 1);
      return result;
    });
    setIsCreatingCollection(true);
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
        browserTab,
        createLink,
        createCollection,
        isLoading,
        isCreatingCollection,
      }}
      {...props}
    />
  );
};

export const useDashStore = () => useContext(DashboardContext);
