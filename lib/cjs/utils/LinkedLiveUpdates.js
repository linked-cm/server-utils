"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedLiveUpdate = exports.updates = void 0;
// export interface ILiveUpdater {
//   getUpdatesSince(timestamp: number): {type:string,data:any}[];
//   send(type: string, data: any): void;
// }
//
// /**
//  * Utility class to send live updates from the backend to the frontend.
//  * Install any error client package like lincd-sentry in your app to log errors.
//  */
// export class LinkedLiveUpdates {
//   private static updater: ILiveUpdater;
//
//   static setDefaultLogger(updater: ILiveUpdater) {
//     this.updater = updater;
//   }
//
//   static hasDefaultUpdater() {
//     return this.updater && true;
//   }
//   static send(type: string, data: any):void {
//     return this.updater.send(type, data);
//   }
//   static getUpdatesSince(timestamp: number): {type:string,data:any}[] {
//     return this.updater.getUpdatesSince(timestamp);
//   }
// }
//
const Server_js_1 = require("./Server.js");
const package_js_1 = require("../package.js");
exports.updates = [];
class LinkedLiveUpdate {
    /**
     * To be used on the backend to send updates to the frontend.
     * @param type
     * @param data
     */
    static send(type, data) {
        //on the backend we store the updates in memory in an exported variable called updates
        const newMessage = {
            timestamp: Date.now(),
            type,
            data,
        };
        exports.updates.push(newMessage);
        //for multicore environments, we batch updates to avoid sending too many messages
        this.batchedUpdates.push(newMessage);
    }
    /**
     * To be used on the frontend to get the latest updates from the backend.
     * @param timestamp
     */
    static getUpdatesSince(timestamp = Date.now(), limit = 10) {
        // see backend.ts in this package for implementation
        return Server_js_1.Server.call(package_js_1.packageName, 'getUpdatesSince', timestamp, limit);
    }
}
exports.LinkedLiveUpdate = LinkedLiveUpdate;
LinkedLiveUpdate.batchedUpdates = [];
//# sourceMappingURL=LinkedLiveUpdates.js.map