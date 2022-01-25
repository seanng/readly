console.log('This is the background page.');
console.log('Put the background scripts here.');

// TODO: make name more explicit
const AUTH_TOKEN_NAME = 'cbe:token';
// TODO: change.
const WEB_DOMAIN = 'http://localhost:3001';

/* LISTENERS */
chrome.runtime.onInstalled.addListener(handleExtensionStartup);
chrome.runtime.onStartup.addListener(handleExtensionStartup);
chrome.runtime.onMessageExternal.addListener(handleIncomingMessages);
chrome.runtime.onMessage.addListener(handleIncomingMessages);
chrome.cookies.onChanged.addListener(handleCookieChange);

/* HANDLERS */
async function handleIncomingMessages(req, sender, sendResponse) {
  if (req.message === 'SIGNOUT') signout();
  if (req.message === 'AUTHENTICATE') authenticate(req.data);
}

async function handleCookieChange({ cause, cookie, removed }) {
  if (cookie?.name === AUTH_TOKEN_NAME && cause !== 'overwrite') {
    chrome.action.setPopup({
      popup: removed ? 'popup_unauth.html' : 'popup_dashboard.html',
    });
  }
}

async function handleExtensionStartup() {
  await setPopupOnLoad();
}

/* HELPER FUNCTIONS */
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
    popup: cookie?.value ? 'popup_dashboard.html' : 'popup_unauth.html',
  });
}

function signout() {
  chrome.cookies.remove({
    url: 'http://localhost:3001',
    name: 'cbe:token',
  });
  chrome.storage.local.clear();
}

function authenticate(data) {
  chrome.storage.local.set(data);
}
