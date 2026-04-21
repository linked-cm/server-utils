"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestData = exports.getRequestData = void 0;
let requestData = {};
/**
 * Get a certain key from the request data.
 * Request data is data provided by the backend to the frontend
 * @param key
 */
function getRequestData(key) {
    return key ? requestData[key] : requestData;
}
exports.getRequestData = getRequestData;
/**
 * Sets the request data. Only to be used on frontend.
 * For backend code use request.frontendData instead.
 * @param key
 * @param value
 */
function setRequestData(key, value) {
    if (value && requestData) {
        requestData[key] = value;
    }
    else if (!value) {
        //single argument = overwrite the whole array
        requestData = key;
    }
}
exports.setRequestData = setRequestData;
//# sourceMappingURL=RequestData.js.map