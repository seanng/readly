import React from 'react';
import { SecondaryButtonSmall } from 'ui';
import { PlusIcon } from '@heroicons/react/solid';

interface Props {
  onNewCollectionClick: () => void;
}

export function Header({ onNewCollectionClick }: Props) {
  return (
    <div className="flex justify-between px-2 pb-5">
      <img
        className="h-8 w-auto"
        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
        alt="Workflow"
      />
      <SecondaryButtonSmall onClick={onNewCollectionClick}>
        <PlusIcon className="-ml-0.5 mr-0.5 h-4 w-4" aria-hidden="true" />
        New
      </SecondaryButtonSmall>
    </div>
  );
}
