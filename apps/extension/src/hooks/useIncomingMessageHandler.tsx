import { SetStateAction, useEffect } from 'react';
import { Collection } from 'utils/types';

interface Props {
  activeIdx: number;
  setCollections: (cb: SetStateAction<Collection[]>) => void;
  setActiveIdx: (i: number) => void;
  setIsLoading: (p: boolean) => void;
}

export function useIncomingMessageHandler({
  activeIdx,
  setActiveIdx,
  setCollections,
  setIsLoading,
}: Props) {
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
          const result = c.concat([req.data]);
          setActiveIdx(result.length - 1);
          return result;
        });
        setIsLoading(false);
      }
    }
    chrome.runtime.onMessage.addListener(handleIncomingMessages);
    return () =>
      chrome.runtime.onMessage.removeListener(handleIncomingMessages);
  }, [activeIdx]);
}
