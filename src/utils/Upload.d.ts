import { File } from 'formidable';
export declare const absoluteFileSystemDataPath: string;
export declare const absoluteFileSystemUploadPath: string;
export declare const relativeFileSystemDataPath: string;
export declare const relativeFileSystemUploadPath: string;
type UploadTarget = {
    targetFileName: string;
    targetFilePath: string;
    publicURL: string;
};
/**
 * Get the target file name and path for a file upload
 * @param fileName The original file name
 * @param mimetype The mimetype of the file
 * @param allowedExtensions An array of allowed file extensions
 * @param addSuffix A suffix to add to the file name
 */
export declare function getUploadTarget(fileName: string, mimetype?: string, allowedExtensions?: string[], addSuffix?: string, accessURL?: string, preventDuplicates?: boolean): UploadTarget;
type UploadSingleFileFromFormData = {
    file: File;
    allowedExtensions?: string[];
    processDataFn?: (data: any) => any;
    addSuffix?: string;
};
export declare function uploadSingleFileFromFormData({ file, allowedExtensions, processDataFn, addSuffix, }: UploadSingleFileFromFormData): Promise<string>;
type UploadSingleFileFromBufferType = {
    buffer: Buffer;
    fileName: string;
    allowedExtensions?: string[];
    addSuffix?: string;
};
export declare function uploadSingleFileFromBuffer({ buffer, fileName, allowedExtensions, addSuffix, }: UploadSingleFileFromBufferType): Promise<string>;
export {};
