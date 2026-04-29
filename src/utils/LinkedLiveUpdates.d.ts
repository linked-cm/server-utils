export interface UpdateMessage {
    timestamp: number;
    type: string;
    data: any;
}
export declare const updates: UpdateMessage[];
export declare class LinkedLiveUpdate {
    static batchedUpdates: UpdateMessage[];
    /**
     * To be used on the backend to send updates to the frontend.
     * @param type
     * @param data
     */
    static send(type: string, data: any): void;
    /**
     * To be used on the frontend to get the latest updates from the backend.
     * @param timestamp
     */
    static getUpdatesSince(timestamp?: number, limit?: number): Promise<UpdateMessage[]>;
}
