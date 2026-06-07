/**
 * Shape index — read-only access to the shape metadata index.
 * The index itself is populated by syncShapes() in @_linked/server (backend-only).
 * Frontend code uses getShapeIndex() and getShapeFromIndex() to read it.
 */
import type { ShapeDetails } from '../types/ShapeDetails.js';
export declare const shapeIndex: Record<string, ShapeDetails>;
export declare function getShapeFromIndex(uri: string): ShapeDetails;
export declare function getShapeIndex(): Record<string, ShapeDetails>;
