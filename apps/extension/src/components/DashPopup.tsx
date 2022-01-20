import React, { useEffect, useState } from 'react';
import { DashSidebar, DashMain } from 'components';

const collections = [
  {
    name: 'Web 3.0 stuff',
  },
  {
    name: 'Job prep 2022',
  },
  {
    name: 'Job prep 2022',
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
