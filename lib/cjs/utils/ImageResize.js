"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResizedImagePath = void 0;
const ServerPaths_js_1 = require("./ServerPaths.js");
function getResizedImagePath(fullImagePath, width = NaN, height = NaN) {
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    }
    //dont add query string if no image path
    if (!fullImagePath)
        return fullImagePath;
    const hasWidth = isNumber(width);
    const hasHeight = isNumber(height);
    // If no target dimensions are provided, serve original image directly.
    // This avoids generating /resized URLs that cannot be processed.
    if (!hasWidth && !hasHeight)
        return fullImagePath;
    //replace the normal upload path with the resized path, see LincdServer for more info how this works
    if (fullImagePath.startsWith(process.env.SITE_ROOT + ServerPaths_js_1.publicUploadPath)) {
        // if the image path starts with the public upload path, replace the path with the resized path, and add the query string to the image path
        // example: https://domain.com/uploads/2019/01/01/image.jpg -> https://domain.com/resized/2019/01/01/image.jpg
        return (fullImagePath.replace(ServerPaths_js_1.publicUploadPath + '/', ServerPaths_js_1.publishResizedImagePath + '/') +
            '?' +
            (hasWidth ? 'w=' + width : '') +
            (hasHeight ? (hasWidth ? '&' : '') + 'h=' + height : ''));
    }
    else {
        // if the image path does not start with the public upload path, add the query string to the image path
        // example: https://domain.com/uploads/2019/01/01/image.jpg -> https://domain.com/resized/?src=/uploads/2019/01/01/image.jpg&w=100&h=100
        return (process.env.SITE_ROOT +
            ServerPaths_js_1.publishResizedImagePath +
            '/?src=' +
            fullImagePath +
            '&' +
            (hasWidth ? 'w=' + width : '') +
            (hasHeight ? (hasWidth ? '&' : '') + 'h=' + height : ''));
    }
}
exports.getResizedImagePath = getResizedImagePath;
//# sourceMappingURL=ImageResize.js.map