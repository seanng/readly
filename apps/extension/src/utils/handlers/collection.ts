import { request } from 'lib/request';
import { fetchMyData, updateCache } from 'utils/helpers';
import { Collection } from 'utils/types';

export async function createCollection(
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

export async function updateCollection(data: {
  collectionId: string;
  collections: Collection[];
  body: Partial<Collection>;
}) {
  const path = `/collections/${data.collectionId}`;
  await request(path, { method: 'PATCH', body: JSON.stringify(data.body) });
  updateCache({ collections: data.collections });
}

export async function deleteCollection(data: {
  collectionId: string;
  collections: Collection[];
}) {
  await request(`/collections/${data.collectionId}`, { method: 'DELETE' });
  updateCache({ collections: data.collections });
}

export async function joinCollection(cb: () => void) {
  const myDeets = await fetchMyData();
  await updateCache(myDeets);
  cb();
}
