import secrets from 'secrets';
import { getStorageItems } from 'utils/helpers';

console.log('This is the background page.');
console.log('Put the background scripts here.');

/* LISTENERS */
chrome.runtime.onInstalled.addListener(handleExtensionStartup);
chrome.runtime.onStartup.addListener(handleExtensionStartup);
chrome.runtime.onMessageExternal.addListener(handleIncomingMessages);
chrome.runtime.onMessage.addListener(handleIncomingMessages);

/* HANDLERS */
async function handleIncomingMessages(req, sender, sendResponse) {
  if (req.message === 'SIGNOUT') signout();
  if (req.message === 'AUTHENTICATE') authenticate(req.data);
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
  // remove cookie so web displays signin page
  chrome.cookies.remove({
    url: secrets.webUrl,
    name: secrets.authTokenName,
  });
  chrome.action.setPopup({
    popup: 'popup_unauth.html',
  });
  chrome.storage.local.clear();
}

function authenticate(data) {
  // sets id, email & token
  chrome.storage.local.set(data);
}
