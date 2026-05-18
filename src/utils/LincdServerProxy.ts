import { Shape } from '@_linked/core/shapes/Shape';
import type { NodeReferenceValue } from '@_linked/core/utils/NodeReference';

function getShapePackageNameFromUri(shapeURI: string) {
  const match = shapeURI.match(
    /^https:\/\/data\.lincd\.org\/module\/([^/]+)\/shape\//
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// Scoped package names like "@_linked/auth" contain "/" and must be URL-encoded
// before they are inserted into `/call/:pkg/...` routes. Example:
// `@_linked/auth` -> `%40_linked%2Fauth`, so
// `/call/@_linked/auth/signinWithPassword` becomes
// `/call/%40_linked%2Fauth/signinWithPassword` and is parsed as one `:pkg` segment.
function encodePackageNameForRoute(packageName: string) {
  return encodeURIComponent(packageName);
}

export interface CallConfig {
  method: string;
  headers?: any;
  setLoaded?: boolean;
  overwriteData?: boolean;
  /**
   * If true, it will not use the local server but instead force a fetch call, which will then resolve again to the backend
   * On a multicore set-up this may end up on a different worker
   */
  forceFetch?: boolean;
}

export type ActionHandler = (event: { preventDefault: () => void }) => void;

function getShapeClass(shape: typeof Shape | Shape) {
  if (shape instanceof Shape) {
    return Object.getPrototypeOf(shape).constructor;
  }
  return shape;
}

function getInstanceNode(shape: Shape | typeof Shape): NodeReferenceValue {
  if (shape instanceof Shape && shape.id) {
    return { id: shape.id };
  }
  return null;
}

export class LincdServerProxy {
  /**
   * Use this key in a json response to trigger an action on the frontend.
   */
  static RESPONSE_ACTION_KEY: string = '__action';
  static actionHandlers: Map<string, ActionHandler[]> = new Map();
  /**
   * Is set by Server utility. Allows a LincdServer to bypass the proxy on the backend.
   */
  localServer: any;
  private rootUrl: string;

  static defaultHeaders = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  };

  constructor(rootUrl: string | { id?: string }) {
    this.rootUrl = typeof rootUrl === 'string' ? rootUrl : rootUrl?.id || '';

    if (!this.rootUrl) {
      throw new Error('LincdServerProxy requires a root URL');
    }
  }

  static getFromURI(uri: string) {
    return new LincdServerProxy(uri);
  }

  get uri() {
    return this.rootUrl;
  }

  /**
   * Default headers to be sent with every request
   *
   * @param headers
   */
  static addDefaultHeaders(headers) {
    this.defaultHeaders = Object.assign(this.defaultHeaders, headers);
  }

  static registerActionHandler(actionName: string, handler: ActionHandler) {
    const handlers = this.actionHandlers.get(actionName) || [];
    handlers.push(handler);
    this.actionHandlers.set(actionName, handlers);
  }

  /**
   * Create a response action object that can be returned by a server call to trigger an action on the frontend.
   * @param actionName
   * @param args
   */
  static createResponseAction(actionName: string, ...args: any[]) {
    const key: string = LincdServerProxy.RESPONSE_ACTION_KEY;
    //@ts-ignore
    return { [key]: actionName, args };
  }

  /**
   * Call a method on the server for this specific shape.
   * See the documentation on `Providers` to learn more about implementing server side methods for shapes.
   * @param shape
   * @param method
   * @param args
   */
  async call(
    packageName: string,
    method: string | CallConfig,
    ...args: any[]
  ): Promise<any>;
  async call(
    shape: Shape | typeof Shape,
    method: string | CallConfig,
    ...args: any[]
  ): Promise<any>;
  async call(
    shapeOrPackageName: Shape | typeof Shape | string,
    method: string | CallConfig,
    ...args: any[]
  ): Promise<any> {
    if (typeof shapeOrPackageName === 'string') {
      return this.callBackendMethod(shapeOrPackageName, method, args);
    } else {
      return this.callShapeMethod(shapeOrPackageName, method, args);
    }
  }

  callCustomShapeMethod(
    shape: typeof Shape | Shape,
    method: 'GET' | 'POST' | 'PUT' | 'UPDATE',
    methodName,
    body,
    headers?
  ): Promise<any> {
    let { shapeClass, packageName, shapeURI } = this.parseShape(shape);
    const encodedPackageName = encodePackageNameForRoute(packageName);

    //NOTE: custom calls are not going straight to the localServer on nodejs, so that request.body is available.
    return fetch(
      `${this.rootUrl}/call/${encodedPackageName}/${shapeClass.name}/${methodName}?shapeURI=${shapeURI}`,
      {
        method: method,
        headers: headers || {}, //NOTE: custom shape methods do not use LincdServerProxy.defaultHeaders,
        body,
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.warn('Could not complete server call: ' + res.statusText);
          throw new Error(`Could not complete server call: ${res.statusText}`);
        }
      })
      .then((json) => {
        if (json.__action) {
          this.handleResponseAction(json.__action);
        }
        return json;
      })
      .catch((err) => {
        console.warn('Error during server call: ', err);
        throw err;
      });
  }

  async customPost(route, ...args: any[]): Promise<any> {
    let body = JSON.stringify(args);
    return this.fetchBackend(`${this.rootUrl}${route}`, body);
  }

  private async callBackendMethod(
    packageName: string,
    methodOrConfig: string | CallConfig,
    args: any[]
  ): Promise<any> {
    let [method, headers, setLoaded, overwriteData] =
      this.parseMethod(methodOrConfig);
    //if this IS the backend
    if (
      this.localServer &&
      (typeof methodOrConfig == 'string' || !methodOrConfig.forceFetch)
    ) {
      //then call the server directly
      return this.localServer.callBackendMethod(packageName, method, args);
      } else {
        let body = JSON.stringify({ args });
        let root = this.rootUrl;
        const encodedPackageName = encodePackageNameForRoute(packageName);
        return this.fetchBackend(
          `${root}/call/${encodedPackageName}/${method}`,
          body,
          headers,
          setLoaded,
        overwriteData
      );
    }
  }

  private parseMethod(method: string | CallConfig) {
    if (typeof method === 'string') {
      return [method];
    } else {
      return [
        method.method,
        method.headers,
        method.setLoaded,
        method.overwriteData,
      ];
    }
  }

  private async callShapeMethod(
    shape: Shape | typeof Shape,
    methodOrConfig: string | CallConfig,
    args: any[]
  ): Promise<any> {
    let [method, headers, setLoaded, overwriteData] =
      this.parseMethod(methodOrConfig);

    let { shapeClass, shapeURI, packageName } = this.parseShape(shape);
    const encodedPackageName = encodePackageNameForRoute(packageName);
    const instanceNode = getInstanceNode(shape);

    if (
      this.localServer &&
      (typeof methodOrConfig == 'string' || !methodOrConfig.forceFetch)
    ) {
      return this.localServer.callShapeMethod(
        packageName,
        method,
        shapeURI,
        instanceNode,
        args
      );
    }
    //SHACL Shapes are generated by using @linkedShape.
    //They are given a unique but deterministic temporary URI
    //We send that URI over to the server, which will have generated the same URI and thus recognise the shape
    let body = JSON.stringify({
      shapeURI,
      instanceNode,
      args,
    });
    let root = this.rootUrl;
    return this.fetchBackend(
      `${root}/call/${encodedPackageName}/${shapeClass.name}/${method}`,
      body,
      headers,
      setLoaded,
      overwriteData
    );
  }

  private parseShape(shape: typeof Shape | Shape) {
    let shapeClass = getShapeClass(shape);
    let SHACL_Shape = shapeClass.shape;
    let shapeURI = SHACL_Shape?.id;
    // Prefer the package name set by linkedPackage() on the shape constructor
    // — this is the un-sanitized, module-resolvable form (e.g. '@_linked/server').
    // Fall back to parsing the URI for shapes registered before this hook existed
    // (legacy lincd-* packages whose sanitized form matches the module spec).
    let packageName =
      (shapeClass as any).packageName ||
      getShapePackageNameFromUri(shapeURI);

    return {
      shapeClass,
      SHACL_Shape,
      shapeURI,
      packageName,
    };
  }

  private async fetchBackend(
    url,
    body,
    headers?,
    setLoaded: boolean = false,
    overwriteData: boolean = false
  ) {
    return fetch(url, {
      method: 'POST',
      headers: Object.assign(
        {},
        LincdServerProxy.defaultHeaders,
        headers || {}
      ),
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json().catch((err) => {
            console.warn('Could not parse JSON from response: ', err);
            res
              .text()
              .then((text) => {
                console.warn('Response text: ', text);
              })
              .catch((err) => {
                console.warn('Also could not parse text from response. ', err);
              });
          });
        } else {
          console.warn('Could not complete server call: ' + res.statusText);
        }
      })
      .then((json) => {
        //if instead of a normal data response the server returns an action, handle it
        if (json && json[LincdServerProxy.RESPONSE_ACTION_KEY]) {
          if (
            this.handleResponseAction(
              json[LincdServerProxy.RESPONSE_ACTION_KEY]
            )
          ) {
            return;
          }
        }
        return json;
      })
      .catch((err) => {
        console.warn('Error during server call: ', err);
        throw err;
      });
  }

  handleResponseAction(action) {
    let preventdefault = false;
    const handlers = LincdServerProxy.actionHandlers.get(action) || [];
    handlers.forEach((handler) => {
      handler({ preventDefault: () => (preventdefault = true) });
    });
    return preventdefault;
  }
}
