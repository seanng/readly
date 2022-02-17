import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import Main from './Main';
import Sidebar from './Sidebar';
import Loader from '../Loader';
import { DashboardProvider, useDashStore } from 'contexts/dashboard';

function DashboardView() {
  const { isLoading } = useDashStore();
  return isLoading ? (
    <Loader />
  ) : (
    <Split
      className="flex bg-gray-100 h-full max-w-full"
      // TODO: reconfigure after logo change.
      sizes={[35, 65]}
      minSize={[180, 360]}
      snapOffset={0}
      gutterSize={5}
    >
      <Sidebar />
      <Main />
    </Split>
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
