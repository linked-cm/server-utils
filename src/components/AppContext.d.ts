import React from 'react';
export declare const AppContext: React.Context<AppContextProps>;
export declare const useAppContext: () => AppContextProps;
export type AppContextProps = {
    assets?: any;
    isNativeApp?: boolean;
    requestLD?: any;
    requestObject?: any;
    expressRequest?: any;
    expressResponse?: any;
    preloadScripts?: string[];
    preloadStyles?: string[];
};
export declare function AppContextProvider({ assets, isNativeApp, requestLD, requestObject, expressRequest, expressResponse, preloadScripts, preloadStyles, children, }: AppContextProps & React.PropsWithChildren): React.JSX.Element;
