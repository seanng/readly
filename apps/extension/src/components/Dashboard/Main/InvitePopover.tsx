import React, { useMemo, useState } from 'react';
import { UserCircleIcon, UserAddIcon, LinkIcon } from '@heroicons/react/solid';
import { Popover } from '@headlessui/react';
import { WhiteButtonSmallPopover } from 'ui';
import { Participant, User } from 'utils/types';

interface Props {
  participants: Participant[];
  user: User | undefined;
  disabled: boolean;
}

const MEMBER = 'MEMBER';

export function InvitePopover({ participants, user, disabled }: Props) {
  const [role, setRole] = useState('');
  const members = useMemo(() => {
    if (!user?.id) return participants;
    // reorder participants so you are first.
    const retVal = participants.slice();
    const myIdx = retVal.findIndex((e) => e.id === user.id);
    const [me] = retVal.splice(myIdx, 1);
    setRole('');
    retVal.unshift(me);
    return retVal;
  }, [participants]);

  function handleRemoveClick() {}

  function handleCopyClick() {}

  return (
    <Popover className="relative">
      <WhiteButtonSmallPopover disabled={disabled}>
        <UserAddIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
        Members
      </WhiteButtonSmallPopover>
      <Popover.Panel className="absolute right-0 top-9 z-10 w-[218px] border border-gray-300 rounded-md divide-y divide-gray-100 bg-white">
        <div className="p-3">
          <h5 className="leading-4 text-sm font-medium mb-3">Invite members</h5>
          {members.map((member, i) => (
            <div
              key={member.id}
              className="flex justify-between space-x-1 items-center text-xs"
            >
              <div className="flex space-x-1 items-center ">
                {member.avatarUrl ? (
                  <img className="h-4 w-auto" src={member.avatarUrl} />
                ) : (
                  <UserCircleIcon className="h-4 w-auto" />
                )}
                <div className="font-medium ">{member.email}</div>
              </div>
              {i === 0 ? (
                <div className="italic text-gray-500">You</div>
              ) : role === MEMBER ? (
                <div />
              ) : (
                <a
                  href="#"
                  className="text-red-500 font-medium"
                  onClick={handleRemoveClick}
                >
                  Remove
                </a>
              )}
            </div>
          ))}
        </div>
        <a
          className="p-3 flex items-center text-blue-500"
          href="#"
          onClick={handleCopyClick}
        >
          <LinkIcon className="h-3 w-auto mr-1" />
          <span className="text-xs font-medium">Copy invite link</span>
        </a>
      </Popover.Panel>
    </Popover>
  );
}