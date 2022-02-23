import React, { createContext, useContext, useState, FC } from 'react';
import { ClickEvent, useMenuState } from '@szhsin/react-menu';
import { ContextMenu } from 'components/Dashboard/ContextMenu';
import { useModal } from 'contexts/modal';
import { useStore } from './store';

interface AnchorPoint {
  x: number;
  y: number;
}

interface ContextState {
  toggleMenu: (n: boolean) => void;
  setAnchorPoint: (x: AnchorPoint) => void;
  setCollectionIdx: (i: number) => void;
}

const ContextMenuContext = createContext({} as ContextState);

export const ContextMenuProvider: FC = ({ children }) => {
  const { toggleMenu, ...menuProps } = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState<AnchorPoint>({ x: 0, y: 0 });
  const [collectionIdx, setCollectionIdx] = useState(-1);
  const { setOnModalConfirm, setOpen } = useModal();
  const { collections, setCollections } = useStore();

  const handleRemoveClick = (event: ClickEvent) => {
    setOnModalConfirm(() => () => {
      let collectionId = '';
      let newCollections = collections;
      setCollections((c) => {
        collectionId = c[collectionIdx].id;
        const result = c.slice();
        result.splice(collectionIdx, 1);
        newCollections = result;
        return result;
      });
      // sendmessage with collectionId.
      chrome.runtime.sendMessage({
        message: 'DELETE_COLLECTION',
        data: { collectionId, collections: newCollections },
      });
    });
    setOpen(true);
  };

  const handleRenameClick = (event: ClickEvent) => {};

  return (
    <ContextMenuContext.Provider
      value={{ toggleMenu, setCollectionIdx, setAnchorPoint }}
    >
      {children}
      <ContextMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
        onRemoveClick={handleRemoveClick}
        onRenameClick={handleRenameClick}
      />
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => useContext(ContextMenuContext);
