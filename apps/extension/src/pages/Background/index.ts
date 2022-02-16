import secrets from 'secrets';
import { getStorageItems } from 'utils/helpers';
import { CreateLinkPayload } from 'utils/types';
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
  if (req.message === 'SIGNOUT') signout();
  if (req.message === 'AUTHENTICATE') authenticate(req.data);
  if (req.message === 'NEW_COLLECTION') createNewCollection(req.data);
  if (req.message === 'NEW_LINK') createNewLink(req.data);
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

function signout() {
  // remove cookie so web displays signin page. tbh, can just navigate to "signout" page.
  chrome.cookies.remove({
    url: secrets.webUrl,
    name: secrets.authTokenName,
  });
  chrome.action.setPopup({
    popup: 'popup_unauth.html',
  });
  chrome.storage.local.clear();
}

function authenticate(data: { userId: string; email: string; token: string }) {
  chrome.storage.local.set(data);
  chrome.action.setPopup({
    popup: 'popup_dashboard.html',
  });
}

async function createNewCollection(data: any) {
  console.log('data: ', data);
  // postNewCollection
}

async function createNewLink(data: CreateLinkPayload) {
  const json = await request('/links', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log('json: ', json);
}
