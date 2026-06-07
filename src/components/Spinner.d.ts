import React from 'react';
interface SpinnerProps {
    active?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
}
export declare function Spinner({ active, size, color, className, }: SpinnerProps): React.JSX.Element;
export default Spinner;
