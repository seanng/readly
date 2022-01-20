console.log('This is the background page.');
console.log('Put the background scripts here.');

// TODO: make name more explicit
const AUTH_TOKEN_NAME = 'cbe:token';
// TODO: change.
const WEB_DOMAIN = 'http://localhost:3001';

async function getCookie() {
  const cookie = await chrome.cookies.get({
    name: AUTH_TOKEN_NAME,
    url: WEB_DOMAIN,
  });
  return cookie;
}

async function setPopupOnLoad() {
  const cookie = await getCookie();
  chrome.action.setPopup({
    popup: cookie?.value ? 'dash_popup.html' : 'auth_popup.html',
  });
}

chrome.cookies.onChanged.addListener(function ({ cause, cookie, removed }) {
  if (cookie?.name === AUTH_TOKEN_NAME && cause !== 'overwrite') {
    chrome.action.setPopup({
      popup: removed ? 'auth_popup.html' : 'dash_popup.html',
    });
  }
});

async function messageHandler(req, sender, sendResponse) {
  if (req.profile) {
    chrome.storage.local.set({ profile: req.profile });
  }
  // Authenticated (come from web)
  // Signout (come from ext. TODO: come from web too.)
  // if (req.signout) {
  //   chrome.storage.local.remove('token');
  //   chrome.action.setPopup({ popup: 'auth_popup.html' });
  //   sendResponse({ success: true });
  //   return;
  // }
}

chrome.runtime.onInstalled.addListener(setPopupOnLoad);
chrome.runtime.onStartup.addListener(setPopupOnLoad);
chrome.runtime.onMessageExternal.addListener(messageHandler);
