import React, { useEffect } from 'react';
import { DashSidebar, DashMain } from 'components';

const collections = [
  {
    name: 'Web 3.0 stuff',
    current: true,
    href: '#',
  },
  {
    name: 'Job prep 2022',
    current: false,
    href: '#',
  },
];

export const DashPopup: React.FC = () => {
  useSetPopupWidth();

  return (
    <div className="flex bg-gray-100 h-full max-w-full">
      <DashSidebar collections={collections} />
      <DashMain />
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
