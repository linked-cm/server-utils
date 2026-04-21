import { LincdServerProxy, } from './LincdServerProxy.js';
let proxy = process.env.SITE_ROOT
    ? LincdServerProxy.getFromURI(process.env.SITE_ROOT)
    : null;
/**
 * This helper class makes API calls to a LincdServer backend easy by calling Server.call()
 * This class is intended to be used on the frontend (and will also work on the backend for SSR)
 */
export class Server {
    /**
     * Only set this value from a node.js backend. This allows server calls to directly access a LincdServer without going through the proxy using fetch()
     */
    static setLocalServer(server) {
        if (!proxy) {
            throw Error('Environment variable SITE_ROOT is not set');
        }
        proxy.localServer = server;
    }
    static getLocalServer() {
        if (!proxy) {
            throw Error('Environment variable SITE_ROOT is not set');
        }
        return proxy.localServer;
    }
    /**
     * Set the default headers to be sent with every request
     * @param headers
     */
    static addDefaultHeaders(headers) {
        LincdServerProxy.addDefaultHeaders(headers);
    }
    /**
     * Register a handler for a response action.
     * Response actions are triggered by the server by returning a json response with a key of `LincdServerProxy.RESPONSE_ACTION_KEY` and a value of the action name.
     * They allow custom actions like redirects, alerts, and other UI changes to be triggered by the server.
     * @param actionName
     * @param handler
     */
    static registerActionHandler(actionName, handler) {
        LincdServerProxy.registerActionHandler(actionName, handler);
    }
    /**
     * Create a response action object that can be returned by a server call to trigger an action on the frontend.
     * @param actionName
     * @param args
     */
    static createResponseAction(actionName, ...args) {
        return LincdServerProxy.createResponseAction(actionName, ...args);
    }
    static async call(shapeOrPackageName, method, ...args) {
        return proxy.call(shapeOrPackageName, method, ...args);
    }
    static async customPost(route, ...args) {
        return proxy.customPost(route, ...args);
    }
    static async callCustomShapeMethod(shape, httpMethod, methodName, body, headers) {
        return proxy.callCustomShapeMethod(shape, httpMethod, methodName, body, headers);
    }
}
//# sourceMappingURL=Server.js.map