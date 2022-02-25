import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Collection, User } from 'utils/types';
import { getPageDescription } from 'utils/helpers';

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
  setCollections: (cb: SetStateAction<Collection[]>) => void;
  setIsCreatingCollection: (p: boolean) => void;
  selectCollection: (i: number) => void;
  setActiveIdx: (n: number) => void;
  setBrowserTab: (tab: chrome.tabs.Tab) => void;
  setIsLoading: (p: boolean) => void;
  setUser: (u: User) => void;
  updateCollection: (idx: number, data: Partial<Collection>) => void;
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
    chrome.runtime.sendMessage({
      message: 'NEW_COLLECTION',
      data: { name },
    });
  }

  function updateCollection(idx: number, data: Partial<Collection>) {
    const collectionId = collections[idx].id;
    let newCollections = collections;
    setCollections((c) => {
      newCollections = c.slice();
      newCollections[idx] = { ...newCollections[idx], ...data };
      return newCollections;
    });
    chrome.runtime.sendMessage({
      message: 'UPDATE_COLLECTION',
      data: {
        collections: newCollections,
        collectionId,
        body: data,
      },
    });
  }

  function deleteCollection(idx: number) {
    const collectionId = collections[idx].id;
    let newCollections = collections;
    setCollections((c) => {
      newCollections = c.slice();
      newCollections.splice(idx, 1);
      return newCollections;
    });
    chrome.runtime.sendMessage({
      message: 'DELETE_COLLECTION',
      data: { collectionId, collections: newCollections },
    });
  }

  function deleteLink(linkIdx: number) {
    const linkId = collections[activeIdx].links[linkIdx].id;
    let newCollections = collections;
    setCollections((c) => {
      newCollections = c.slice();
      newCollections[activeIdx].links.splice(linkIdx, 1);
      return newCollections;
    });
    chrome.runtime.sendMessage({
      message: 'DELETE_LINK',
      data: { linkId, collections: newCollections },
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
        user,
      }}
      {...props}
    />
  );
};

export const useStore = () => useContext(StoreContext);
