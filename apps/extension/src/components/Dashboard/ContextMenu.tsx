import React from 'react';
import {
  ControlledMenu,
  MenuItem,
  ControlledMenuProps,
  ClickEvent,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

interface ContextMenuProps extends ControlledMenuProps {
  onRenameClick: (e: ClickEvent) => void;
  onRemoveClick: (e: ClickEvent) => void;
  anchorPoint: {
    x: number;
    y: number;
  };
}

export function ContextMenu({
  onRenameClick,
  onRemoveClick,
  ...props
}: ContextMenuProps) {
  return (
    <ControlledMenu {...props}>
      <MenuItem onClick={onRenameClick}>Rename</MenuItem>
      <MenuItem onClick={onRemoveClick}>Remove</MenuItem>
    </ControlledMenu>
  );
}
