/**
 * Shape index — read-only access to the shape metadata index.
 * The index itself is populated by syncShapes() in @_linked/server (backend-only).
 * Frontend code uses getShapeIndex() and getShapeFromIndex() to read it.
 */
import type { ShapeDetails } from '../types/ShapeDetails.js';

// Shared mutable state — syncShapes() writes, getShapeIndex() reads
export const shapeIndex: Record<string, ShapeDetails> = {};

export function getShapeFromIndex(uri: string) {
  return shapeIndex[uri];
}

export function getShapeIndex(): Record<string, ShapeDetails> {
  return shapeIndex;
}
