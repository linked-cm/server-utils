"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html = void 0;
const react_1 = __importDefault(require("react"));
const AppContext_js_1 = require("./AppContext.js");
const LinkedFileStorage_1 = require("@_linked/core/utils/LinkedFileStorage");
exports.Html = react_1.default.memo(({ 
//on the frontend data will not be set yet, but it will be present in the initial HTML as a script tag with JSON-LD inside, with the ID: request-ld
//so here we read that back to the data variable, so that the rendering (of that same <script> tag) will be identical as the backend
title = process.env.APP_NAME, children, customHead, style, }) => {
    let { assets, requestObject, requestLD, preloadScripts, preloadStyles, expressRequest, } = (0, AppContext_js_1.useAppContext)();
    if (typeof window !== 'undefined') {
        // On the client, do not render <html> or <head>
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    // Get the matched route key from the request for preloading
    const matchedRouteKey = expressRequest === null || expressRequest === void 0 ? void 0 : expressRequest['matchedRouteKey'];
    // On the server, render the full HTML document
    return (react_1.default.createElement("html", { lang: "en" },
        react_1.default.createElement("head", null,
            react_1.default.createElement("title", null, title),
            react_1.default.createElement("meta", { charSet: "utf-8" }),
            react_1.default.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" }), preloadScripts === null || preloadScripts === void 0 ? void 0 :
            preloadScripts.map((href) => (react_1.default.createElement("link", { key: href, rel: "modulepreload", href: href, as: "script" }))), preloadStyles === null || preloadStyles === void 0 ? void 0 :
            preloadStyles.map((href) => (react_1.default.createElement("link", { key: href, rel: "preload", href: href, as: "style" }))),
            matchedRouteKey && (react_1.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `window.__PRELOAD_ROUTES__ = ${JSON.stringify([
                        matchedRouteKey,
                    ])};`,
                } })),
            react_1.default.createElement("link", { rel: "shortcut icon", href: (0, LinkedFileStorage_1.asset)('/favicon.ico') }),
            react_1.default.createElement("link", { rel: "icon", href: (0, LinkedFileStorage_1.asset)('/favicon-144x144.png'), sizes: "144x144" }),
            react_1.default.createElement("link", { rel: "icon", href: (0, LinkedFileStorage_1.asset)('/favicon-72x72.png'), sizes: "72x72" }),
            react_1.default.createElement("link", { rel: "icon", href: (0, LinkedFileStorage_1.asset)('/favicon-57x57.png'), sizes: "57x57" }),
            react_1.default.createElement("link", { rel: "shortcut icon", href: (0, LinkedFileStorage_1.asset)('/favicon-144x144.png'), sizes: "144x144" }),
            react_1.default.createElement("link", { rel: "apple-touch-icon", href: (0, LinkedFileStorage_1.asset)('/favicon-144x144.png'), sizes: "144x144" }),
            react_1.default.createElement("link", { rel: "apple-touch-icon", href: (0, LinkedFileStorage_1.asset)('/favicon-72x72.png'), sizes: "72x72" }),
            react_1.default.createElement("link", { rel: "apple-touch-icon", href: (0, LinkedFileStorage_1.asset)('/favicon-57x57.png'), sizes: "57x57" }),
            react_1.default.createElement("link", { rel: "stylesheet", href: assets['main.css'] }), preloadStyles === null || preloadStyles === void 0 ? void 0 :
            preloadStyles.map((href) => (react_1.default.createElement("link", { key: href, rel: "stylesheet", href: href }))),
            react_1.default.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
                .app-loading {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                }
                .app-root {
                  display: none;
                  animation: fadeIn 0.15s ease-in;
                }
                html.css-ready .app-root {
                  display: block;
                }
                html.css-ready .app-loading {
                  display: none;
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `,
                } }),
            react_1.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `
                (function() {
                  var routeStylesheets = ${JSON.stringify(preloadStyles || [])};
                  
                  function checkMainCssLoaded() {
                    var style = getComputedStyle(document.documentElement);
                    var primaryColor = style.getPropertyValue('--color-primary-600');
                    return primaryColor && primaryColor.trim() !== '';
                  }
                  
                  function checkAllStylesheetsLoaded() {
                    // Check main CSS
                    if (!checkMainCssLoaded()) {
                      return false;
                    }
                    
                    // Check if all route-specific stylesheets are loaded
                    // Extract just the filename from full URLs for comparison
                    var styleSheets = Array.from(document.styleSheets);
                    for (var i = 0; i < routeStylesheets.length; i++) {
                      var routeHref = routeStylesheets[i];
                      // Extract filename (e.g., "signin.css" from full URL)
                      var filename = routeHref.split('/').pop();
                      
                      var found = styleSheets.some(function(sheet) {
                        try {
                          // Check if stylesheet href contains the filename
                          if (sheet.href && sheet.href.indexOf(filename) !== -1) {
                            // Try to access cssRules to verify it's loaded and accessible
                            return sheet.cssRules && sheet.cssRules.length > 0;
                          }
                          return false;
                        } catch (e) {
                          // CORS or not loaded yet
                          return false;
                        }
                      });
                      
                      if (!found) {
                        return false;
                      }
                    }
                    return true;
                  }
                  
                  function showContent() {
                    document.documentElement.classList.add('css-ready');
                  }
                  
                  // Poll until all CSS is loaded
                  var checkInterval = setInterval(function() {
                    if (checkAllStylesheetsLoaded()) {
                      showContent();
                      clearInterval(checkInterval);
                    }
                  }, 16); // ~60fps
                  
                  // Fallback after 2 seconds
                  setTimeout(function() {
                    showContent();
                    clearInterval(checkInterval);
                  }, 2000);
                })();
              `,
                } }),
            customHead,
            react_1.default.createElement("script", { id: "request-ld", type: "application/ld+json", dangerouslySetInnerHTML: { __html: requestLD } }),
            react_1.default.createElement("script", { id: "request-json", type: "application/json", dangerouslySetInnerHTML: { __html: requestObject } })),
        react_1.default.createElement("body", { style: Object.assign({ margin: 0, padding: 0 }, style) },
            react_1.default.createElement("noscript", { dangerouslySetInnerHTML: {
                    __html: `<b>Enable JavaScript to run this app.</b>`,
                } }),
            react_1.default.createElement("div", { id: "root" }, children),
            react_1.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `assetManifest = ${JSON.stringify(assets)};`,
                } }))));
});
exports.Html.displayName = 'Html';
//# sourceMappingURL=Html.js.map