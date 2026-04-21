import React, { createContext, useContext } from 'react';
export const AppContext = createContext(null);
export const useAppContext = () => {
    return useContext(AppContext);
};
export function AppContextProvider({ assets, isNativeApp, requestLD, requestObject, expressRequest, expressResponse, preloadScripts, preloadStyles, children, }) {
    return (React.createElement(AppContext.Provider, { value: {
            assets,
            isNativeApp,
            requestLD,
            requestObject,
            expressRequest,
            expressResponse,
            preloadScripts,
            preloadStyles,
        } }, children));
}
//# sourceMappingURL=AppContext.js.map