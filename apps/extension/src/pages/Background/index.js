console.log('This is the background page.');
console.log('Put the background scripts here.');

async function getToken() {
  const { token } = await chrome.storage.local.get(['token']);
  return token;
}

async function setPopupOnLoad() {
  const token = await getToken();
  // TODO: set auth header bearer token on axios
  chrome.action.setPopup({
    popup: token ? 'dash_popup.html' : 'auth_popup.html',
  });
}

async function messageHandler(req, sender, sendResponse) {
  // for the web to check.
  if (req.getToken) {
    const token = await getToken();
    sendResponse(token);
  }
  // Authenticated (come from web)
  if (req.token) {
    chrome.storage.local.set({ token: req.token });
    chrome.action.setPopup({ popup: 'dash_popup.html' });
    sendResponse({ success: true });
    return;
  }
  // Signout (come from ext. TODO: come from web too.)
  if (req.signout) {
    chrome.storage.local.remove('token');
    chrome.action.setPopup({ popup: 'auth_popup.html' });
    sendResponse({ success: true });
    return;
  }
}

chrome.runtime.onInstalled.addListener(setPopupOnLoad);
chrome.runtime.onStartup.addListener(setPopupOnLoad);
chrome.runtime.onMessageExternal.addListener(messageHandler);
chrome.runtime.onMessage.addListener(messageHandler);

// Installation listener
// chrome.runtime.onInstalled.addListener(() => {
//   ping api to see if user is logged in using chrome.cookies.get?
//   const key = 'token';
//   const value = null;
//   chrome.storage.local.set({ [key]: value }, function () {
//     console.log(`${key} set to ${value}`);
//   });
// });

// https://stackoverflow.com/a/10071395/6007700 -> Update existing open tabs
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo === 'signin?') {
//     chrome.browserAction.setPopup({
//       tabId: tabId,
//       popup: 'authenticated_popup.html',
//     });
//   } else if (changeInfo === 'logout?') {
// change to unauth_popup
//   }
// });

// https://www.gmass.co/blog/send-cookie-cross-origin-xmlhttprequest-chrome-extension/

// But now, with Chrome’s new CORS security policy as of Chrome 85, to make any cross-origin XHR request from a content script,
// the server has to respond with an appropriate Access-Control-Allow-Origin header.
// If you’re making cross origin XHR requests from a background script, then as long as the domain is listed in “permissions”,
// it doesn’t matter if Access-Control-Allow-Origin isn’t present or isn’t set right.

// If the only reason you’re putting your domain in the permissions field is so you can make AJAX XHR requests to it, then don’t do it.
// Just handle it on the web server by setting the Access-Control-Allow-Origin header.

/**
 * Prefer moving API calls into a background script and passing data to the content script with sendMessage to
 * circumvent the third-party cookie blocking, CORB and CORS restrictions. If you choose to do so, add the API origin
 * into the permissions section of manifest.json.
 */
