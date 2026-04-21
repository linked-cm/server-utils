export declare class JSONParser {
    /**
     * Parse a JSON string back into typed objects.
     */
    static parse<T>(json: string): T;
    /**
     * Convert a plain JS object back into typed objects.
     * Recognizes markers (__s, __sc, __dt, __type) and reconstructs
     * the corresponding Shape/collection instances.
     */
    static parseObject<T>(object: any): T;
    private static parseInternal;
    private static createShape;
    private static createShapeClass;
    private static createShapeSet;
    private static createCoreSet;
    private static createCoreMap;
}
