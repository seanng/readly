import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Collection, Link, User } from 'utils/types';
import { getPageDescription } from 'utils/helpers';
import { useConnection } from 'contexts/connection';
import { useSetBrowserTab } from 'hooks/useSetBrowserTab';
import { useInitStoreValues } from 'hooks/useInitStoreValues';

interface ContextState {
  activeIdx: number;
  browserTab: chrome.tabs.Tab | null;
  collections: Collection[];
  createCollection: (n: string) => void;
  createLink: () => void;
  deleteCollection: (i: number) => void;
  deleteLink: (i: number) => void;
  isCreatingCollection: boolean;
  isLoading: boolean;
  selectCollection: (i: number) => void;
  setActiveIdx: (n: number) => void;
  setBrowserTab: (tab: chrome.tabs.Tab) => void;
  setCollections: (cb: SetStateAction<Collection[]>) => void;
  setIsCreatingCollection: (p: boolean) => void;
  setIsLoading: (p: boolean) => void;
  setUser: (u: User) => void;
  updateCollection: (idx: number, data: Partial<Collection>) => void;
  updateLink: (idx: number, data: Partial<Link>) => void;
  user: User | undefined;
}

const StoreContext = createContext({} as ContextState);

export const StoreProvider = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [browserTab, setBrowserTab] = useState<chrome.tabs.Tab | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [user, setUser] = useState<User>();

  useInitStoreValues((store) => {
    const { collections, user, activeIdx } = store;
    setCollections(collections ?? []);
    setActiveIdx(activeIdx ?? -1);
    setUser(user ?? { id: '', email: '' });
    setIsLoading(false);
  });

  useSetBrowserTab(([tab]) => setBrowserTab(tab));

  const port = useConnection();

  function selectCollection(idx: number) {
    setActiveIdx(idx);
    chrome.storage.local.set({ activeIdx: idx });
  }

  function createCollection(name: string) {
    /* Create a temporary proxy collection for seamless user experience.
     * It will be replaced in IncomingMessageHandler */
    setCollections((c) => {
      const result = c.concat([
        {
          id: Date.now().toString() ?? '',
          name,
          role: 'CREATOR',
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
      selectCollection(result.length - 1);
      return result;
    });
    setIsCreatingCollection(true);
    port?.postMessage({
      message: 'P_COLLECTION_CREATE',
      data: { name },
    });
  }

  function updateCollection(idx: number, data: Partial<Collection>) {
    const collectionId = collections[idx].id;
    const c = collections.slice();
    c[idx] = { ...c[idx], ...data };
    setCollections(c);
    port?.postMessage({
      message: 'P_COLLECTION_UPDATE',
      data: {
        collections: c,
        collectionId,
        body: data,
      },
    });
  }

  function deleteCollection(idx: number) {
    const c = collections.slice();
    const collectionId = c[idx].id;
    c.splice(idx, 1);
    setCollections(c);
    port?.postMessage({
      message: 'P_COLLECTION_DELETE',
      data: { collectionId, collections: c },
    });
  }

  async function createLink() {
    if (!browserTab?.id) return;
    setIsLoading(true);
    const description = await getPageDescription(browserTab);
    const collectionId = collections[activeIdx].id;
    port?.postMessage({
      message: 'P_LINK_CREATE',
      data: {
        title: browserTab.title,
        url: browserTab.url,
        faviconUrl: browserTab.favIconUrl,
        collectionId,
        description,
      },
    });
  }

  function updateLink(linkIdx: number, data: Partial<Link>) {
    const c = collections.slice();
    const linkId = c[activeIdx].links[linkIdx].id;
    c[activeIdx].links[linkIdx] = {
      ...c[activeIdx].links[linkIdx],
      ...data,
    };
    setCollections(c);
    port?.postMessage({
      message: 'P_LINK_UPDATE',
      data: {
        linkId,
        collections: c,
        body: data,
      },
    });
  }

  function deleteLink(linkIdx: number) {
    const linkId = collections[activeIdx].links[linkIdx].id;
    const c = collections.slice();
    c[activeIdx].links.splice(linkIdx, 1);
    setCollections(c);
    port?.postMessage({
      message: 'P_LINK_DELETE',
      data: { linkId, collections: c },
    });
  }

  return (
    <StoreContext.Provider
      value={{
        activeIdx,
        browserTab,
        collections,
        createLink,
        createCollection,
        deleteCollection,
        deleteLink,
        isCreatingCollection,
        isLoading,
        selectCollection,
        setActiveIdx,
        setBrowserTab,
        setCollections,
        setIsCreatingCollection,
        setIsLoading,
        setUser,
        updateCollection,
        updateLink,
        user,
      }}
      {...props}
    />
  );
};

export const useStore = () => useContext(StoreContext);
