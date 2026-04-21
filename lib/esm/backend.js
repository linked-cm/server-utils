//import your providers here (providers only run in the backend)
import './utils/BackendProvider.js';
import './utils/ShapeProvider.js';
import './utils/Upload.js';
import { BackendProvider } from './utils/BackendProvider.js';
import { relativeFileSystemUploadPath } from './utils/Upload.js';
import fs from 'fs';
import path from 'path';
import { LinkedFileStorage } from '@_linked/core/utils/LinkedFileStorage';
import { updates, LinkedLiveUpdate, } from './utils/LinkedLiveUpdates.js';
import cluster from 'cluster';
import { Server } from './utils/Server.js';
const MAX_BROADCAST_TIME = 15 * 60 * 1000; //15 minutes in ms
let lastBroadcastTime = Date.now();
export class LincdServerUtilsBackendProvider extends BackendProvider {
    setupBeforeControllers() {
        this.setupLiveUpdatesMulticore();
        // No need to continue to run local file-system based checks
        // if we're using a CDN or a different service to deliver assets
        if (LinkedFileStorage.accessURL !== process.env.SITE_ROOT) {
            return;
        }
        //check if folder data/uploads exists
        if (!fs.existsSync(relativeFileSystemUploadPath)) {
            fs.mkdirSync(relativeFileSystemUploadPath, { recursive: true });
        }
        let resizedImagesCachePath = path.join(relativeFileSystemUploadPath, 'resized');
        if (!fs.existsSync(resizedImagesCachePath)) {
            fs.mkdirSync(resizedImagesCachePath, { recursive: true });
        }
        // for(let i = 0; i < 1; i++)
        // {
        //   LinkedLiveUpdate.send('activity',{
        //     countryCode: 'us',
        //     message: `pid ${process.pid}`,
        //   });
        // }
    }
    setupLiveUpdatesMulticore() {
        if (cluster.isWorker) {
            //automatically set up the LinkedLiveUpdate class to sync between cores if we're in a worker
            //send messages
            setInterval(() => {
                const lincdServer = Server.getLocalServer();
                const currentTime = Date.now();
                if (lincdServer) {
                    const serverIsBusy = lincdServer === null || lincdServer === void 0 ? void 0 : lincdServer.busy;
                    if (serverIsBusy &&
                        currentTime - lastBroadcastTime < MAX_BROADCAST_TIME) {
                        // this.log('Worker is busy, skipping broadcast of queued live updates');
                        return;
                    }
                }
                if (LinkedLiveUpdate.batchedUpdates.length > 0) {
                    // console.log(
                    //   `${process.pid} sending ${LinkedLiveUpdate.batchedUpdates.length} updates to primary`,
                    // );
                    process.send({
                        cmd: 'liveUpdates',
                        updates: LinkedLiveUpdate.batchedUpdates,
                        sender: process.pid,
                    });
                    LinkedLiveUpdate.batchedUpdates = [];
                    lastBroadcastTime = currentTime;
                }
            }, 10000); // send updates every second
            //process incoming messages
            process.on('message', (primaryMsg) => {
                if (primaryMsg.cmd === 'batch') {
                    primaryMsg.messages.forEach((workerMsg) => {
                        if (workerMsg.sender === process.pid) {
                            // console.log(`${workerMsg.cmd} ignored own message`);
                            return;
                        }
                        if (workerMsg.cmd === 'liveUpdates') {
                            workerMsg.updates.forEach((msg) => {
                                updates.push(msg);
                            });
                            // console.log(
                            //   `${process.pid} received ${workerMsg.updates.length} updates from worker ${workerMsg.sender}`,
                            // );
                            // console.log(`${process.pid} messages now: ${updates.map((u) => u.data.message).join(', ')}`);
                        }
                    });
                }
            });
        }
    }
    getUpdatesSince(timestamp, limit = 10) {
        const filtered = updates.filter((update) => update.timestamp > timestamp);
        // if limit is provided, slice the array to the limit
        // and return the most recent messages
        if (limit > 0) {
            return filtered.slice(-limit);
        }
        return filtered;
    }
}
//# sourceMappingURL=backend.js.map