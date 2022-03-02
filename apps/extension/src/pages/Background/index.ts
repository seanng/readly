import { getStorageItems } from 'utils/helpers';
import {
  createCollection,
  createLink,
  deleteCollection,
  deleteLink,
  joinCollection,
  updateCollection,
  updateLink,
  authenticateUser,
  signoutUser,
} from 'utils/handlers';

chrome.runtime.onInstalled.addListener(handleExtensionStartup);
chrome.runtime.onStartup.addListener(handleExtensionStartup);
chrome.runtime.onMessageExternal.addListener(handleMessages);
chrome.runtime.onMessage.addListener(handleMessages);

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'popup') {
    console.error('Something else is trying to connect...', port.name);
    return;
  }

  // Connect to socket.
  port.onMessage.addListener((req) => handleConnect(req, port));
  port.onDisconnect.addListener((port) => handlePopupDisconnect(port));
});

function handlePopupDisconnect(port: chrome.runtime.Port) {}

function handleConnect(req: any, port: chrome.runtime.Port) {
  if (req.message === 'P_COLLECTION_CREATE') createCollection(req.data, port);
  if (req.message === 'P_COLLECTION_UPDATE') updateCollection(req.data);
  if (req.message === 'P_COLLECTION_DELETE') deleteCollection(req.data);
  if (req.message === 'P_LINK_CREATE') createLink(req.data, port);
  if (req.message === 'P_LINK_UPDATE') updateLink(req.data);
  if (req.message === 'P_LINK_DELETE') deleteLink(req.data);
}

function handleMessages(
  req: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: () => void
) {
  if (req.message === 'W_USER_AUTHENTICATE')
    authenticateUser(req.data, sendResponse);
  if (req.message === 'W_COLLECTION_JOIN') joinCollection(sendResponse);
  if (req.message === 'SIGNOUT') signoutUser(sendResponse);
}

async function handleExtensionStartup() {
  await setPopupOnLoad();
}

async function setPopupOnLoad() {
  const storageItems = await getStorageItems();
  chrome.action.setPopup({
    popup: storageItems?.token ? 'popup_dashboard.html' : 'popup_unauth.html',
  });
}
