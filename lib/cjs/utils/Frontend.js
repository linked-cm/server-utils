"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFrontend = void 0;
const RequestData_js_1 = require("./RequestData.js");
function initFrontend() {
    var _a;
    //parse incoming data from the server-rendered page
    const requestJson = (_a = document.getElementById('request-json')) === null || _a === void 0 ? void 0 : _a.innerText;
    if (requestJson) {
        try {
            const parsed = JSON.parse(requestJson);
            (0, RequestData_js_1.setRequestData)(parsed);
        }
        catch (e) {
            console.error('Error parsing request-json:', e);
        }
    }
}
exports.initFrontend = initFrontend;
//# sourceMappingURL=Frontend.js.map