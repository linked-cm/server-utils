import { setRequestData } from './RequestData.js';
export function initFrontend() {
    var _a;
    //parse incoming data from the server-rendered page
    const requestJson = (_a = document.getElementById('request-json')) === null || _a === void 0 ? void 0 : _a.innerText;
    if (requestJson) {
        try {
            const parsed = JSON.parse(requestJson);
            setRequestData(parsed);
        }
        catch (e) {
            console.error('Error parsing request-json:', e);
        }
    }
}
//# sourceMappingURL=Frontend.js.map