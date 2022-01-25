import React, { useEffect, useState } from 'react';
import { FolderOpenIcon, StarIcon, UserAddIcon } from '@heroicons/react/solid';
import { PrimaryButtonSmall, WhiteButtonSmall } from 'ui';
import { Collection, Link } from 'utils/types';
import { getStorageItems } from 'utils/helpers';
import NoLinksIcon from './NoLinksIcon';

interface DashMainProps {
  collection: Collection;
}
export default function Main({ collection }: DashMainProps) {
  // TODO: add empty state (if no collection is selected/available in sidebar)
  return (
    <div className="pl-2 pr-3 max-w-full">
      <Header collectionName={collection?.name} />
      {collection?.links?.length === 0 ? (
        <NoLinksView />
      ) : (
        <Body links={collection?.links} />
      )}
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
      <div className="flex-none flex pt-4 w-full mb-4">
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

function Body({ links }: { links: Link[] }) {
  const [userId, setUserId] = useState('');
  useEffect(() => {
    async function load() {
      const { id } = await getStorageItems();
      setUserId(id);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col flex-1 max-h-[436px] overflow-y-auto space-y-2">
      {links?.map((link, i) => (
        <div key={link.id} className="flex bg-white rounded-md p-2">
          <div>icon</div>
          <div className="flex flex-col justify-center space-y-1">
            <h4 className="text-gray-900 text-sm leading-5 font-medium">
              {link.title}
            </h4>
            <div className="flex space-x-3 text-xs leading-4 font-normal text-gray-500">
              <span>url</span>
              <span>•</span>
              <span>Added today</span>
              <span>•</span>
              {link.readerInfo[userId]?.hasReadIt ? (
                <span className="text-blue-700">Unread</span>
              ) : (
                <span>Read!</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
