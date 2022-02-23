import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import { Main } from './Main';
import { Sidebar } from './Sidebar';
import { SpinningOverlay } from './SpinningOverlay';
import { StoreProvider } from 'contexts/store';
import { ContextMenuProvider } from 'contexts/context-menu';
import { ModalProvider } from 'contexts/modal';

export function Dashboard() {
  useEffect(() => {
    // Set width, as visible width can sometimes be less than 800px
    const $body = document.querySelector('body');
    if ($body) $body.style.width = `${window.innerWidth}px`;

    // Disable escape default key
    window.onkeydown = function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
      }
    };
  }, []);

  return (
    <StoreProvider>
      <ModalProvider>
        <ContextMenuProvider>
          <Split
            className="flex h-full max-w-full bg-gray-100"
            // TODO: reconfigure after logo change.
            sizes={[35, 65]}
            minSize={[180, 360]}
            snapOffset={0}
            gutterSize={5}
          >
            <Sidebar />
            <Main />
          </Split>
          <SpinningOverlay />
        </ContextMenuProvider>
      </ModalProvider>
    </StoreProvider>
  );
}
