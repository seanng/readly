import { useStore } from 'contexts/store';
import React from 'react';
import { Link } from 'utils/types';
import { LinkIcon } from '@heroicons/react/solid';

export function Body({ links }: { links: Link[] }) {
  const { user } = useStore();

  return (
    <div className="flex flex-col flex-1 max-h-[538px] overflow-y-auto space-y-3 p-2 pr-3">
      {links?.map((link, i) => (
        <div
          key={link.id}
          className="flex bg-white rounded-md p-4 hover:outline outline-1 outline-gray-300"
        >
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
        </div>
      ))}
    </div>
  );
}
