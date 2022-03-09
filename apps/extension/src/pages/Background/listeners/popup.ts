import { request } from 'lib/request';
import { Socket } from 'socket.io-client';
import { fetchMyData, updateCache, emit } from 'utils/helpers';
import { Collection, CreateLinkPayload, Link, Store } from 'utils/types';

export function popupEventsListener(
  req: any,
  port: chrome.runtime.Port,
  socket: Socket
) {
  switch (req.message) {
    case 'P_COLLECTION_CREATE':
      socket.emit('B_COLLECTION_CREATE', req.data);
      break;
    case 'P_COLLECTION_UPDATE':
      requestCollectionUpdate(req.data);
      break;
    case 'P_COLLECTION_DELETE':
      requestCollectionDelete(req.data);
      break;
    case 'P_LINK_CREATE':
      requestLinkUpdate(req.data);
      break;
    case 'P_LINK_DELETE':
      requestLinkDelete(req.data);
      break;
    case 'P_COLLECTION_USER_DELETE':
      requestCollectionUserDelete(req.data);
      break;
    default:
      break;
  }
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

export async function requestLinkCreate(
  data: CreateLinkPayload,
  port: chrome.runtime.Port
) {
  const { collectionId, ...link } = await request('/links', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  port.postMessage({
    message: 'LINK_POST_SUCCESS',
    data: link,
  });
  chrome.storage.local.get(['collections'], ({ collections }) => {
    const idx = collections.findIndex(
      (e: Collection) => e.id === data.collectionId
    );
    collections[idx].links.push(link);
    updateCache({ collections });
  });
}

export async function requestLinkUpdate(data: {
  linkId: string;
  collections: Collection[];
  body: Partial<Link>;
}) {
  const path = `/links/${data.linkId}`;
  await request(path, { method: 'PATCH', body: JSON.stringify(data.body) });
  updateCache({ collections: data.collections });
}

export async function requestLinkDelete(data: {
  linkId: string;
  collections: Collection[];
}) {
  await request(`/links/${data.linkId}`, { method: 'DELETE' });
  updateCache({ collections: data.collections });
}
