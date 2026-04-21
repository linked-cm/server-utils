import { Shape } from '@_linked/core/shapes/Shape';
import {
  ActionHandler,
  CallConfig,
  LincdServerProxy,
} from './LincdServerProxy.js';

export { CallConfig } from './LincdServerProxy.js';

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
  static registerActionHandler(actionName: string, handler: ActionHandler) {
    LincdServerProxy.registerActionHandler(actionName, handler);
  }

  /**
   * Create a response action object that can be returned by a server call to trigger an action on the frontend.
   * @param actionName
   * @param args
   */
  static createResponseAction(actionName: string, ...args: any[]) {
    return LincdServerProxy.createResponseAction(actionName, ...args);
  }

  /**
   * Call a method on the server for this specific shape or package.
   * See the documentation on `Providers` to learn more about implementing server side methods for shapes.
   * @param shape
   * @param method
   * @param args
   */
  static async call(
    packageName: string,
    method: string | CallConfig,
    ...args: any[]
  ): Promise<any>;
  static async call(
    shape: Shape | typeof Shape,
    method: string | CallConfig,
    ...args: any[]
  ): Promise<any>;
  static async call(
    shapeOrPackageName: Shape | typeof Shape | string,
    method: string | CallConfig,
    ...args: any[]
  ): Promise<any> {
    return proxy.call(shapeOrPackageName as Shape, method, ...args);
  }

  static async customPost(route, ...args: any[]): Promise<any> {
    return proxy.customPost(route, ...args);
  }

  static async callCustomShapeMethod(
    shape: typeof Shape | Shape,
    httpMethod: 'GET' | 'POST' | 'PUT' | 'UPDATE',
    methodName,
    body,
    headers?
  ): Promise<any> {
    return proxy.callCustomShapeMethod(
      shape,
      httpMethod,
      methodName,
      body,
      headers
    );
  }
}
