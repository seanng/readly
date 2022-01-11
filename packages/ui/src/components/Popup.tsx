import React, { useEffect, useState } from "react";
import { Button } from "ui";

function UnAuth(): JSX.Element {
  return (
    <div className="p-6">
      <header className="font-medium text-xl">
        <p className="text-gray-500">Not authenticatedzzz</p>
        <Button />
      </header>
    </div>
  );
}
function Auth(): JSX.Element {
  return (
    <div className="p-6">
      <header className="font-medium text-xl">
        <p className="text-gray-500">Authenticated!!</p>
      </header>
    </div>
  );
}

export const Popup: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    chrome.storage.local.get(["token"], (response) => {
      console.log("response: ", response);
    });
    // check storage for jwt.
    // if authenticated, setIsAuthenticated(true).
  }, []);

  return isAuthenticated ? <Auth /> : <UnAuth />;
};
