import secrets from 'secrets';
import { getStorageItems } from 'utils/helpers';

const { serverBaseUrl } = secrets;

export async function request(route = '', options = {}) {
  const storageItems = await getStorageItems();
  return fetch(serverBaseUrl + route, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storageItems?.token}`,
    },
    ...options,
  }).then((res) => {
    if (!res.ok) {
      console.log('Error from fetch: ', res.json());
      throw new Error();
    }
    return res.json();
  });
}
