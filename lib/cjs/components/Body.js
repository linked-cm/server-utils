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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = exports.useCurrentPath = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Body_module_css_1 = __importDefault(require("./Body.module.css"));
const Spinner_js_1 = require("./Spinner.js");
function getPageClass(currentRoute) {
    let pageClassName = currentRoute.substring(1).replace(/[-:\/]+/g, '_');
    return pageClassName || 'home';
}
const useCurrentPath = (appRoutes) => {
    const location = (0, react_router_dom_1.useLocation)();
    let routes = Object.keys(appRoutes).map((key) => {
        return {
            path: appRoutes[key].path,
        };
    });
    const matches = (0, react_router_dom_1.matchRoutes)(routes, location);
    return matches && matches.length > 0 ? matches[0].route.path : null;
};
exports.useCurrentPath = useCurrentPath;
const logged = new Set();
exports.Body = react_1.default.memo(({ children, pageStyles = {}, className = '', routes, style, loadingSpinner, }) => {
    //calculate the name of a css class from the current route
    //these can then be defined in Content.scss to overwrite for example the background color of the entire page
    let currentRoute = (0, exports.useCurrentPath)(routes) || '';
    // Compute the page class based on the current route
    let pageClass = (0, react_1.useMemo)(() => getPageClass(currentRoute), [currentRoute]);
    let pageClassStyleObject = pageStyles || Body_module_css_1.default;
    // Use the calculated pageClass, or fallback to default
    let pageClassFromCssModule = (pageClass && pageClassStyleObject[pageClass]) ||
        pageClassStyleObject['pageDefault'] ||
        Body_module_css_1.default['pageDefault'] ||
        '';
    if (pageStyles &&
        pageClass &&
        !pageStyles[pageClass] &&
        typeof window !== 'undefined' &&
        !logged.has(pageClass)) {
        logged.add(pageClass);
        console.info(`No page css class defined for '.${pageClass}' in <Body pageStyles />. Using '.pageDefault' instead`);
    }
    // Build the final className
    const finalClassName = pageClassFromCssModule + (className ? ' ' + className : '');
    return (react_1.default.createElement(react_1.default.Fragment, null,
        loadingSpinner && (react_1.default.createElement("div", { className: "app-loading" }, loadingSpinner || react_1.default.createElement(Spinner_js_1.Spinner, null))),
        react_1.default.createElement("div", { className: "app-root" },
            react_1.default.createElement("div", { "aria-label": "body-container", className: finalClassName, style: style }, children))));
});
//# sourceMappingURL=Body.js.map