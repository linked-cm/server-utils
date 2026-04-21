"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendProvider = void 0;
const path_1 = __importDefault(require("path"));
class BackendProvider {
    constructor(server, lincdServer) {
        this.server = server;
        this.lincdServer = lincdServer;
    }
    /**
     * Each request, all providers are given the opportunity to provide data for the request.
     * For example, a provider that handles logins, may return data about the current user
     * This data will then be available on the frontend right upon initialisation
     */
    supplyDataForRequest(request, response, data) {
        return null;
    }
    initRequest(request, response) {
        this.request = request;
        this.response = response;
    }
    setupBeforeControllers() { }
    setupBeforeCatchAllControllers() { }
    setupAfterControllers() { }
    assignEnvPathToField(envKey, field) {
        return __awaiter(this, void 0, void 0, function* () {
            let envValue = process.env[envKey];
            if (envValue) {
                if (envValue.indexOf('./') === 0) {
                    envValue = path_1.default.resolve(process.cwd(), envValue);
                }
                try {
                    //require the path defined in the environment variable
                    let envModule = yield Promise.resolve(`${envValue}`).then(s => __importStar(require(s)));
                    //if the module has a default export, use that
                    if (envModule.default) {
                        this[field] = envModule.default;
                    }
                    else {
                        //otherwise, use the first named export
                        let keys = Object.getOwnPropertyNames(envModule).filter((p) => p !== '__esModule');
                        if (keys.length > 0) {
                            this[field] = envModule[keys[0]];
                        }
                        else {
                            console.warn(process.env[envKey] + ' does not export a default or named export');
                        }
                    }
                }
                catch (e) {
                    console.error('Error loading ' +
                        process.env[envKey] +
                        ' defined by environment variable ' +
                        envKey, e);
                }
            }
        });
    }
    callOtherProvider(provider) {
        //init and return a new instance of the given provider with the same request and response
        let authProvider = new provider(this.server, this.lincdServer);
        authProvider.request = this.request;
        authProvider.response = this.response;
        // authProvider.initRequest(this.request, this.response);
        return authProvider;
    }
}
exports.BackendProvider = BackendProvider;
//# sourceMappingURL=BackendProvider.js.map