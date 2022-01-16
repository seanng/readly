import axios from "lib/axios";
import { LOCAL_STORAGE_KEY } from "shared/constants";

const CHROME_RUNTIME_NOT_FOUND = "chrome runtime not found";

export async function authenticate(
  route: string,
  input: { email: string; password: string }
) {
  try {
    const { data } = await axios.post(route, input);
    localStorage.setItem(LOCAL_STORAGE_KEY, data.token);
    const payload = {
      token: data.token,
      email: input.email,
    };
    if (!chrome?.runtime?.sendMessage) {
      throw new Error(CHROME_RUNTIME_NOT_FOUND);
    }
    chrome.runtime.sendMessage(
      process.env.NEXT_PUBLIC_EXTENSION_ID,
      payload,
      function onSendSuccess(message) {}
    );
  } catch (e) {
    if (e.message === CHROME_RUNTIME_NOT_FOUND) {
      console.log(CHROME_RUNTIME_NOT_FOUND);
    } else {
      throw e;
    }
  }
}
