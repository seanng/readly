import React, { useEffect, useState } from 'react';
import { classNames } from 'utils/helpers';
import { Input, SecondaryButtonSmall } from 'ui';
import {
  CogIcon,
  LogoutIcon,
  PlusIcon,
  LinkIcon,
  UserCircleIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/solid';
import { SidebarIconLink } from './SidebarIconLink';
import { useDashStore } from 'contexts/dashboard';
import { useForm } from 'react-hook-form';
import { signout } from 'utils/helpers';
import $ from 'jquery';

const NEW_COLLECTION_FORM_NAME = 'collectionName';

export function Sidebar() {
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);
  const { setActiveIdx, activeIdx, collections, createCollection } =
    useDashStore();
  const { handleSubmit, register, setFocus, resetField } = useForm();
  const handleNewCollectionClick = () => {
    // scroll down to the bottom of the div.
    $('#sidebar-body').scrollTop($('#sidebar-body').height() as number);
    // create new text input field
    setShowNewCollectionInput(true);
  };
  useEffect(() => {
    if (showNewCollectionInput) {
      setFocus(NEW_COLLECTION_FORM_NAME);
      return;
    }
    resetField(NEW_COLLECTION_FORM_NAME);
  }, [showNewCollectionInput]);
  const onSubmit = async (input: { collectionName: string }): Promise<void> => {
    await createCollection(input.collectionName);
    setShowNewCollectionInput(false);
  };
  return (
    <div className="flex flex-col min-h-0 border-r bg-white border-gray-200 pt-5 ">
      {/* Header */}
      <div className="flex justify-between px-2 pb-5">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
          alt="Workflow"
        />
        <SecondaryButtonSmall onClick={handleNewCollectionClick}>
          <PlusIcon className="-ml-0.5 mr-0.5 h-4 w-4" aria-hidden="true" />
          New
        </SecondaryButtonSmall>
      </div>
      {/* Body */}
      <div
        className="px-2 flex-1 border-t border-gray-100 overflow-y-auto max-h-[436px]"
        id="sidebar-body"
      >
        <div className="py-2 text-sm leading-5 font-normal text-gray-400">
          Collections
        </div>
        <nav className="flex-1 space-y-1">
          {collections.map((item, i) => (
            <a
              key={item.id}
              onClick={() => {
                setActiveIdx(i);
              }}
              href="#"
              className={classNames(
                activeIdx === i
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium leading-5 rounded-md justify-between'
              )}
            >
              <div className="truncate">{item.name}</div>
              <div className="ml-2 hidden group-hover:flex font-normal text-gray-400 text-xs items-center">
                <div>{item.participants.length}</div>
                <UserCircleIcon className="w-3 h-3 ml-0.5 mr-1" />
                <div>{item.links.length}</div>
                <LinkIcon className="w-3 h-3 ml-0.5 mr-2" />
                <DotsHorizontalIcon className="text-gray-900 w-4 h-4" />
              </div>
            </a>
          ))}
          {showNewCollectionInput && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="collectionName"
                inputProps={{
                  onKeyDown: (e) => {
                    if (e.key === 'Escape') {
                      setShowNewCollectionInput(false);
                    }
                  },
                  ...register(NEW_COLLECTION_FORM_NAME, {
                    onBlur: (e) => {
                      setShowNewCollectionInput(false);
                    },
                  }),
                }}
              />
            </form>
          )}
        </nav>
      </div>
      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-100 pt-6 pl-2">
        <SidebarIconLink name="Settings" Icon={CogIcon} classes="pb-6 px-2" />
        <SidebarIconLink
          name="Logout"
          Icon={LogoutIcon}
          classes="pb-6 px-2"
          onClick={signout}
        />
      </div>
    </div>
  );
}
