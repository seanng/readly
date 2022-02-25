import React, { SyntheticEvent } from 'react';
import { Link, ReaderInfoValue } from 'utils/types';
import {
  LinkIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/solid';

interface ReadStatusProps {
  readers: ReaderInfoValue[];
}

function ReadStatus({ readers }: ReadStatusProps) {
  const readerCount = readers.reduce((prev, curr) => {
    return curr.hasReadIt ? prev + 1 : prev;
  }, 0);
  const isReadByAll = readers.length === readerCount;

  if (isReadByAll) {
    return (
      <>
        <span>{`Read${readers.length === 1 ? '' : ' by all'}`}</span>
        <CheckCircleIcon className="h-3 w-auto text-green-500 " />
      </>
    );
  }
  if (readerCount === 0) {
    return <span className="text-blue-700">Unread</span>;
  }

  return <span>{`Read by ${readerCount}`}</span>;
}

interface LinkItemProps {
  userId?: string;
  link: Link;
  idx: number;
  onEditClick: (idx: number) => (e: SyntheticEvent) => void;
  onCheckClick: (idx: number) => (e: SyntheticEvent) => void;
  onDeleteClick: (idx: number) => (e: SyntheticEvent) => void;
}

export function LinkItem({
  link,
  idx,
  onEditClick,
  userId,
  onCheckClick,
  onDeleteClick,
}: LinkItemProps) {
  const isReadByUser = link.readerInfo[userId ?? '']?.hasReadIt;
  const readers = Object.values(link.readerInfo);

  return (
    <div className="flex group bg-white rounded-md p-4 hover:outline outline-2 outline-gray-300 relative">
      {link.faviconUrl ? (
        <img className="h-5 w-auto pr-3" src={link.faviconUrl} />
      ) : (
        // Fallback Favicon
        <LinkIcon className="h-4 w-auto pr-3" />
      )}
      <div className="flex flex-col justify-center space-y-1">
        <h4 className="text-gray-900 text-sm leading-5 font-medium">
          {link.title}
        </h4>
        <div className="flex space-x-1 text-xs leading-4 font-normal text-gray-500 items-center">
          <span>{new URL(link.url).hostname.replace('www.', '')}</span>
          <span>•</span>
          <span>Added today</span>
          <span>•</span>
          <ReadStatus readers={readers} />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="hidden absolute group-hover:flex right-3 bottom-3 space-x-2">
        {!isReadByUser && (
          <button
            className="border-gray-300 rounded-full border p-1"
            onClick={onCheckClick(idx)}
          >
            <CheckCircleIcon className="h-4 w-auto text-green-500 " />
          </button>
        )}
        {/* <button
                className="border-gray-300 rounded-full border p-1"
                onClick={onEditClick(idx)}
              >
                <PencilIcon className="h-4 w-auto text-gray-700 " />
              </button> */}
        <button
          type="button"
          className="border-gray-300 rounded-full border p-1"
          onClick={onDeleteClick(idx)}
        >
          <TrashIcon className="h-4 w-auto text-red-500 " />
        </button>
      </div>
    </div>
  );
}
