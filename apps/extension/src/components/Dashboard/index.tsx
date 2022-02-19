import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import Main from './Main';
import Sidebar from './Sidebar';
import SpinningOverlay from './SpinningOverlay';
import { DashboardProvider } from 'contexts/dashboard';

function DashboardView() {
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
  useSetPopupWidth();
  return (
    <DashboardProvider>
      <DashboardView />
    </DashboardProvider>
  );
}

function useSetPopupWidth() {
  useEffect(() => {
    const $body = document.querySelector('body');
    // visible width can sometimes be less than 800px
    if ($body) $body.style.width = `${window.innerWidth}px`;
  }, []);
}
