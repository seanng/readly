import { Socket } from 'socket.io-client';
import { updateCache } from 'utils/helpers';
import { Collection, Link, Store } from 'utils/types';

export function serverEventsListener(
  socket: Socket,
  port: chrome.runtime.Port
) {
  socket.on('connect_error', () => {
    console.log('connect_error');
  });
  socket.on('S_NEW_JOINER', (data) => {
    receiveCollectionJoin(data, port);
  });
  socket.on('S_COLLECTION_CREATED', (data) => {
    receiveCollectionCreated(data, port);
  });
  socket.on('S_COLLECTION_UPDATE', (data) => {
    receiveCollectionUpdate(data, port);
  });
  socket.on('S_COLLECTION_DELETED', (data) => {
    receiveCollectionDelete(data, port);
  });
  socket.on('S_NEW_LINK', (data) => {
    receiveLinkCreate(data, port);
  });
  socket.on('S_DELETE_LINK', (data) => {
    receiveLinkDelete(data, port);
  });
  socket.on('S_COLLECTION_USER_DELETED', (data) => {
    receiveCollectionUserDelete(data, port);
  });
}
export async function receiveCollectionJoin(
  data: {
    user: {
      id: string;
      email: string;
      role: string;
    };
    collectionId: string;
  },
  port: chrome.runtime.Port
) {
  const { collections, user } = await chrome.storage.local.get([
    'collections',
    'user',
  ]);
  if (user.id === data.user.id) return;
  const idx = collections.findIndex(
    (c: Collection) => c.id === data.collectionId
  );
  console.log('collection join received.');
  if (idx === -1) return; // if user already left collection (but still connected to socket)
  collections[idx].participants.push(data.user);
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
  });
}

interface RetUser {
  role: string;
  user: {
    id: string;
    email: string;
  };
}

export async function receiveCollectionCreated(
  data: {
    users: RetUser[];
  },
  port: chrome.runtime.Port
) {
  const { users, ...collection } = data;
  const participants = users.map((u) => ({
    role: u.role,
    id: u.user.id,
    email: u.user.email,
  }));

  const transformed = { participants, role: 'ADMIN', ...collection };

  port.postMessage({
    message: 'COLLECTION_POST_SUCCESS',
    data: transformed,
  });

  chrome.storage.local.get(['collections'], ({ collections }) => {
    collections.push(transformed);
    updateCache({ collections });
  });
}

export async function receiveCollectionDelete(
  data: {
    userId: string;
    collectionId: string;
  },
  port: chrome.runtime.Port
) {
  const { collections, user } = (await chrome.storage.local.get([
    'collections',
    'user',
  ])) as Store;
  if (user?.id === data.userId || !collections) return;
  const idx = collections.findIndex((col) => col.id === data.collectionId);
  collections.splice(idx, 1);
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
  });
}

export async function receiveCollectionUserDelete(
  data: {
    userId: string;
    collectionId: string;
    newAdminId?: string;
  },
  port: chrome.runtime.Port
) {
  const { collections, user } = (await chrome.storage.local.get([
    'collections',
    'user',
  ])) as Store;
  if (!user?.id || !collections) return;
  const newCollections = collections.slice();
  const idx = newCollections.findIndex((c) => c.id === data.collectionId);

  if (user.id === data.userId) {
    newCollections.splice(idx, 1);
  } else {
    const { participants } = newCollections[idx];
    const participantIdx = participants.findIndex((u) => u.id === data.userId);
    participants.splice(participantIdx, 1);
    if (data.newAdminId) {
      const newAdmin = participants.find((p) => p.id === data.newAdminId) ?? {
        role: '',
      };
      if (data.newAdminId === user?.id) {
        newCollections[idx].role = 'ADMIN';
      }
      newAdmin.role = 'ADMIN';
    }
  }

  updateCache({ collections: newCollections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections: newCollections },
  });
}

export async function receiveCollectionUpdate(
  payload: {
    collectionId: string;
    data: { name: string };
    userId: string;
  },
  port: chrome.runtime.Port
) {
  const { collections, user } = await chrome.storage.local.get([
    'collections',
    'user',
  ]);
  if (user.id === payload.userId) return;
  const idx = collections.findIndex(
    (c: Collection) => c.id === payload.collectionId
  );
  if (idx === -1) return; // if user already left collection (but still connected to socket)
  collections[idx] = { ...collections[idx], ...payload.data };
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
  });
}
export async function receiveLinkCreate(
  payload: {
    userId: string;
    collectionId: string;
    link: Link;
  },
  port: chrome.runtime.Port
) {
  const { collections, user } = (await chrome.storage.local.get([
    'collections',
    'user',
  ])) as Store;
  if (!collections || user?.id === payload.userId) return;
  const idx = collections.findIndex(
    (c: Collection) => c.id === payload.collectionId
  );
  collections[idx].links.push(payload.link);
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
  });
}

export async function receiveLinkDelete(
  payload: {
    userId: string;
    collectionId: string;
    linkId: string;
  },
  port: chrome.runtime.Port
) {
  const { collections, user } = (await chrome.storage.local.get([
    'collections',
    'user',
  ])) as Store;
  if (!collections || user?.id === payload.userId) return;
  const colIdx = collections.findIndex(
    (c: Collection) => c.id === payload.collectionId
  );
  const linkIdx = collections[colIdx].links.findIndex(
    (link) => link.id === payload.linkId
  );
  collections[colIdx].links.splice(linkIdx, 1);
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
  });
}
