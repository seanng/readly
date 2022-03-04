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

let token: string;

chrome.runtime.onInstalled.addListener(handleExtensionStartup);
chrome.runtime.onStartup.addListener(handleExtensionStartup);
chrome.runtime.onMessageExternal.addListener(handleExternalMessages);
chrome.runtime.onMessage.addListener(handleExternalMessages);

async function handleExtensionStartup() {
  const storageItems = await getStorageItems();
  token = storageItems?.token;
  chrome.action.setPopup({
    popup: storageItems?.token ? 'popup_dashboard.html' : 'popup_unauth.html',
  });
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'popup') {
    console.error('Something else is trying to connect...', port.name);
    return;
  }

  const socket = io(secrets.serverBaseUrl, {
    transports: ['websocket'],
    auth: { token },
  });

  handleSocketMessages(socket);

  port.onMessage.addListener((req) => handleConnectMessages(req, port));
  port.onDisconnect.addListener((port) => handlePopupDisconnect(port, socket));
});

interface NewJoinerData {
  id: string;
  email: string;
}

function handleSocketMessages(socket: Socket) {
  socket.on('connect_error', () => {
    console.log('connect_error.');
  });

  socket.on('NEW_JOINER', (data: NewJoinerData) => {
    console.log('NEW_JOINER data: ', data);
  });
}

function handlePopupDisconnect(port: chrome.runtime.Port, socket: Socket) {
  socket.disconnect();
}

function handleConnectMessages(req: any, port: chrome.runtime.Port) {
  if (req.message === 'P_COLLECTION_CREATE') createCollection(req.data, port);
  if (req.message === 'P_COLLECTION_UPDATE') updateCollection(req.data);
  if (req.message === 'P_COLLECTION_DELETE') deleteCollection(req.data);
  if (req.message === 'P_LINK_CREATE') createLink(req.data, port);
  if (req.message === 'P_LINK_UPDATE') updateLink(req.data);
  if (req.message === 'P_LINK_DELETE') deleteLink(req.data);
}

function handleExternalMessages(req: any, _: any, sendResponse: () => void) {
  if (req.message === 'W_USER_AUTHENTICATE')
    authenticateUser(req.data, async () => {
      const storageItems = await getStorageItems();
      token = storageItems?.token;
      sendResponse();
    });
  if (req.message === 'W_COLLECTION_JOIN') joinCollection(sendResponse);
  if (req.message === 'SIGNOUT') signoutUser(sendResponse);
}
