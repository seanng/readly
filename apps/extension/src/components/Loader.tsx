import React from 'react';

export default function Loader() {
  return (
    <div className="min-h-full flex justify-center items-center">
      <img
        className="mx-auto h-12 w-auto animate-ping"
        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
        alt="Workflow"
      />
    </div>
  );
}
