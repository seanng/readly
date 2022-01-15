import React from 'react';
import { FolderOpenIcon } from '@heroicons/react/solid';

export function DashMain() {
  return (
    <div className="flex-1 shrink-0">
      <Header collectionName={'Web 3.0'} />
    </div>
  );
}

interface HeaderProps {
  collectionName: string;
}

function Header({ collectionName }: HeaderProps) {
  return (
    <div className="flex justify-between p-4">
      <div className="flex">
        <FolderOpenIcon className="w-6 mr-2" />
        <h1 className="text-lg leading-7 font-medium">{collectionName}</h1>
      </div>
      <div className="flex">
        <div>meow</div>
        <div>woof</div>
      </div>
    </div>
  );
}
