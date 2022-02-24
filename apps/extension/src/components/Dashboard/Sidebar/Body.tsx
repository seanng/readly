import React, { MouseEventHandler, useEffect, useState } from 'react';
import { classNames } from 'utils/helpers';
import { Input } from 'ui';
import {
  LinkIcon,
  UserCircleIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/solid';
import { useStore } from 'contexts/store';
import { useForm } from 'react-hook-form';
import { useContextMenu } from 'contexts/context-menu';

const NEW_COLLECTION_FORM_NAME = 'collectionName';

interface Props {
  setShowNewCollectionInput: (b: boolean) => void;
  showNewCollectionInput: boolean;
}

export function Body({
  showNewCollectionInput,
  setShowNewCollectionInput,
}: Props) {
  const { selectCollection, activeIdx, collections, createCollection } =
    useStore();
  const { handleSubmit, register, setFocus, resetField } = useForm();
  const { toggleMenu, setAnchorPoint, setCollectionIdx } = useContextMenu();

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

  const handleItemRightClick =
    (i: number): MouseEventHandler<HTMLAnchorElement | SVGSVGElement> =>
    (e) => {
      e.preventDefault(); // prevents default popup rightclick action
      e.stopPropagation(); // ensures 3-dot onclick does not select item
      setAnchorPoint({ x: e.clientX, y: e.clientY });
      setCollectionIdx(i);
      toggleMenu(true);
    };

  return (
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
            onClick={(e) => {
              selectCollection(i);
            }}
            href="#"
            onContextMenu={handleItemRightClick(i)}
            className={classNames(
              activeIdx === i
                ? 'bg-gray-100 text-gray-900'
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
              <DotsHorizontalIcon
                onClick={handleItemRightClick(i)}
                className="text-gray-900 w-5 h-5 p-1 rounded-full hover:bg-gray-200"
              />
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
  );
}
