import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import secrets from 'secrets';
import { collections } from 'fakeData';
import Main from './Main';
import Sidebar from './Sidebar';

export function Dashboard() {
  useSetPopupWidth();
  const [currentCollectionIdx, setCurrentCollectionIdx] = useState(-1);
  const handleNavItemClick = (idx: number) => () => {
    setCurrentCollectionIdx(idx);
  };
  async function handleSignout() {
    chrome.runtime.sendMessage(secrets.extensionId, {
      message: 'SIGNOUT',
    });
    window.location.href = 'auth_popup.html';
  }
  return (
    <Split
      className="flex bg-gray-100 h-full max-w-full"
      // TODO: reconfigure after logo change.
      sizes={[35, 65]}
      minSize={[180, 360]}
      snapOffset={0}
      gutterSize={5}
    >
      <Sidebar
        collections={collections}
        onNavItemClick={handleNavItemClick}
        currentNavItemIdx={currentCollectionIdx}
        onSignout={handleSignout}
      />
      <Main collection={collections[currentCollectionIdx]} />
    </Split>
  );
}

function useSetPopupWidth() {
  useEffect(() => {
    const $body = document.querySelector('body');
    // visible width can sometimes be less than 800px
    if ($body) $body.style.width = `${window.innerWidth}px`;
  }, []);
}
