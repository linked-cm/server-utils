/**
 * Parse server-rendered request payload from the page and prime the
 * frontend's RequestData store. Returns a Promise so call sites can chain
 * subsequent async setup (route preloading, hydration) reliably.
 */
export declare function initFrontend(): Promise<void>;
