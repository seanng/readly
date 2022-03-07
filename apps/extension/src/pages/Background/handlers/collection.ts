import { request } from 'lib/request';
import { fetchMyData, updateCache } from 'utils/helpers';
import { Collection } from 'utils/types';

export async function requestCollectionCreate(
  { name = '' },
  port: chrome.runtime.Port
) {
  const { users, ...collection } = await request('/collections', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  const transformed = {
    participants: users,
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
  collections[idx].participants.push(data.user);
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
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
  collections[idx] = { ...collections[idx], ...payload.data };
  updateCache({ collections });
  port.postMessage({
    message: 'COLLECTIONS_UPDATE_RECEIVED',
    data: { collections },
  });
}
