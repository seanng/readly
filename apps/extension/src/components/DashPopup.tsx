import React, { useEffect, useState } from 'react';
import { DashSidebar, DashMain } from 'components';
import Split from 'react-split';

const SAMPLE_LINKS = [
  {
    id: 'abcdef',
    url: 'https://google.com',
  },
  {
    id: 'abcdefg',
    url: 'https://google.com',
  },
  {
    id: 'abcdeff',
    url: 'https://google.com',
  },
];

const SAMPLE_PARTICIPANTS = [
  {
    id: '1',
    role: 'creator',
    email: 'shonum@gmail.com',
  },
  {
    id: '2',
    role: 'editor',
    email: 'shonum2@gmail.com',
  },
  {
    id: '3',
    role: 'editor',
    email: 'shonum2@gmail.com',
  },
  {
    id: '4',
    role: 'editor',
    email: 'shonum2@gmail.com',
  },
  {
    id: '5',
    role: 'invitee',
    email: 'shonum3@gmail.com',
  },
];

const collections = [
  {
    id: 'abcdef',
    name: 'Web 3.0 stuffffffff stuffffffff stuffffffff stuffffffff stuffffffff',
    links: SAMPLE_LINKS,
    participants: SAMPLE_PARTICIPANTS,
  },
  {
    id: 'abcdefg',
    name: 'Job prep 2022',
    links: SAMPLE_LINKS,
    participants: SAMPLE_PARTICIPANTS,
  },
  {
    id: 'abcdegf',
    name: 'Job prep 2022',
    links: [],
    participants: SAMPLE_PARTICIPANTS,
  },
];

export const DashPopup: React.FC = () => {
  useSetPopupWidth();
  const [currentCollectionIdx, setCurrentCollectionIdx] = useState(-1);
  const handleNavItemClick = (idx: number) => () => {
    setCurrentCollectionIdx(idx);
  };
  return (
    <Split
      className="flex bg-gray-100 h-full max-w-full"
      // TODO: reconfigure after logo change.
      sizes={[35, 65]}
      minSize={[180, 360]}
      snapOffset={0}
      gutterSize={5}
    >
      <DashSidebar
        collections={collections}
        onNavItemClick={handleNavItemClick}
        currentNavItemIdx={currentCollectionIdx}
      />
      <DashMain collection={collections[currentCollectionIdx]} />
    </Split>
  );
};

function useSetPopupWidth() {
  useEffect(() => {
    const $body = document.querySelector('body');
    // visible width can sometimes be less than 800px
    if ($body) $body.style.width = `${window.innerWidth}px`;
  }, []);
}
