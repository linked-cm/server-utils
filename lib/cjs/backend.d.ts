import './utils/BackendProvider.js';
import './utils/ShapeProvider.js';
import './utils/Upload.js';
import { BackendProvider } from './utils/BackendProvider.js';
import { UpdateMessage } from './utils/LinkedLiveUpdates.js';
export declare class LincdServerUtilsBackendProvider extends BackendProvider {
    setupBeforeControllers(): void;
    setupLiveUpdatesMulticore(): void;
    getUpdatesSince(timestamp: number, limit?: number): UpdateMessage[];
}
