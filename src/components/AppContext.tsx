import React, { createContext, useContext } from 'react';

// Pinned on globalThis so re-evaluation cannot fork the context object.
// The dev server loads this module on two different lifecycles: LinkedServer
// imports `AppContextProvider` statically and is instantiated once at boot,
// while the consumers below it (`AppRoot`, `Html`) arrive via
// `vite.ssrLoadModule('/src/App.tsx')`, which is re-evaluated on every full SSR
// invalidation. A bare `createContext` call would then hand the consumers a NEW
// context while the provider still holds the boot-time one — `useAppContext()`
// finds no matching provider, returns null, and every SSR render throws
// "Cannot destructure property 'isNativeApp' of useAppContext()".
const contextHost = globalThis as typeof globalThis & {
  __linkedAppContext?: React.Context<AppContextProps>;
};

export const AppContext: React.Context<AppContextProps> =
  contextHost.__linkedAppContext ??
  (contextHost.__linkedAppContext = createContext<AppContextProps>(null));

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
