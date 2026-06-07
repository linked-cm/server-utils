import { Shape } from '@_linked/core/shapes/Shape';
import { ActionHandler, CallConfig } from './LincdServerProxy.js';
export { CallConfig } from './LincdServerProxy.js';
/**
 * This helper class makes API calls to a LincdServer backend easy by calling Server.call()
 * This class is intended to be used on the frontend (and will also work on the backend for SSR)
 */
export declare class Server {
    /**
     * Only set this value from a node.js backend. This allows server calls to directly access a LincdServer without going through the proxy using fetch()
     */
    static setLocalServer(server: any): void;
    static getLocalServer(): any;
    /**
     * Set the default headers to be sent with every request
     * @param headers
     */
    static addDefaultHeaders(headers: any): void;
    /**
     * Register a handler for a response action.
     * Response actions are triggered by the server by returning a json response with a key of `LincdServerProxy.RESPONSE_ACTION_KEY` and a value of the action name.
     * They allow custom actions like redirects, alerts, and other UI changes to be triggered by the server.
     * @param actionName
     * @param handler
     */
    static registerActionHandler(actionName: string, handler: ActionHandler): void;
    /**
     * Create a response action object that can be returned by a server call to trigger an action on the frontend.
     * @param actionName
     * @param args
     */
    static createResponseAction(actionName: string, ...args: any[]): {
        [x: string]: string | any[];
        args: any[];
    };
    /**
     * Call a method on the server for this specific shape or package.
     * See the documentation on `Providers` to learn more about implementing server side methods for shapes.
     * @param shape
     * @param method
     * @param args
     */
    static call(packageName: string, method: string | CallConfig, ...args: any[]): Promise<any>;
    static call(shape: Shape | typeof Shape, method: string | CallConfig, ...args: any[]): Promise<any>;
    static customPost(route: any, ...args: any[]): Promise<any>;
    static callCustomShapeMethod(shape: typeof Shape | Shape, httpMethod: 'GET' | 'POST' | 'PUT' | 'UPDATE', methodName: any, body: any, headers?: any): Promise<any>;
}
