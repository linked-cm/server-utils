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
import { Server } from './Server.js';
import { packageName } from '../package.js';

export interface UpdateMessage {
  timestamp: number;
  type: string;
  data: any;
}
export const updates: UpdateMessage[] = [];
export class LinkedLiveUpdate {
  static batchedUpdates: UpdateMessage[] = [];

  /**
   * To be used on the backend to send updates to the frontend.
   * @param type
   * @param data
   */
  public static send(type: string, data: any): void {
    //on the backend we store the updates in memory in an exported variable called updates
    const newMessage: UpdateMessage = {
      timestamp: Date.now(),
      type,
      data,
    };
    updates.push(newMessage);

    //for multicore environments, we batch updates to avoid sending too many messages
    this.batchedUpdates.push(newMessage);
  }

  /**
   * To be used on the frontend to get the latest updates from the backend.
   * @param timestamp
   */
  public static getUpdatesSince(
    timestamp: number = Date.now(),
    limit: number = 10
  ): Promise<UpdateMessage[]> {
    // see backend.ts in this package for implementation
    return Server.call(packageName, 'getUpdatesSince', timestamp, limit);
  }
}
