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
  isLoading: boolean;
}

const DashboardContext = createContext({} as ContextState);

export const DashboardProvider = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [browserTab, setBrowserTab] = useState<chrome.tabs.Tab | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [user, setUser] = useState();

  useEffect(() => {
    chrome.storage.local.get(['collections', 'user'], function (result) {
      setCollections(result.collections);
      setUser(result.user);
      setIsLoading(false);
    });
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => setBrowserTab(tab)
    );
  }, []);

  async function signout() {
    chrome.runtime.sendMessage(
      secrets.extensionId,
      {
        message: 'SIGNOUT',
      },
      () => {
        window.location.href = 'popup_unauth.html';
      }
    );
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
        isLoading,
      }}
      {...props}
    />
  );
};

export const useDashStore = () => useContext(DashboardContext);
