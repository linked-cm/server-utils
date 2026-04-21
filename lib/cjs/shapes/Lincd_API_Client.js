"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lincd_API_Client = void 0;
const Shape_1 = require("@_linked/core/shapes/Shape");
const package_js_1 = require("../package.js");
const lincd_server_utils_js_1 = require("../ontologies/lincd-server-utils.js");
function buildQueryObject(query) {
    if (query && typeof query.build === 'function') {
        return query.build();
    }
    return query;
}
let Lincd_API_Client = class Lincd_API_Client extends Shape_1.Shape {
    static getFromURI(uri) {
        return new this(uri);
    }
    selectQuery(query) {
        return this.call('select', { query: buildQueryObject(query) });
    }
    updateQuery(query) {
        return this.call('update', { query: buildQueryObject(query) });
    }
    createQuery(query) {
        return this.call('create', { query: buildQueryObject(query) });
    }
    deleteQuery(query) {
        return this.call('delete', { query: buildQueryObject(query) });
    }
    selectRaw(query) {
        return this.call('select_raw', { query });
    }
    call(method, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = JSON.stringify(payload);
            const res = yield fetch(`${this.uri}/${method}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            if (!res.ok) {
                console.warn('Could not complete API call: ' + res.statusText);
                throw new Error(`Could not complete API call: ${res.statusText}`);
            }
            return res.json();
        });
    }
};
exports.Lincd_API_Client = Lincd_API_Client;
Lincd_API_Client.targetClass = lincd_server_utils_js_1.lincdServerUtils.Lincd_API_Client;
exports.Lincd_API_Client = Lincd_API_Client = __decorate([
    package_js_1.linkedShape
], Lincd_API_Client);
//# sourceMappingURL=Lincd_API_Client.js.map