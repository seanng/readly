import React from 'react';
import { useDashStore } from 'contexts/dashboard';
import { Header } from './Header';
import { NoLinksView } from './NoLinksView';
import { Body } from './Body';
import { NoCollectionSelected } from './NoCollectionSelected';

export function Main() {
  // TODO: add empty state (if no collection is selected/available in sidebar)
  const { collections, activeIdx } = useDashStore();
  const collection = collections[activeIdx];
  return (
    <div className="pl-2 max-w-full">
      {!collection ? (
        <NoCollectionSelected />
      ) : (
        <>
          <Header collectionName={collection?.name} />
          {collection?.links?.length === 0 ? (
            <NoLinksView />
          ) : (
            <Body links={collection?.links} />
          )}
        </>
      )}
    </div>
  );
}
