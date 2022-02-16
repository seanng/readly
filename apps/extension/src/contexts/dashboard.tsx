import React, { createContext, useContext, useState, useEffect } from 'react';
import { collections } from 'fakeData';
import secrets from 'secrets';
// import axios from 'lib/axios';
import { Collection } from 'utils/types';

interface ContextState {
  setActiveIdx: (i: number) => void;
  activeIdx: number;
  collections: Collection[];
  signout: () => void;
  saveBrowserLink: () => void;
  browserTab: chrome.tabs.Tab | null;
  createNewCollection: () => Promise<void>;
}

const DashboardContext = createContext({} as ContextState);

export const DashboardProvider = ({ ...props }) => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [browserTab, setBrowserTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => setBrowserTab(tab)
    );
  }, []);

  async function signout() {
    chrome.runtime.sendMessage(secrets.extensionId, {
      message: 'SIGNOUT',
    });
    window.location.href = 'popup_unauth.html';
  }

  async function saveBrowserLink() {
    if (!browserTab?.id) return;
    chrome.tabs.sendMessage(
      browserTab.id,
      { message: 'PAGE_DESCRIPTION' },
      (description) => {
        chrome.runtime.sendMessage(
          secrets.extensionId,
          {
            message: 'NEW_LINK',
            data: {
              title: browserTab.title,
              url: browserTab.url,
              faviconUrl: browserTab.favIconUrl,
              collectionId: collections[activeIdx].id,
              description,
            },
          },
          (response) => {
            console.log('response: ', response);
          }
        );
      }
    );
  }

  async function createNewCollection() {
    // POST
    // await axios.post();
  }

  return (
    <DashboardContext.Provider
      value={{
        setActiveIdx,
        activeIdx,
        collections,
        signout,
        browserTab,
        saveBrowserLink,
        createNewCollection,
      }}
      {...props}
    />
  );
};

export const useDashStore = () => useContext(DashboardContext);
