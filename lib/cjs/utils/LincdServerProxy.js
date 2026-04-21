"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincdServerProxy = void 0;
const Shape_1 = require("@_linked/core/shapes/Shape");
function getShapePackageNameFromUri(shapeURI) {
    const match = shapeURI.match(/^https:\/\/data\.lincd\.org\/module\/([^/]+)\/shape\//);
    return match ? decodeURIComponent(match[1]) : null;
}
function getShapeClass(shape) {
    if (shape instanceof Shape_1.Shape) {
        return Object.getPrototypeOf(shape).constructor;
    }
    return shape;
}
function getInstanceNode(shape) {
    if (shape instanceof Shape_1.Shape && shape.id) {
        return { id: shape.id };
    }
    return null;
}
class LincdServerProxy {
    constructor(rootUrl) {
        this.rootUrl = typeof rootUrl === 'string' ? rootUrl : (rootUrl === null || rootUrl === void 0 ? void 0 : rootUrl.id) || '';
        if (!this.rootUrl) {
            throw new Error('LincdServerProxy requires a root URL');
        }
    }
    static getFromURI(uri) {
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
    static registerActionHandler(actionName, handler) {
        const handlers = this.actionHandlers.get(actionName) || [];
        handlers.push(handler);
        this.actionHandlers.set(actionName, handlers);
    }
    /**
     * Create a response action object that can be returned by a server call to trigger an action on the frontend.
     * @param actionName
     * @param args
     */
    static createResponseAction(actionName, ...args) {
        const key = LincdServerProxy.RESPONSE_ACTION_KEY;
        //@ts-ignore
        return { [key]: actionName, args };
    }
    call(shapeOrPackageName, method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof shapeOrPackageName === 'string') {
                return this.callBackendMethod(shapeOrPackageName, method, args);
            }
            else {
                return this.callShapeMethod(shapeOrPackageName, method, args);
            }
        });
    }
    callCustomShapeMethod(shape, method, methodName, body, headers) {
        let { shapeClass, packageName, shapeURI } = this.parseShape(shape);
        //NOTE: custom calls are not going straight to the localServer on nodejs, so that request.body is available.
        return fetch(`${this.rootUrl}/call/${packageName}/${shapeClass.name}/${methodName}?shapeURI=${shapeURI}`, {
            method: method,
            headers: headers || {}, //NOTE: custom shape methods do not use LincdServerProxy.defaultHeaders,
            body,
        })
            .then((res) => {
            if (res.ok) {
                return res.json();
            }
            else {
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
    customPost(route, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = JSON.stringify(args);
            return this.fetchBackend(`${this.rootUrl}${route}`, body);
        });
    }
    callBackendMethod(packageName, methodOrConfig, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let [method, headers, setLoaded, overwriteData] = this.parseMethod(methodOrConfig);
            //if this IS the backend
            if (this.localServer &&
                (typeof methodOrConfig == 'string' || !methodOrConfig.forceFetch)) {
                //then call the server directly
                return this.localServer.callBackendMethod(packageName, method, args);
            }
            else {
                let body = JSON.stringify({ args });
                let root = this.rootUrl;
                return this.fetchBackend(`${root}/call/${packageName}/${method}`, body, headers, setLoaded, overwriteData);
            }
        });
    }
    parseMethod(method) {
        if (typeof method === 'string') {
            return [method];
        }
        else {
            return [
                method.method,
                method.headers,
                method.setLoaded,
                method.overwriteData,
            ];
        }
    }
    callShapeMethod(shape, methodOrConfig, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let [method, headers, setLoaded, overwriteData] = this.parseMethod(methodOrConfig);
            let { shapeClass, shapeURI, packageName } = this.parseShape(shape);
            const instanceNode = getInstanceNode(shape);
            if (this.localServer &&
                (typeof methodOrConfig == 'string' || !methodOrConfig.forceFetch)) {
                return this.localServer.callShapeMethod(packageName, method, shapeURI, instanceNode, args);
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
            return this.fetchBackend(`${root}/call/${packageName}/${shapeClass.name}/${method}`, body, headers, setLoaded, overwriteData);
        });
    }
    parseShape(shape) {
        let shapeClass = getShapeClass(shape);
        let SHACL_Shape = shapeClass.shape;
        let shapeURI = SHACL_Shape === null || SHACL_Shape === void 0 ? void 0 : SHACL_Shape.id;
        let packageName = getShapePackageNameFromUri(shapeURI);
        return {
            shapeClass,
            SHACL_Shape,
            shapeURI,
            packageName,
        };
    }
    fetchBackend(url_1, body_1, headers_1) {
        return __awaiter(this, arguments, void 0, function* (url, body, headers, setLoaded = false, overwriteData = false) {
            return fetch(url, {
                method: 'POST',
                headers: Object.assign({}, LincdServerProxy.defaultHeaders, headers || {}),
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
                }
                else {
                    console.warn('Could not complete server call: ' + res.statusText);
                }
            })
                .then((json) => {
                //if instead of a normal data response the server returns an action, handle it
                if (json && json[LincdServerProxy.RESPONSE_ACTION_KEY]) {
                    if (this.handleResponseAction(json[LincdServerProxy.RESPONSE_ACTION_KEY])) {
                        return;
                    }
                }
                return json;
            })
                .catch((err) => {
                console.warn('Error during server call: ', err);
                throw err;
            });
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
exports.LincdServerProxy = LincdServerProxy;
/**
 * Use this key in a json response to trigger an action on the frontend.
 */
LincdServerProxy.RESPONSE_ACTION_KEY = '__action';
LincdServerProxy.actionHandlers = new Map();
LincdServerProxy.defaultHeaders = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
};
//# sourceMappingURL=LincdServerProxy.js.map