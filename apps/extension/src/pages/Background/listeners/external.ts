import secrets from 'secrets';
import { fetchMyData, getStorageItems, updateCache } from 'utils/helpers';

export function externalEventsListener(
  req: any,
  _: any,
  sendResponse: () => void,
  onUserAuth: (f: any) => Promise<void>
) {
  switch (req.message) {
    case 'W_USER_AUTHENTICATE':
      authenticateUser(req.data, () => onUserAuth(sendResponse));
      break;
    case 'W_COLLECTION_JOIN':
      requestCollectionJoin(sendResponse);
      break;
    case 'SIGNOUT':
      requestUserSignout(sendResponse);
      break;
    default:
      break;
  }
}

export async function requestCollectionJoin(cb: () => void) {
  const myDeets = await fetchMyData();
  await updateCache(myDeets);
  cb();
}

export async function authenticateUser(
  { token }: { token: string },
  cb: () => Promise<void>
) {
  await chrome.storage.local.set({ token });
  const myDeets = await fetchMyData();
  await updateCache(myDeets);
  chrome.action.setPopup({
    popup: 'popup_dashboard.html',
  });
  cb();
}

export async function requestUserSignout(callback: () => void) {
  // TODO: save cache to db.
  // remove cookie so web displays signin page.
  await chrome.cookies.remove({
    url: chrome.runtime.id, // emenakcmhhnnimenlofcmgmaakafgeld
    name: secrets.authTokenName, // cbe:token
  });
  await chrome.action.setPopup({
    popup: 'popup_unauth.html',
  });
  await chrome.storage.local.clear();
  callback();
}
