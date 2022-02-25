import { StarIcon } from '@heroicons/react/solid';
import React from 'react';
import { FolderOpenIcon, UserAddIcon } from '@heroicons/react/solid';
import { PrimaryButtonSmall, WhiteButtonSmall } from 'ui';
import { useStore } from 'contexts/store';

interface HeaderProps {
  title: string;
}
export function Header({ title }: HeaderProps) {
  const { browserTab, createLink, isCreatingCollection } = useStore();

  return (
    <div className="pl-2 pr-3 w-full pt-4">
      <div className="flex-none flex mb-4">
        <div className="flex flex-1 items-center pr-2">
          <FolderOpenIcon className="w-6 mr-2 flex-none" />
          <div className="flex-auto w-32 text-lg leading-7 font-medium truncate">
            {title}
          </div>
        </div>
        <div className="flex flex-none">
          <WhiteButtonSmall>
            <UserAddIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
            Invite
          </WhiteButtonSmall>
          {/* <AddLinkPopover /> */}
          <PrimaryButtonSmall
            classes="ml-1"
            onClick={createLink}
            disabled={!browserTab || isCreatingCollection}
          >
            <StarIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
            Save
          </PrimaryButtonSmall>
        </div>
      </div>
      {/* TODO: add description */}
    </div>
  );
}
