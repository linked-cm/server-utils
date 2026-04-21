var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Shape } from '@_linked/core/shapes/Shape';
import { linkedShape } from '../package.js';
import { lincdServerUtils } from '../ontologies/lincd-server-utils.js';
function buildQueryObject(query) {
    if (query && typeof query.build === 'function') {
        return query.build();
    }
    return query;
}
let Lincd_API_Client = class Lincd_API_Client extends Shape {
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
    async call(method, payload) {
        let body = JSON.stringify(payload);
        const res = await fetch(`${this.uri}/${method}`, {
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
    }
};
Lincd_API_Client.targetClass = lincdServerUtils.Lincd_API_Client;
Lincd_API_Client = __decorate([
    linkedShape
], Lincd_API_Client);
export { Lincd_API_Client };
//# sourceMappingURL=Lincd_API_Client.js.map