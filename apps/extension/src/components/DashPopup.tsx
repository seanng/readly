import React, { useEffect, useState } from 'react';
import { DashSidebar, DashMain } from 'components';

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
    name: 'Web 3.0 stuffffffff stuffffffff stuffffffff stuffffffff stuffffffff',
    links: SAMPLE_LINKS,
    participants: SAMPLE_PARTICIPANTS,
  },
  {
    name: 'Job prep 2022',
    links: SAMPLE_LINKS,
    participants: SAMPLE_PARTICIPANTS,
  },
  {
    name: 'Job prep 2022',
    links: SAMPLE_LINKS,
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
    <div className="flex bg-gray-100 h-full max-w-full">
      <DashSidebar
        collections={collections}
        onNavItemClick={handleNavItemClick}
        currentNavItemIdx={currentCollectionIdx}
      />
      <DashMain collection={collections[currentCollectionIdx]} />
    </div>
  );
};

function useSetPopupWidth() {
  useEffect(() => {
    const $body = document.querySelector('body');
    // visible width can sometimes be less than 800px
    if ($body) $body.style.width = `${window.innerWidth}px`;
  }, []);
}
