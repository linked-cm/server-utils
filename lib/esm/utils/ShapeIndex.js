// Shared mutable state — syncShapes() writes, getShapeIndex() reads
export const shapeIndex = {};
export function getShapeFromIndex(uri) {
    return shapeIndex[uri];
}
export function getShapeIndex() {
    return shapeIndex;
}
//# sourceMappingURL=ShapeIndex.js.map