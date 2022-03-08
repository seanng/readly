import { useStore } from 'contexts/store';
import { useConnection } from 'contexts/connection';
import { useEffect } from 'react';
import { Collection, Link } from 'utils/types';

interface ListenerProps {
  message: string;
  data: any;
}

export function useMessageListener() {
  const port = useConnection();

  const { activeIdx, setCollections, setIsLoading, setIsCreatingCollection } =
    useStore();

  function linkPostSuccess(data: Link) {
    setCollections((c) => {
      const collections = c.slice();
      collections[activeIdx].links.push(data);
      return collections;
    });
    setIsLoading(false);
  }

  function collectionPostSuccess(data: Collection) {
    setCollections((c) => {
      const collections = c.slice();
      collections[c.length - 1] = data;
      return collections;
    });
    setIsCreatingCollection(false);
  }

  function collectionsUpdateReceived(data: { collections: Collection[] }) {
    setCollections(data.collections);
  }

  useEffect(() => {
    function listener({ message, data }: ListenerProps) {
      if (message === 'LINK_POST_SUCCESS') linkPostSuccess(data);
      if (message === 'COLLECTION_POST_SUCCESS') collectionPostSuccess(data);
      if (message === 'COLLECTIONS_UPDATE_RECEIVED')
        collectionsUpdateReceived(data);
    }
    port?.onMessage.addListener(listener);
    return () => port?.onMessage.removeListener(listener);
  }, [activeIdx, port]);
}
