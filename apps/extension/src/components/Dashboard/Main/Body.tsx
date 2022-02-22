import React, { useEffect, useState } from 'react';
import { getStorageItems } from 'utils/helpers';
import { Link } from 'utils/types';

export function Body({ links }: { links: Link[] }) {
  const [userId, setUserId] = useState('');
  useEffect(() => {
    async function load() {
      const { id } = await getStorageItems();
      // TODO: move to PopupContext
      setUserId(id);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col flex-1 max-h-[538px] overflow-y-auto space-y-2">
      {links?.map((link, i) => (
        <div key={link.id} className="flex bg-white rounded-md p-2">
          <div>icon</div>
          <div className="flex flex-col justify-center space-y-1">
            <h4 className="text-gray-900 text-sm leading-5 font-medium">
              {link.title}
            </h4>
            <div className="flex space-x-1 text-xs leading-4 font-normal text-gray-500">
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
