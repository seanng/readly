import React, { createContext, useContext, useState, FC } from 'react';
import { useMenuState } from '@szhsin/react-menu';
import { ContextMenu } from 'components/Dashboard/ContextMenu';

interface AnchorPoint {
  x: number;
  y: number;
}

interface ContextState {
  toggleMenu: (n: boolean) => void;
  setAnchorPoint: (x: AnchorPoint) => void;
}

const ContextMenuContext = createContext({} as ContextState);

export const ContextMenuProvider: FC = ({ children }) => {
  const { toggleMenu, ...menuProps } = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState<AnchorPoint>({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ toggleMenu, setAnchorPoint }}>
      {children}
      <ContextMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      />
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => useContext(ContextMenuContext);
