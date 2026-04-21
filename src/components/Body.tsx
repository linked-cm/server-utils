import React, { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import styles from './Body.module.css';
import { Spinner } from './Spinner.js';

function getPageClass(currentRoute: string) {
  let pageClassName = currentRoute.substring(1).replace(/[-:\/]+/g, '_');
  return pageClassName || 'home';
}

export const useCurrentPath = (appRoutes) => {
  const location = useLocation();
  let routes = Object.keys(appRoutes).map((key) => {
    return {
      path: appRoutes[key].path,
    };
  });
  const matches = matchRoutes(routes, location);
  return matches && matches.length > 0 ? matches[0].route.path : null;
};

const logged = new Set();
export const Body = React.memo<{
  children;
  pageStyles?;
  className?;
  routes?;
  style?;
  loadingSpinner?: React.ReactNode;
}>(
  ({
    children,
    pageStyles = {},
    className = '',
    routes,
    style,
    loadingSpinner,
  }) => {
    //calculate the name of a css class from the current route
    //these can then be defined in Content.scss to overwrite for example the background color of the entire page
    let currentRoute = useCurrentPath(routes) || '';

    // Compute the page class based on the current route
    let pageClass = useMemo(() => getPageClass(currentRoute), [currentRoute]);

    let pageClassStyleObject = pageStyles || styles;

    // Use the calculated pageClass, or fallback to default
    let pageClassFromCssModule =
      (pageClass && pageClassStyleObject[pageClass]) ||
      pageClassStyleObject['pageDefault'] ||
      styles['pageDefault'] ||
      '';

    if (
      pageStyles &&
      pageClass &&
      !pageStyles[pageClass] &&
      typeof window !== 'undefined' &&
      !logged.has(pageClass)
    ) {
      logged.add(pageClass);
      console.info(
        `No page css class defined for '.${pageClass}' in <Body pageStyles />. Using '.pageDefault' instead`
      );
    }

    // Build the final className
    const finalClassName =
      pageClassFromCssModule + (className ? ' ' + className : '');

    return (
      <>
        {/* Loading spinner - shown by default, hidden when CSS loads via pre-hydration script */}
        {loadingSpinner && (
          <div className="app-loading">{loadingSpinner || <Spinner />}</div>
        )}

        {/* App content - hidden by default, shown when CSS loads via pre-hydration script */}
        <div className="app-root">
          <div
            aria-label="body-container"
            className={finalClassName}
            style={style}
          >
            {children}
          </div>
        </div>
      </>
    );
  }
);
