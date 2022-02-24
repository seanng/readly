import secrets from 'secrets';
import { getStorageItems } from 'utils/helpers';
import { Collection, Store, CreateLinkPayload } from 'utils/types';
import { request } from 'lib/request';

console.log('This is the background page.');
console.log('Put the background scripts here.');

/* LISTENERS */
chrome.runtime.onInstalled.addListener(handleExtensionStartup);
chrome.runtime.onStartup.addListener(handleExtensionStartup);
chrome.runtime.onMessageExternal.addListener(handleIncomingMessages);
chrome.runtime.onMessage.addListener(handleIncomingMessages);

/* HANDLERS */
async function handleIncomingMessages(
  req: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: () => void
) {
  if (req.message === 'SIGNOUT') signout(sendResponse);
  if (req.message === 'AUTHENTICATE') authenticate(req.data);
  if (req.message === 'NEW_COLLECTION') createCollection(req.data);
  if (req.message === 'NEW_LINK') createLink(req.data);
  if (req.message === 'UPDATE_COLLECTION') updateCollection(req.data);
  if (req.message === 'DELETE_COLLECTION') deleteCollection(req.data);
}

async function handleExtensionStartup() {
  await setPopupOnLoad();
}

/* HELPER FUNCTIONS */
async function setPopupOnLoad() {
  const storageItems = await getStorageItems();
  chrome.action.setPopup({
    popup: storageItems?.token ? 'popup_dashboard.html' : 'popup_unauth.html',
  });
}

async function signout(callback: () => void) {
  // TODO: save cache to db.
  // remove cookie so web displays signin page.
  await chrome.cookies.remove({
    url: secrets.webUrl, // emenakcmhhnnimenlofcmgmaakafgeld
    name: secrets.authTokenName, // cbe:token
  });
  await chrome.action.setPopup({
    popup: 'popup_unauth.html',
  });
  await chrome.storage.local.clear();
  callback();
}

async function authenticate({ token }: { token: string }) {
  await chrome.storage.local.set({ token });
  const myDeets = await fetchMyData();
  await updateCache(myDeets);

  chrome.action.setPopup({
    popup: 'popup_dashboard.html',
  });
}

async function createCollection({ name = '' }) {
  const { users, ...collection } = await request('/collections', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  const transformed = {
    participants: users,
    ...collection,
  };
  chrome.runtime.sendMessage({
    message: 'COLLECTION_POST_SUCCESS',
    data: transformed,
  });
  // update cache from popup instead of here.
  chrome.storage.local.get(['collections'], ({ collections }) => {
    collections.push(transformed);
    updateCache({ collections });
  });
}

async function updateCollection(data: {
  collectionId: string;
  collections: Collection[];
  body: Partial<Collection>;
}) {
  const path = `/collections/${data.collectionId}`;
  updateCache({ collections: data.collections });
  request(path, { method: 'PATCH', body: JSON.stringify(data.body) });
}

async function deleteCollection(data: {
  collectionId: string;
  collections: Collection[];
}) {
  const path = `/collections/${data.collectionId}`;
  updateCache({ collections: data.collections });
  request(path, { method: 'DELETE' });
}

async function createLink(data: CreateLinkPayload) {
  const { collectionId, ...link } = await request('/links', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  chrome.runtime.sendMessage({
    message: 'LINK_POST_SUCCESS',
    data: link,
  });
  // update cache from popup instead of here.
  chrome.storage.local.get(['collections'], ({ collections }) => {
    const idx = collections.findIndex(
      (e: Collection) => e.id === data.collectionId
    );
    collections[idx].links.push(link);
    updateCache({ collections });
  });
}

async function fetchMyData(): Promise<Store> {
  const json = (await request('/users/me')) as MeResponsePayload;
  return {
    user: {
      id: json.id,
      email: json.email,
    },
    collections: json.collections.map((c) => {
      const { users, ...rest } = c.collection;
      return {
        role: c.role,
        participants: users.map((u) => ({
          id: u.user.id,
          role: u.role,
          email: u.user.email,
        })),
        ...rest,
      };
    }),
  };
}

function updateCache(store: Store): Promise<void> {
  return chrome.storage.local.set({
    ...store,
    cacheTime: Date.now(),
  });
}

interface MeResponsePayload {
  id: string;
  email: string;
  collections: {
    role: string;
    collection: {
      id: string;
      name: string;
      links: {}[];
      users: {
        role: string;
        user: {
          id: string;
          email: string;
        };
      }[];
    };
  }[];
}
