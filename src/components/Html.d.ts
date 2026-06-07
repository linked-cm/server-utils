import React from 'react';
interface HtmlProps extends React.PropsWithChildren {
    title: string;
    customHead: any;
    style?: React.CSSProperties;
}
export declare const Html: React.NamedExoticComponent<HtmlProps>;
export {};
