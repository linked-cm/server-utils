import { setRequestData } from './RequestData.js';

export function initFrontend() {
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
