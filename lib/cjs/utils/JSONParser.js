"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParser = void 0;
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
const Shape_1 = require("@_linked/core/shapes/Shape");
const ShapeSet_1 = require("@_linked/core/collections/ShapeSet");
const CoreSet_1 = require("@_linked/core/collections/CoreSet");
const CoreMap_1 = require("@_linked/core/collections/CoreMap");
const ShapeClass_1 = require("@_linked/core/utils/ShapeClass");
class JSONParser {
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
        const ShapeClass = (0, ShapeClass_1.getShapeClass)(object.__s);
        if (!ShapeClass) {
            console.warn(`Unknown shape class ${object.__s}, using generic Shape. ` +
                `The shape class is probably not loaded.`);
            return new Shape_1.Shape({ id: object.u });
        }
        return new ShapeClass({ id: object.u });
    }
    static createShapeClass(object) {
        const ShapeClass = (0, ShapeClass_1.getShapeClass)(object.__sc);
        if (!ShapeClass) {
            console.warn(`Unknown shape class ${object.__sc}, using generic Shape. ` +
                `The shape class is probably not loaded.`);
            return Shape_1.Shape;
        }
        return ShapeClass;
    }
    static createShapeSet(object) {
        const set = new ShapeSet_1.ShapeSet();
        for (const entry of object.entries) {
            set.add(this.parseInternal(entry));
        }
        return set;
    }
    static createCoreSet(object) {
        const set = new CoreSet_1.CoreSet();
        for (const entry of object.entries) {
            set.add(this.parseInternal(entry));
        }
        return set;
    }
    static createCoreMap(object) {
        const map = new CoreMap_1.CoreMap();
        for (const entry of object.entries) {
            const [key, value] = entry;
            map.set(this.parseInternal(key), this.parseInternal(value));
        }
        return map;
    }
}
exports.JSONParser = JSONParser;
//# sourceMappingURL=JSONParser.js.map