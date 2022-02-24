import { useIncomingMessageHandler } from 'hooks/useIncomingMessageHandler';
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Collection, User } from 'utils/types';
import { getPageDescription } from 'utils/helpers';

interface ContextState {
  setCollections: (cb: SetStateAction<Collection[]>) => void;
  activeIdx: number;
  collections: Collection[];
  createLink: () => void;
  browserTab: chrome.tabs.Tab | null;
  createCollection: (n: string) => Promise<void>;
  isLoading: boolean;
  isCreatingCollection: boolean;
  setIsCreatingCollection: (p: boolean) => void;
  selectCollection: (i: number) => void;
  user: User | undefined;
  setUser: (u: User) => void;
  setIsLoading: (p: boolean) => void;
  setBrowserTab: (tab: chrome.tabs.Tab) => void;
  setActiveIdx: (n: number) => void;
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

  async function createCollection(name: string) {
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

  return (
    <StoreContext.Provider
      value={{
        activeIdx,
        browserTab,
        collections,
        createLink,
        createCollection,
        isCreatingCollection,
        isLoading,
        selectCollection,
        setActiveIdx,
        setBrowserTab,
        setCollections,
        setIsCreatingCollection,
        setIsLoading,
        setUser,
        user,
      }}
      {...props}
    />
  );
};

export const useStore = () => useContext(StoreContext);
