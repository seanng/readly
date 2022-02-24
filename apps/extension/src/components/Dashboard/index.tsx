import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import { Main } from './Main';
import { Sidebar } from './Sidebar';
import { SpinningOverlay } from './SpinningOverlay';
import { StoreProvider, useStore } from 'contexts/store';
import { ContextMenuProvider } from 'contexts/context-menu';
import { ModalProvider } from 'contexts/modal';
import { useInitialize } from 'hooks/useInitialize';
import { useIncomingMessageHandler } from 'hooks/useIncomingMessageHandler';

function Application() {
  useInitialize();
  useIncomingMessageHandler();

  return (
    <>
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
    </>
  );
}

export function Dashboard() {
  return (
    <StoreProvider>
      <ModalProvider>
        <ContextMenuProvider>
          <Application />
        </ContextMenuProvider>
      </ModalProvider>
    </StoreProvider>
  );
}
