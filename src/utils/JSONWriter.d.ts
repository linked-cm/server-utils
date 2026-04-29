export declare class JSONWriter {
    /**
     * Convert any object to a JSON string.
     * The result is meant to be consumed by JSONParser.
     */
    static stringify(object: any): string;
    /**
     * Convert any object to a plain JS object suitable for JSON.stringify.
     * Recursively converts Shape instances, Shape classes, Dates, and collections.
     */
    static toJsObject(object: any): any;
    private static convertShape;
    private static convertShapeClass;
    private static convertCoreSet;
    private static convertCoreMap;
}
