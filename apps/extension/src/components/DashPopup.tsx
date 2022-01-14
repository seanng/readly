import React, { useEffect } from 'react';

export const DashPopup: React.FC = () => {
  const handleSignout = () => {
    chrome.runtime.sendMessage({ signout: true }, ({ success }) => {
      if (success) window.close();
    });
  };

  return (
    <div className="p-6">
      <header className="font-medium text-xl">
        <p className="text-green-500">Authenticated</p>
        <button
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleSignout}
        >
          Sign Out
        </button>
      </header>
    </div>
  );
};
