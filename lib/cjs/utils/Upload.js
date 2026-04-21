"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleFileFromBuffer = exports.uploadSingleFileFromFormData = exports.getUploadTarget = exports.relativeFileSystemUploadPath = exports.relativeFileSystemDataPath = exports.absoluteFileSystemUploadPath = exports.absoluteFileSystemDataPath = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ServerPaths_js_1 = require("./ServerPaths.js");
const LinkedFileStorage_1 = require("@_linked/core/utils/LinkedFileStorage");
//See LincdServer static file routes
exports.absoluteFileSystemDataPath = path_1.default.join(process.cwd(), 'data');
exports.absoluteFileSystemUploadPath = path_1.default.join(exports.absoluteFileSystemDataPath + ServerPaths_js_1.publicUploadPath);
exports.relativeFileSystemDataPath = path_1.default.join('./data');
exports.relativeFileSystemUploadPath = path_1.default.join(exports.relativeFileSystemDataPath + ServerPaths_js_1.publicUploadPath);
/**
 * Get the target file name and path for a file upload
 * @param fileName The original file name
 * @param mimetype The mimetype of the file
 * @param allowedExtensions An array of allowed file extensions
 * @param addSuffix A suffix to add to the file name
 */
function getUploadTarget(fileName, mimetype, allowedExtensions, addSuffix, accessURL, preventDuplicates = true) {
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
    const targetFilePath = exports.relativeFileSystemUploadPath + '/' + targetFileName;
    const publicURL = (accessURL || LinkedFileStorage_1.LinkedFileStorage.accessURL) +
        ServerPaths_js_1.publicUploadPath +
        '/' +
        targetFileName;
    return { targetFileName, targetFilePath, publicURL };
}
exports.getUploadTarget = getUploadTarget;
function uploadSingleFileFromFormData({ file, allowedExtensions, processDataFn, addSuffix, }) {
    let { targetFileName } = getUploadTarget(file.originalFilename, file.mimetype, allowedExtensions, addSuffix, '', false);
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            fs_1.default.readFile(file.filepath, (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject('error in upload from file:' + err);
                }
                // process the data if a function is provided.
                // example: compress the image function
                if (processDataFn) {
                    data = yield Promise.resolve(processDataFn(data));
                }
                // upload the file to the storage
                const updatePublicURL = yield LinkedFileStorage_1.LinkedFileStorage.saveFile(targetFileName, data);
                resolve(updatePublicURL);
            }));
        }
        catch (err) {
            reject('error in upload from file:' + err);
        }
    }));
}
exports.uploadSingleFileFromFormData = uploadSingleFileFromFormData;
function uploadSingleFileFromBuffer({ buffer, fileName, allowedExtensions, addSuffix, }) {
    let { targetFileName } = getUploadTarget(fileName, null, allowedExtensions, addSuffix, '', false);
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let updatedPublicURL = yield LinkedFileStorage_1.LinkedFileStorage.saveFile(targetFileName, buffer);
            resolve(updatedPublicURL);
        }
        catch (err) {
            reject('error in upload from buffer' + err);
        }
    }));
}
exports.uploadSingleFileFromBuffer = uploadSingleFileFromBuffer;
//# sourceMappingURL=Upload.js.map