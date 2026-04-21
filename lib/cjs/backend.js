"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincdServerUtilsBackendProvider = void 0;
//import your providers here (providers only run in the backend)
require("./utils/BackendProvider.js");
require("./utils/ShapeProvider.js");
require("./utils/Upload.js");
const BackendProvider_js_1 = require("./utils/BackendProvider.js");
const Upload_js_1 = require("./utils/Upload.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LinkedFileStorage_1 = require("@_linked/core/utils/LinkedFileStorage");
const LinkedLiveUpdates_js_1 = require("./utils/LinkedLiveUpdates.js");
const cluster_1 = __importDefault(require("cluster"));
const Server_js_1 = require("./utils/Server.js");
const MAX_BROADCAST_TIME = 15 * 60 * 1000; //15 minutes in ms
let lastBroadcastTime = Date.now();
class LincdServerUtilsBackendProvider extends BackendProvider_js_1.BackendProvider {
    setupBeforeControllers() {
        this.setupLiveUpdatesMulticore();
        // No need to continue to run local file-system based checks
        // if we're using a CDN or a different service to deliver assets
        if (LinkedFileStorage_1.LinkedFileStorage.accessURL !== process.env.SITE_ROOT) {
            return;
        }
        //check if folder data/uploads exists
        if (!fs_1.default.existsSync(Upload_js_1.relativeFileSystemUploadPath)) {
            fs_1.default.mkdirSync(Upload_js_1.relativeFileSystemUploadPath, { recursive: true });
        }
        let resizedImagesCachePath = path_1.default.join(Upload_js_1.relativeFileSystemUploadPath, 'resized');
        if (!fs_1.default.existsSync(resizedImagesCachePath)) {
            fs_1.default.mkdirSync(resizedImagesCachePath, { recursive: true });
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
        if (cluster_1.default.isWorker) {
            //automatically set up the LinkedLiveUpdate class to sync between cores if we're in a worker
            //send messages
            setInterval(() => {
                const lincdServer = Server_js_1.Server.getLocalServer();
                const currentTime = Date.now();
                if (lincdServer) {
                    const serverIsBusy = lincdServer === null || lincdServer === void 0 ? void 0 : lincdServer.busy;
                    if (serverIsBusy &&
                        currentTime - lastBroadcastTime < MAX_BROADCAST_TIME) {
                        // this.log('Worker is busy, skipping broadcast of queued live updates');
                        return;
                    }
                }
                if (LinkedLiveUpdates_js_1.LinkedLiveUpdate.batchedUpdates.length > 0) {
                    // console.log(
                    //   `${process.pid} sending ${LinkedLiveUpdate.batchedUpdates.length} updates to primary`,
                    // );
                    process.send({
                        cmd: 'liveUpdates',
                        updates: LinkedLiveUpdates_js_1.LinkedLiveUpdate.batchedUpdates,
                        sender: process.pid,
                    });
                    LinkedLiveUpdates_js_1.LinkedLiveUpdate.batchedUpdates = [];
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
                                LinkedLiveUpdates_js_1.updates.push(msg);
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
        const filtered = LinkedLiveUpdates_js_1.updates.filter((update) => update.timestamp > timestamp);
        // if limit is provided, slice the array to the limit
        // and return the most recent messages
        if (limit > 0) {
            return filtered.slice(-limit);
        }
        return filtered;
    }
}
exports.LincdServerUtilsBackendProvider = LincdServerUtilsBackendProvider;
//# sourceMappingURL=backend.js.map