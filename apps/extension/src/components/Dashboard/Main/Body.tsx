import { useStore } from 'contexts/store';
import React, { SyntheticEvent } from 'react';
import { Link } from 'utils/types';
import {
  LinkIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/solid';

export function Body({ links }: { links: Link[] }) {
  const { user } = useStore(); // this might not be necessary, since link does not display user-specific data.

  const goTo = (url: string) => (e: SyntheticEvent) => {
    e.preventDefault();
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener(null);
  };

  const handleCheckClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEditClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col flex-1 max-h-[538px] overflow-y-auto space-y-3 p-2 pr-3">
      {links?.map((link, i) => (
        <a href="#" onClick={goTo(link.url)} key={link.id}>
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
              <div className="flex space-x-1 text-xs leading-4 font-normal text-gray-500">
                <span>{new URL(link.url).hostname.replace('www.', '')}</span>
                <span>•</span>
                <span>Added today</span>
                <span>•</span>
                {link.readerInfo[user?.id ?? '']?.hasReadIt ? (
                  <span>Read!</span>
                ) : (
                  <span className="text-blue-700">Unread</span>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="hidden absolute group-hover:flex right-3 bottom-3 space-x-2">
              <button
                className="border-gray-300 rounded-full border p-1"
                onClick={handleCheckClick}
              >
                <CheckCircleIcon className="h-4 w-auto text-green-500 " />
              </button>
              <button
                className="border-gray-300 rounded-full border p-1"
                onClick={handleEditClick}
              >
                <PencilIcon className="h-4 w-auto text-gray-700 " />
              </button>
              <button
                type="button"
                className="border-gray-300 rounded-full border p-1"
                onClick={handleDeleteClick}
              >
                <TrashIcon className="h-4 w-auto text-red-500 " />
              </button>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
