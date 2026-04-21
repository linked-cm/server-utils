/**
 * Simplified JSONParser for @_linked/core.
 *
 * Handles: Shape instances, Shape classes, Date, ShapeSet, CoreSet, CoreMap,
 * plain objects/arrays, and primitives.
 *
 * All graph-model types (Graph, NamedNode, BlankNode, Literal, Quad, QuadSet,
 * QuadArray, NodeSet, URIMappings, N3 data) have been removed — they no longer
 * exist in @_linked/core.
 */
import { Shape } from '@_linked/core/shapes/Shape';
import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { CoreSet } from '@_linked/core/collections/CoreSet';
import { CoreMap } from '@_linked/core/collections/CoreMap';
import { getShapeClass } from '@_linked/core/utils/ShapeClass';
export class JSONParser {
    /**
     * Parse a JSON string back into typed objects.
     */
    static parse(json) {
        const object = JSON.parse(json);
        return this.parseObject(object);
    }
    /**
     * Convert a plain JS object back into typed objects.
     * Recognizes markers (__s, __sc, __dt, __type) and reconstructs
     * the corresponding Shape/collection instances.
     */
    static parseObject(object) {
        return this.parseInternal(object);
    }
    static parseInternal(object) {
        if (object === null ||
            object === undefined ||
            typeof object === 'string' ||
            typeof object === 'number' ||
            typeof object === 'boolean') {
            return object;
        }
        if (Array.isArray(object)) {
            return object.map((item) => this.parseInternal(item));
        }
        if (typeof object !== 'object') {
            return object;
        }
        // Collection types
        if ('__type' in object) {
            const type = object.__type;
            if (type === 'ss') {
                return this.createShapeSet(object);
            }
            if (type === 'cs') {
                return this.createCoreSet(object);
            }
            if (type === 'cm') {
                return this.createCoreMap(object);
            }
        }
        // Shape instance: {__s: nodeShapeURI, u: instanceURI}
        if ('__s' in object) {
            return this.createShape(object);
        }
        // Shape class: {__sc: nodeShapeURI}
        if ('__sc' in object) {
            return this.createShapeClass(object);
        }
        // Date: {__dt: ISO string}
        if ('__dt' in object) {
            return new Date(object.__dt);
        }
        // Legacy wrapper — just unwrap
        if ('__n' in object) {
            return this.parseInternal(object.__n);
        }
        // Plain object — recursively parse values
        const result = {};
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                result[key] = this.parseInternal(object[key]);
            }
        }
        return result;
    }
    static createShape(object) {
        const ShapeClass = getShapeClass(object.__s);
        if (!ShapeClass) {
            console.warn(`Unknown shape class ${object.__s}, using generic Shape. ` +
                `The shape class is probably not loaded.`);
            return new Shape({ id: object.u });
        }
        return new ShapeClass({ id: object.u });
    }
    static createShapeClass(object) {
        const ShapeClass = getShapeClass(object.__sc);
        if (!ShapeClass) {
            console.warn(`Unknown shape class ${object.__sc}, using generic Shape. ` +
                `The shape class is probably not loaded.`);
            return Shape;
        }
        return ShapeClass;
    }
    static createShapeSet(object) {
        const set = new ShapeSet();
        for (const entry of object.entries) {
            set.add(this.parseInternal(entry));
        }
        return set;
    }
    static createCoreSet(object) {
        const set = new CoreSet();
        for (const entry of object.entries) {
            set.add(this.parseInternal(entry));
        }
        return set;
    }
    static createCoreMap(object) {
        const map = new CoreMap();
        for (const entry of object.entries) {
            const [key, value] = entry;
            map.set(this.parseInternal(key), this.parseInternal(value));
        }
        return map;
    }
}
//# sourceMappingURL=JSONParser.js.map