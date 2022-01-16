import React from 'react';
import { classNames } from 'utils/helpers';
import { SecondaryButtonSmall } from './Buttons';
import { PlusIcon } from '@heroicons/react/solid';

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
    <div className="flex-col border-r bg-white border-gray-200 pt-5 h-full">
      <div className="flex justify-between px-2">
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
      <div className="mt-5 flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {collections.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
