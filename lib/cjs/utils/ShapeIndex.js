"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShapeIndex = exports.getShapeFromIndex = exports.shapeIndex = void 0;
// Shared mutable state — syncShapes() writes, getShapeIndex() reads
exports.shapeIndex = {};
function getShapeFromIndex(uri) {
    return exports.shapeIndex[uri];
}
exports.getShapeFromIndex = getShapeFromIndex;
function getShapeIndex() {
    return exports.shapeIndex;
}
exports.getShapeIndex = getShapeIndex;
//# sourceMappingURL=ShapeIndex.js.map