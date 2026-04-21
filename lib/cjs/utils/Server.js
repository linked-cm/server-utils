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
exports.Server = void 0;
const LincdServerProxy_js_1 = require("./LincdServerProxy.js");
let proxy = process.env.SITE_ROOT
    ? LincdServerProxy_js_1.LincdServerProxy.getFromURI(process.env.SITE_ROOT)
    : null;
/**
 * This helper class makes API calls to a LincdServer backend easy by calling Server.call()
 * This class is intended to be used on the frontend (and will also work on the backend for SSR)
 */
class Server {
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
        LincdServerProxy_js_1.LincdServerProxy.addDefaultHeaders(headers);
    }
    /**
     * Register a handler for a response action.
     * Response actions are triggered by the server by returning a json response with a key of `LincdServerProxy.RESPONSE_ACTION_KEY` and a value of the action name.
     * They allow custom actions like redirects, alerts, and other UI changes to be triggered by the server.
     * @param actionName
     * @param handler
     */
    static registerActionHandler(actionName, handler) {
        LincdServerProxy_js_1.LincdServerProxy.registerActionHandler(actionName, handler);
    }
    /**
     * Create a response action object that can be returned by a server call to trigger an action on the frontend.
     * @param actionName
     * @param args
     */
    static createResponseAction(actionName, ...args) {
        return LincdServerProxy_js_1.LincdServerProxy.createResponseAction(actionName, ...args);
    }
    static call(shapeOrPackageName, method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return proxy.call(shapeOrPackageName, method, ...args);
        });
    }
    static customPost(route, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return proxy.customPost(route, ...args);
        });
    }
    static callCustomShapeMethod(shape, httpMethod, methodName, body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return proxy.callCustomShapeMethod(shape, httpMethod, methodName, body, headers);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map