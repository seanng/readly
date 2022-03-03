import { io, Socket } from 'socket.io-client';
import secrets from 'secrets';
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
  const socket = io(secrets.serverBaseUrl, { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('connected.', socket.connected);
  });

  port.onMessage.addListener((req) => handleConnect(req, port));
  port.onDisconnect.addListener((port) => handlePopupDisconnect(port, socket));
});

function handlePopupDisconnect(port: chrome.runtime.Port, socket: Socket) {
  console.log('disconnecting.');
  socket.disconnect();
}

function handleConnect(req: any, port: chrome.runtime.Port) {
  if (req.message === 'P_COLLECTION_CREATE') createCollection(req.data, port);
  if (req.message === 'P_COLLECTION_UPDATE') updateCollection(req.data);
  if (req.message === 'P_COLLECTION_DELETE') deleteCollection(req.data);
  if (req.message === 'P_LINK_CREATE') createLink(req.data, port);
  if (req.message === 'P_LINK_UPDATE') updateLink(req.data);
  if (req.message === 'P_LINK_DELETE') deleteLink(req.data);
}

function handleMessages(req: any, _: any, sendResponse: () => void) {
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
