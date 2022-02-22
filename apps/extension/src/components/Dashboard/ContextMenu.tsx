import React from 'react';
import {
  ControlledMenu,
  MenuItem,
  ControlledMenuProps,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

interface ContextMenuProps extends ControlledMenuProps {
  anchorPoint: {
    x: number;
    y: number;
  };
}

export function ContextMenu({ ...props }: ContextMenuProps) {
  return (
    <ControlledMenu {...props}>
      <MenuItem>Hello</MenuItem>
      <MenuItem>There</MenuItem>
    </ControlledMenu>
  );
}
