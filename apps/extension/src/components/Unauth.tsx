import React, { useEffect, SyntheticEvent } from 'react';
import { PrimaryButtonWide, WhiteButtonWide } from 'ui';

const webUrl = 'http://localhost:3001';

export const Unauth: React.FC = () => {
  const goTo = (url: string) => (e: SyntheticEvent) => {
    e.preventDefault();
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener(null);
  };
  return (
    <div className="min-h-full flex flex-col justify-center py-16 px-16">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 mb-12 text-center text-xl font-semibold text-gray-900 leading-7">
          Welcome to CBE
        </h2>
        <PrimaryButtonWide onClick={goTo(webUrl + '/login')}>
          Sign in
        </PrimaryButtonWide>
        <WhiteButtonWide onClick={goTo(webUrl + '/signup')} classes="mt-4">
          Sign up
        </WhiteButtonWide>
      </div>
    </div>
  );
};
