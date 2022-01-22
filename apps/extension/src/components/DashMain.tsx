import React from 'react';
import { FolderOpenIcon, StarIcon, UserAddIcon } from '@heroicons/react/solid';
import { PrimaryButtonSmall, WhiteButtonSmall } from 'ui';
import { Collection } from 'utils/types';
import { NoLinksIcon } from './index';

interface DashMainProps {
  collection: Collection;
}
export function DashMain({ collection }: DashMainProps) {
  // TODO: add empty state (if no collection is selected/available in sidebar)
  console.log('collection: ', collection);
  return (
    <div>
      <Header collectionName={collection?.name} />
      {collection?.links?.length === 0 ? <NoLinksView /> : <div />}
    </div>
  );
}

function NoLinksView() {
  return (
    <div className="flex flex-col flex-1 shrink-0 items-center">
      <NoLinksIcon className="h-[278px] w-[417px]" />
      <div className="flex flex-col w-[400px] items-center">
        <h3 className="text-base leading-6 font-medium text-gray-900 mt-5 mb-3">
          There are no links yet!
        </h3>
        <p className="text-sm leading-5 font-normal text-gray-500 text-center">
          Start by saving your links to the collection, or invite your team
          members to contribute to the collection.
        </p>
      </div>
    </div>
  );
}

interface HeaderProps {
  collectionName: string;
}
function Header({ collectionName }: HeaderProps) {
  return (
    <>
      <div className="flex pt-4 pl-2 pr-3 max-w-full">
        <div className="flex flex-1 items-center pr-2">
          <FolderOpenIcon className="w-6 mr-2 flex-none" />
          <div className="flex-auto w-32 text-lg leading-7 font-medium truncate">
            {collectionName}
          </div>
        </div>
        <div className="flex flex-none">
          <WhiteButtonSmall>
            <UserAddIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
            Invite
          </WhiteButtonSmall>
          <PrimaryButtonSmall classes="ml-1">
            <StarIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
            Add link
          </PrimaryButtonSmall>
        </div>
      </div>
      {/* TODO: add description */}
    </>
  );
}
