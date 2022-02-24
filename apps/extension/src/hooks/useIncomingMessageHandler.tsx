import { useStore } from 'contexts/store';
import { SetStateAction, useEffect } from 'react';
import { Collection } from 'utils/types';

interface Props {
  activeIdx: number;
  setCollections: (cb: SetStateAction<Collection[]>) => void;
  setIsLoading: (p: boolean) => void;
  setIsCreatingCollection: (p: boolean) => void;
}

export function useIncomingMessageHandler() {
  const { activeIdx, setCollections, setIsLoading, setIsCreatingCollection } =
    useStore();
  useEffect(() => {
    function handleIncomingMessages(req: { message: string; data: any }) {
      if (req.message === 'LINK_POST_SUCCESS') {
        setCollections((c) => {
          const collections = c.slice();
          collections[activeIdx].links.push(req.data);
          return collections;
        });
        setIsLoading(false);
      }
      if (req.message === 'COLLECTION_POST_SUCCESS') {
        setCollections((c) => {
          const collections = c.slice();
          collections[c.length - 1] = req.data;
          return collections;
        });
        setIsCreatingCollection(false);
      }
    }
    chrome.runtime.onMessage.addListener(handleIncomingMessages);
    return () =>
      chrome.runtime.onMessage.removeListener(handleIncomingMessages);
  }, [activeIdx]);
}
