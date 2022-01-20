import React from 'react';
import { classNames } from 'utils/helpers';
import { SecondaryButtonSmall } from 'ui';
import { CogIcon, LogoutIcon, PlusIcon } from '@heroicons/react/solid';
import { IconLink } from './Links';

interface Collection {
  name: string;
  current: boolean;
  href: string;
}

interface SidebarProps {
  collections: Collection[];
}

export function DashSidebar({ collections }: SidebarProps) {
  return (
    <div className="flex flex-col min-h-0 border-r bg-white border-gray-200 pt-5">
      {/* <div className="flex-1 pb-4 overflow-y-auto"> */}
      <Header />
      <Body collections={collections} />
      {/* </div> */}
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

function Body({ collections }: { collections: Collection[] }) {
  return (
    <div className="px-2 flex-1 border-t border-gray-100">
      <div className="py-2 text-sm leading-5 font-normal text-gray-400">
        Collections
      </div>
      <nav className="flex-1 space-y-1">
        {collections.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-2 py-2 text-sm font-medium leading-5 rounded-md'
            )}
          >
            {item.name}
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
