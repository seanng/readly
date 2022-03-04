import secrets from 'secrets';
import { fetchMyData, updateCache } from 'utils/helpers';

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

export async function signoutUser(callback: () => void) {
  // TODO: save cache to db.
  // remove cookie so web displays signin page.
  await chrome.cookies.remove({
    url: secrets.webUrl, // emenakcmhhnnimenlofcmgmaakafgeld
    name: secrets.authTokenName, // cbe:token
  });
  await chrome.action.setPopup({
    popup: 'popup_unauth.html',
  });
  await chrome.storage.local.clear();
  callback();
}
