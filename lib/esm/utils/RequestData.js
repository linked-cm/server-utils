let requestData = {};
/**
 * Get a certain key from the request data.
 * Request data is data provided by the backend to the frontend
 * @param key
 */
export function getRequestData(key) {
    return key ? requestData[key] : requestData;
}
/**
 * Sets the request data. Only to be used on frontend.
 * For backend code use request.frontendData instead.
 * @param key
 * @param value
 */
export function setRequestData(key, value) {
    if (value && requestData) {
        requestData[key] = value;
    }
    else if (!value) {
        //single argument = overwrite the whole array
        requestData = key;
    }
}
//# sourceMappingURL=RequestData.js.map