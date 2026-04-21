import React, { createContext, useContext } from 'react';

export const AppContext: React.Context<AppContextProps> = createContext(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

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

export function AppContextProvider({
  assets,
  isNativeApp,
  requestLD,
  requestObject,
  expressRequest,
  expressResponse,
  preloadScripts,
  preloadStyles,
  children,
}: AppContextProps & React.PropsWithChildren) {
  return (
    <AppContext.Provider
      value={{
        assets,
        isNativeApp,
        requestLD,
        requestObject,
        expressRequest,
        expressResponse,
        preloadScripts,
        preloadStyles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
