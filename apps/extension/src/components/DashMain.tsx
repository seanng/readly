import React from 'react';
import { FolderOpenIcon, StarIcon, UserAddIcon } from '@heroicons/react/solid';
import { PrimaryButtonSmall, WhiteButtonSmall } from 'ui';
import { Collection } from 'utils/types';

interface DashMainProps {
  collection: Collection;
}
export function DashMain({ collection }: DashMainProps) {
  return collection ? (
    <div className="flex-1 shrink-0">
      <Header collectionName={collection.name} />
    </div>
  ) : (
    <EmptyView />
  );
}

function EmptyView() {
  return <div className="flex-1 shrink-0"></div>;
}

interface HeaderProps {
  collectionName: string;
}
function Header({ collectionName }: HeaderProps) {
  return (
    <div className="flex justify-between p-4">
      <div className="flex items-center">
        <FolderOpenIcon className="w-6 mr-2" />
        <h1 className="text-lg leading-7 font-medium">{collectionName}</h1>
      </div>
      <div className="flex">
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
  );
}
