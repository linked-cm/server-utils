"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWriter = void 0;
/**
 * Simplified JSONWriter for @_linked/core.
 *
 * Handles: Shape instances, Shape classes, Date, ShapeSet, CoreSet, CoreMap,
 * plain objects/arrays, and primitives.
 *
 * All graph-model types (Graph, NamedNode, BlankNode, Literal, Quad, QuadSet,
 * QuadArray, NodeSet, URIMappings) have been removed — they no longer exist
 * in @_linked/core.
 */
const Shape_1 = require("@_linked/core/shapes/Shape");
const ShapeSet_1 = require("@_linked/core/collections/ShapeSet");
const CoreSet_1 = require("@_linked/core/collections/CoreSet");
const CoreMap_1 = require("@_linked/core/collections/CoreMap");
class JSONWriter {
    /**
     * Convert any object to a JSON string.
     * The result is meant to be consumed by JSONParser.
     */
    static stringify(object) {
        const jsObject = this.toJsObject(object);
        return JSON.stringify(jsObject);
    }
    /**
     * Convert any object to a plain JS object suitable for JSON.stringify.
     * Recursively converts Shape instances, Shape classes, Dates, and collections.
     */
    static toJsObject(object) {
        if (object === null ||
            object === undefined ||
            typeof object === 'string' ||
            typeof object === 'number' ||
            typeof object === 'boolean') {
            return object;
        }
        if (object instanceof Date) {
            return { __dt: object.toISOString() };
        }
        if (object instanceof Shape_1.Shape) {
            return this.convertShape(object);
        }
        // Shape class (not instance) — check prototype chain
        if ((object === null || object === void 0 ? void 0 : object.prototype) instanceof Shape_1.Shape || object === Shape_1.Shape) {
            return this.convertShapeClass(object);
        }
        if (object instanceof ShapeSet_1.ShapeSet) {
            return this.convertCoreSet(object, 'ss');
        }
        if (object instanceof CoreMap_1.CoreMap) {
            return this.convertCoreMap(object);
        }
        if (object instanceof CoreSet_1.CoreSet) {
            return this.convertCoreSet(object, 'cs');
        }
        if (Array.isArray(object)) {
            return object.map((item) => this.toJsObject(item));
        }
        if (typeof object === 'object') {
            const result = {};
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    result[key] = this.toJsObject(object[key]);
                }
            }
            return result;
        }
        return object;
    }
    static convertShape(shape) {
        var _a;
        if (!shape.nodeShape) {
            console.warn('Shape is not linked and cannot be converted to JSON: ' +
                shape.toString());
        }
        return {
            __s: (_a = shape.nodeShape) === null || _a === void 0 ? void 0 : _a.id,
            u: shape.id,
        };
    }
    static convertShapeClass(shapeClass) {
        var _a;
        if (!shapeClass.shape) {
            console.warn('Shape class is not linked and cannot be converted to JSON: ' +
                shapeClass.name);
        }
        return {
            __sc: (_a = shapeClass.shape) === null || _a === void 0 ? void 0 : _a.id,
        };
    }
    static convertCoreSet(set, type) {
        const entries = [];
        set.forEach((item) => {
            entries.push(this.toJsObject(item));
        });
        return { __type: type, entries };
    }
    static convertCoreMap(map) {
        const entries = [];
        map.forEach((value, key) => {
            entries.push([this.toJsObject(key), this.toJsObject(value)]);
        });
        return { __type: 'cm', entries };
    }
}
exports.JSONWriter = JSONWriter;
//# sourceMappingURL=JSONWriter.js.map