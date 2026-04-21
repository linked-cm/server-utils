/**
 * Get a certain key from the request data.
 * Request data is data provided by the backend to the frontend
 * @param key
 */
export declare function getRequestData(key?: string): any;
/**
 * Sets the request data. Only to be used on frontend.
 * For backend code use request.frontendData instead.
 * @param key
 * @param value
 */
export declare function setRequestData(key: any, value?: any): void;
