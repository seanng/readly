import { io, Socket } from 'socket.io-client';
import secrets from 'secrets';
import { getStorageItems } from 'utils/helpers';
import {
  requestCollectionCreate,
  requestLinkCreate,
  requestCollectionDelete,
  requestLinkDelete,
  requestCollectionJoin,
  requestCollectionUpdate,
  requestLinkUpdate,
  authenticateUser,
  requestUserSignout,
  receiveCollectionJoin,
} from './handlers';

let token: string;

chrome.runtime.onInstalled.addListener(handleExtensionStartup);
chrome.runtime.onStartup.addListener(handleExtensionStartup);
chrome.runtime.onMessageExternal.addListener(handleExternalEvents);
chrome.runtime.onMessage.addListener(handleExternalEvents);

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

  handleSocketEvents(socket, port);

  port.onMessage.addListener((req) => handleConnectionEvents(req, port));
  port.onDisconnect.addListener((port) => handlePopupDisconnect(port, socket));
});

function handlePopupDisconnect(port: chrome.runtime.Port, socket: Socket) {
  socket.disconnect();
}

// EVENT HANDLERS

function handleConnectionEvents(req: any, port: chrome.runtime.Port) {
  if (req.message === 'P_COLLECTION_CREATE')
    requestCollectionCreate(req.data, port);
  if (req.message === 'P_COLLECTION_UPDATE') requestCollectionUpdate(req.data);
  if (req.message === 'P_COLLECTION_DELETE') requestCollectionDelete(req.data);
  if (req.message === 'P_LINK_CREATE') requestLinkCreate(req.data, port);
  if (req.message === 'P_LINK_UPDATE') requestLinkUpdate(req.data);
  if (req.message === 'P_LINK_DELETE') requestLinkDelete(req.data);
}

function handleExternalEvents(req: any, _: any, sendResponse: () => void) {
  if (req.message === 'W_USER_AUTHENTICATE')
    authenticateUser(req.data, async () => {
      const storageItems = await getStorageItems();
      token = storageItems?.token;
      sendResponse();
    });
  if (req.message === 'W_COLLECTION_JOIN') requestCollectionJoin(sendResponse);
  if (req.message === 'SIGNOUT') requestUserSignout(sendResponse);
}

function handleSocketEvents(socket: Socket, port: chrome.runtime.Port) {
  socket.on('connect_error', handleConnectionError);
  socket.on('NEW_JOINER', (data) => receiveCollectionJoin(data, port));
}

function handleConnectionError() {
  console.log('connect_error.');
}
