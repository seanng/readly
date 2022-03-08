import { request } from 'lib/request';
import { fetchMyData, updateCache, emit } from 'utils/helpers';
import { Collection, Store } from 'utils/types';

interface RetUser {
  role: string;
  user: {
    id: string;
    email: string;
  };
}

export async function requestCollectionCreate(
  { name = '' },
  port: chrome.runtime.Port
) {
  const { users, ...collection } = await request('/collections', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  const participants = users.map((u: RetUser) => ({
    role: u.role,
    id: u.user.id,
    email: u.user.email,
  }));

  const transformed = {
    participants,
    role: 'ADMIN',
    ...collection,
  };
  port.postMessage({
    message: 'COLLECTION_POST_SUCCESS',
    data: transformed,
  });
  // update cache from popup instead of here.
  chrome.storage.local.get(['collections'], ({ collections }) => {
    collections.push(transformed);
    updateCache({ collections });
  });
}

export async function requestCollectionUpdate(data: {
  collectionId: string;
  collections: Collection[];
  body: Partial<Collection>;
}) {
  const path = `/collections/${data.collectionId}`;
  await request(path, { method: 'PATCH', body: JSON.stringify(data.body) });
  updateCache({ collections: data.collections });
}

export async function requestCollectionDelete(data: {
  collectionId: string;
  collections: Collection[];
}) {
  await request(`/collections/${data.collectionId}`, { method: 'DELETE' });
  updateCache({ collections: data.collections });
}

export async function requestCollectionJoin(cb: () => void) {
  const myDeets = await fetchMyData();
  await updateCache(myDeets);
  cb();
}

export function requestCollectionUserDelete(data: {
  collectionId: string;
  userId: string;
}) {
  const { collectionId, userId } = data;
  return request(`/collections/${collectionId}/users/${userId}`, {
    method: 'DELETE',
  });
}

// EVENT-RECEIVERS
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
  if (idx === -1) return; // if user already left collection (but still connected to socket)
  collections[idx].participants.push(data.user);
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
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
