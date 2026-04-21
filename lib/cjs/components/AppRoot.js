"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoot = void 0;
const react_1 = __importStar(require("react"));
const Html_js_1 = require("./Html.js");
const Body_js_1 = require("./Body.js");
const Head_js_1 = require("./Head.js");
const AppContext_js_1 = require("./AppContext.js");
const Prefix_1 = require("@_linked/core/utils/Prefix");
//register the prefix for the data root for this app
Prefix_1.Prefix.add(process.env.APP_PREFIX, process.env.DATA_ROOT + '/');
function isReactElement(arg) {
    return arg.hasOwnProperty('type');
}
exports.AppRoot = react_1.default.memo(({ children, style }) => {
    let { isNativeApp } = (0, AppContext_js_1.useAppContext)();
    //find the Head and Body child components
    const childrenArray = react_1.default.Children.toArray(children);
    const HeadChild = childrenArray.find((child) => isReactElement(child) && child.type === Head_js_1.Head);
    let bodyChild = childrenArray.find((child) => isReactElement(child) && child.type === Body_js_1.Body);
    //if no <Body> tag was used, then we just render all children
    if (!bodyChild) {
        //remove HeadChild if any
        if (HeadChild) {
            childrenArray.splice(childrenArray.indexOf(HeadChild), 1);
        }
        bodyChild = childrenArray;
    }
    //for the app, we already have a fixed index file under web, so we just render the body
    // with the same providers and props though
    let RootElement;
    let rootProps;
    if (isNativeApp) {
        //for native apps, we already render <html> in the static html file and we just render into the body
        RootElement = react_1.Fragment;
    }
    else {
        //for web apps, we render everything, including the <html> tag
        RootElement = Html_js_1.Html;
        rootProps = {
            customHead: HeadChild,
            style,
        };
    }
    return react_1.default.createElement(RootElement, Object.assign({}, rootProps), bodyChild);
});
//# sourceMappingURL=AppRoot.js.map