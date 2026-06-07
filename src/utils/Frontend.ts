import { setRequestData } from './RequestData.js';

/**
 * Parse server-rendered request payload from the page and prime the
 * frontend's RequestData store. Returns a Promise so call sites can chain
 * subsequent async setup (route preloading, hydration) reliably.
 */
export async function initFrontend(): Promise<void> {
  //parse incoming data from the server-rendered page
  const requestJson = document.getElementById('request-json')?.innerText;
  if (requestJson) {
    try {
      const parsed = JSON.parse(requestJson);
      setRequestData(parsed);
    } catch (e) {
      console.error('Error parsing request-json:', e);
    }
  }
}
