import React from 'react';
import { classNames } from 'utils/helpers';
import { SecondaryButtonSmall } from 'ui';
import {
  CogIcon,
  LogoutIcon,
  PlusIcon,
  LinkIcon,
  UserCircleIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/solid';
import { IconLink } from './Links';
import { Collection } from 'utils/types';

interface SidebarProps {
  collections: Collection[];
  onNavItemClick: (i: number) => () => void;
  currentNavItemIdx: number;
}

export function DashSidebar({
  collections,
  onNavItemClick,
  currentNavItemIdx,
}: SidebarProps) {
  return (
    <div className="flex flex-col min-h-0 border-r bg-white border-gray-200 pt-5 max-w-[239px]">
      <Header />
      <Body
        collections={collections}
        onNavItemClick={onNavItemClick}
        currentNavItemIdx={currentNavItemIdx}
      />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className="flex justify-between px-2 pb-5">
      <img
        className="h-8 w-auto"
        src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
        alt="Workflow"
      />
      <SecondaryButtonSmall>
        <PlusIcon className="-ml-0.5 mr-0.5 h-4 w-4" aria-hidden="true" />
        New
      </SecondaryButtonSmall>
    </div>
  );
}

function Body({
  collections,
  onNavItemClick,
  currentNavItemIdx,
}: SidebarProps) {
  return (
    <div className="px-2 flex-1 border-t border-gray-100 overflow-y-auto max-h-[436px]">
      <div className="py-2 text-sm leading-5 font-normal text-gray-400">
        Collections
      </div>
      <nav className="flex-1 space-y-1">
        {collections.map((item, i) => (
          <a
            key={item.id}
            onClick={onNavItemClick(i)}
            href="#"
            className={classNames(
              currentNavItemIdx === i
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-sm font-medium leading-5 rounded-md justify-between'
            )}
          >
            <div className="truncate">{item.name}</div>
            <div className="ml-2 hidden group-hover:flex font-normal text-gray-400 text-xs items-center">
              <div>{item.participants.length}</div>
              <UserCircleIcon className="w-3 h-3 ml-0.5 mr-1" />
              <div>{item.links.length}</div>
              <LinkIcon className="w-3 h-3 ml-0.5 mr-2" />
              <DotsHorizontalIcon className="text-gray-900 w-4 h-4" />
            </div>
          </a>
        ))}
      </nav>
    </div>
  );
}

function Footer() {
  async function handleSignout() {
    await chrome.cookies.remove({
      url: 'http://localhost:3001',
      name: 'cbe:token',
    });
    window.location.href = 'auth_popup.html';
  }
  return (
    <div className="flex-shrink-0 border-t border-gray-100 pt-6 pl-2">
      <IconLink name="Settings" Icon={CogIcon} classes="pb-6 px-2" />
      <IconLink
        name="Logout"
        Icon={LogoutIcon}
        classes="pb-6 px-2"
        onClick={handleSignout}
      />
    </div>
  );
}
