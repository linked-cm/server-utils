import path from 'path';
import fs from 'fs';
import { publicUploadPath } from './ServerPaths.js';
import { LinkedFileStorage } from '@_linked/core/utils/LinkedFileStorage';
//See LincdServer static file routes
export const absoluteFileSystemDataPath = path.join(process.cwd(), 'data');
export const absoluteFileSystemUploadPath = path.join(absoluteFileSystemDataPath + publicUploadPath);
export const relativeFileSystemDataPath = path.join('./data');
export const relativeFileSystemUploadPath = path.join(relativeFileSystemDataPath + publicUploadPath);
/**
 * Get the target file name and path for a file upload
 * @param fileName The original file name
 * @param mimetype The mimetype of the file
 * @param allowedExtensions An array of allowed file extensions
 * @param addSuffix A suffix to add to the file name
 */
export function getUploadTarget(fileName, mimetype, allowedExtensions, addSuffix, accessURL, preventDuplicates = true) {
    // Check if a `/` or a `\` is in the filename
    // and present a warning to let the dev know
    // if (fileName.match(/[\\/]/g)) {
    //   console.warn(
    //     `Filename contains path separator.  Pass ONLY the name instead of the whole filepath: '${fileName}'`,
    //   );
    // }
    //replace any non-alphanumeric characters with a dash and make it lowercase
    var sanitisedName = fileName
        .replace(/[^A-Za-z0-9\._\/]+/gi, '-')
        .toLowerCase();
    var ext;
    //auto add extension if none is present, based on the mimetype
    if (sanitisedName.indexOf('.') === -1) {
        if (mimetype) {
            ext = mimetype.split('/')[1];
            sanitisedName = sanitisedName + '.' + ext;
        }
        else {
            throw new Error('This file does not have an extension and no mimetype was provided');
        }
    }
    else {
        //make sure the given extension is allowed
        ext = sanitisedName.split('.').pop();
        if (allowedExtensions && !allowedExtensions.includes(ext)) {
            console.warn('Extension ' + ext + ' is not allowed for this file upload');
            return null;
        }
    }
    // get the file name without the extension. e.g: filename.jpg -> filename
    // this will be use for base name of the file
    let filename = sanitisedName.substring(0, sanitisedName.length - (ext.length + 1));
    // add the suffix to filename. e.g: filename -> filename_suffix
    let targetFileNameSuffix = '';
    if (addSuffix) {
        targetFileNameSuffix = '_' + addSuffix;
    }
    // generate a random string suffix if duplicates are allowed. default is true
    const randomStringSuffix = preventDuplicates
        ? '_' + Math.random().toString(36).substring(2, 8)
        : ''; // 6 digit random string. example: 312acb
    // let targetFilePath: string = fileSystemUploadPath + '/' + targetFileName;
    // add 6 digit random string to the filename to avoid conflicts. example: filename_312acb.jpg
    // update the targetFileName and targetFilePath
    const targetFileName = filename + targetFileNameSuffix + randomStringSuffix + '.' + ext;
    const targetFilePath = relativeFileSystemUploadPath + '/' + targetFileName;
    const publicURL = (accessURL || LinkedFileStorage.accessURL) +
        publicUploadPath +
        '/' +
        targetFileName;
    return { targetFileName, targetFilePath, publicURL };
}
export function uploadSingleFileFromFormData({ file, allowedExtensions, processDataFn, addSuffix, }) {
    let { targetFileName } = getUploadTarget(file.originalFilename, file.mimetype, allowedExtensions, addSuffix, '', false);
    return new Promise(async (resolve, reject) => {
        try {
            fs.readFile(file.filepath, async (err, data) => {
                if (err) {
                    reject('error in upload from file:' + err);
                }
                // process the data if a function is provided.
                // example: compress the image function
                if (processDataFn) {
                    data = await Promise.resolve(processDataFn(data));
                }
                // upload the file to the storage
                const updatePublicURL = await LinkedFileStorage.saveFile(targetFileName, data);
                resolve(updatePublicURL);
            });
        }
        catch (err) {
            reject('error in upload from file:' + err);
        }
    });
}
export function uploadSingleFileFromBuffer({ buffer, fileName, allowedExtensions, addSuffix, }) {
    let { targetFileName } = getUploadTarget(fileName, null, allowedExtensions, addSuffix, '', false);
    return new Promise(async (resolve, reject) => {
        try {
            let updatedPublicURL = await LinkedFileStorage.saveFile(targetFileName, buffer);
            resolve(updatedPublicURL);
        }
        catch (err) {
            reject('error in upload from buffer' + err);
        }
    });
}
//# sourceMappingURL=Upload.js.map