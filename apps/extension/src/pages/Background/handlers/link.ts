import { request } from 'lib/request';
import { updateCache } from 'utils/helpers';
import { Collection, CreateLinkPayload, Link } from 'utils/types';

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
